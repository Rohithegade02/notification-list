# System Architecture: High-Throughput Notification System

## Problem Statement
Architect a backend for a notification system serving React Native and React Web clients. It must handle high write throughput, decouple slow external providers (Email/Push), support real-time web updates, and manage offline mobile users.

---

## 1. Architecture Diagram

```mermaid
graph TD
    Client["Client Services"] -->|POST /send| LB["Load Balancer"]
    WebClient["Web Client"] <-->|WebSocket| LB

    subgraph API_Layer ["API Layer"]
        direction TB
        LB --> API1["API Server 1"]
        LB --> API2["API Server 2"]
        LB --> API3["API Server 3"]
    end

    subgraph Core_System ["Core System"]
        direction TB
        API1 & API2 & API3 -->|Persist| DB[("MongoDB")]
        API1 & API2 & API3 -->|Publish| MQ["Message Queue"]
        MQ --> Router["Delivery Router"]
    end

    subgraph Processing_Layer ["Processing Layer"]
        direction TB
        Router --> Redis["Redis (Presence Cache)"]

        Router -->|online| W_InApp["In-App / Push Workers"]
        Router -->|offline| Q_P0["Email P0 (Transactional)"]
        Router --> Q_P1["Email P1 (Alerts)"]
        Router --> Q_P2["Email P2 (Marketing)"]

        Q_P0 --> W_Email["Email Workers"]
        Q_P1 --> W_Email
        Q_P2 --> W_Email

        W_InApp -->|Update| DB
        W_InApp -->|Publish| RT["Real-Time Service"]
        W_InApp -->|Send| P_Push["Push Provider"]

        W_Email -->|Push| Q_Email_RL["Email Rate Limit Queue"]
        Q_Email_RL -->|Fetch| S_Email["Email Sender"]
        S_Email -->|Send| P_Email["Email Provider (SendGrid)"]

        %% Retry & DLQ
        S_Email -.->|Fail| R_Email["Retry Queue"]
        R_Email -->|Retry| S_Email
        R_Email -.->|Max Retries| DLQ_Email["Email DLQ"]
    end

    subgraph External_Services ["External Services"]
        direction TB
        P_Email -.->|Webhook| P_Webhook["Webhook Handler"]
        P_Push -.->|Webhook| P_Webhook
        P_Webhook -->|Update| DB
    end

    subgraph End_Users ["End Users"]
        direction TB
        P_Push -->|Deliver| User(("User Device"))
        RT -->|Deliver| WebClient
        User -->|Fetch| LB
        WebClient -->|Fetch| LB
    end


```

## 2. Addressing Constraints & Requirements

### 1. "Sending notifications is slow and unreliable"  
**Solution: Async Queue & Worker Pattern**

- The API persists the notification and publishes it to a Message Queue.
- Workers asynchronously process delivery, so the API never blocks.
- Retry queues handle transient failures; DLQ captures permanent failures.

This ensures low latency, fault tolerance, and isolation from provider outages.

---

### 2. "Real-time updates are required for the Web client"  
**Solution: Dedicated Real-Time Service**

- A WebSocket-based Real-Time Service maintains live connections.
- When the In-App worker processes a notification, it publishes it to the RT service.
- If the user is offline, the notification remains stored and is fetched later.

---

### 3. "Mobile apps rely on Push when closed"  
**Solution: Push Provider Integration**

- In-App / Push workers send push notifications via FCM/APNS.
- The OS handles background delivery when the device becomes reachable.

---

### 4. "Gracefully handle offline users"  
**Solution: Presence-Aware Routing via Redis**

- Redis tracks user presence (`online` / `offline`) using TTL-based keys.
- Router chooses the delivery channel:
  - **Online** → In-App / Push  
  - **Offline** → Email  

This avoids unnecessary emails and improves user experience.

---

### 5. "The system must scale to handle traffic spikes"  
**Solution: Horizontal Scaling & Buffering**

- The Message Queue buffers traffic bursts.
- Stateless APIs and workers scale horizontally.
- Auto-scaling can be driven by queue depth.

---

### 6. "Prevent provider overload and respect rate limits"  
**Solution: Rate-Limited Sender Queues**

- Workers push messages into a provider-specific rate-limit queue.
- Sender services drain these queues at safe rates, protecting API quotas.

---

### 7. Handle Different Business Priorities  
**Solution: Priority Queues**

The system classifies notifications based on business importance and processes them using priority queues to ensure critical messages are delivered first.

| Type           | Priority | Queue Level |
|----------------|----------|-------------|
| Transactional  | P0       | Highest     |
| Alerts         | P1       | Medium      |
| Marketing      | P2       | Lowest      |

Email workers always consume higher-priority queues before lower-priority ones, ensuring that important notifications are never delayed by non-critical traffic.
