# System Architecture: High-Throughput Notification System

## Problem Statement
Architect a backend for a notification system serving React Native and React Web clients. It must handle high write throughput, decouple slow external providers (Email/Push), support real-time web updates, and manage offline mobile users.

## 1. Architecture Diagram

```mermaid
graph TD
    Client["Client Services"] -->|POST /send| LB["Load Balancer"]
    WebClient["Web Client"] <-->|WebSocket| LB
    
    subgraph API_Cluster
        API1["API Server 1"]
        API2["API Server 2"]
        API3["API Server 3"]
    end

    LB -->|Round Robin| API1
    LB -->|Round Robin| API2
    LB -->|Round Robin| API3

    
    subgraph CoreSystem
        API1 & API2 & API3 -->|Persist| DB[("MongoDB")]
        API1 & API2 & API3 -->|Publish| MQ["Message Queue"]
        
        MQ -->|Topic: in-app| W_InApp["In-App Workers"]
        MQ -->|Topic: email| W_Email["Email Workers"]
        MQ -->|Topic: push| W_Push["Push Workers"]
    end
    
    subgraph WorkersLayer
        Q_Email_RL["Email Rate Limit Queue"]
        Q_Push_RL["Push Rate Limit Queue"]
        S_Email["Email Sender"]
        S_Push["Push Sender"]

        W_Email -->|Push| Q_Email_RL
        W_Push -->|Push| Q_Push_RL
        
        Q_Email_RL -->|Fetch| S_Email
        Q_Push_RL -->|Fetch| S_Push
        
        S_Email -->|Send| P_Email["Email Provider"]
        S_Push -->|Send| P_Push["Push Provider"]
        
        W_InApp -->|Update DB| DB
        W_InApp -->|Update DB| DB
        W_InApp -->|Publish| RT["Real-Time Service"]
    end
    
    subgraph FeedbackLoop
        P_Email -.->|Webhook| P_Webhook["Webhook Handler"]
        P_Push -.->|Webhook| P_Webhook
        P_Webhook -->|Update| DB
    end

    User(("User Device"))
    P_Push -->|Deliver| User
    RT -->|Deliver| WebClient
    User -->|Fetch| LB
    WebClient -->|Fetch| LB
```

## 2. Addressing Constraints & Requirements

### 1. "Sending notifications is slow and unreliable"
**Solution: Async Queue & Worker Pattern**
-   **Non-blocking API**: The **Load Balancer** distributes requests to one of the **API Servers**. The server receives the request, persists it as `pending` in MongoDB, and acknowledges the client immediately (`202 Accepted`).
-   **Decoupling**: The actual sending happens asynchronously via the **Message Queue**.
-   **Worker Isolation**: Separate worker pools for Email and Push ensure that if SendGrid provider is slow, it doesn't backlog the Push notifications.

### 2. "Real-time updates are required for the Web client"
**Solution: accessible Real-Time Service (WebSocket/SSE)**
-   **Dedicated Service**: A lightweight NodeJS/Go service maintains per-user WebSocket connections.
-   **Event-Driven**: When the `In-App Worker` processes a notification, it publishes a redis-sub event. The Real-Time Service subscribes to this node and immediately pushes the payload to the connected Web Client.
-   **Fallback**: If the user is not connected (offline), the notification remains in MongoDB. The next time the user loads the page, they fetch unread items from the API.

### 3. "Mobile apps rely on Push when closed"
**Solution: Dual-Channel Delivery**
-   **Push Channel**: The `Push Worker` specifically targets mobile device tokens (FCM/APNS). This channel operates independently of the real-time channel.
-   **Offline Handling**: Push notifications are natively designed for offline/background delivery by the OS. The server sends the payload to FCM, and FCM delivers it when the device is reachable.

### 4. "The system must scale to handle traffic spikes"
**Solution: Horizontal Scaling & Buffering**
-   **mq Buffering**: The Message Queue acts as a shock absorber. A spike of 10k req/sec is safely queued, even if workers can only process 5k/sec. The queue grows, but the system doesn't crash.
-   **Auto-scaling Workers**: We can autoscale the number of Worker instances based on queue lag (e.g., if queue > 1000, add 5 workers).
-   **Stateless Services**: The **API Servers** and Workers are stateless, allowing infinite horizontal scaling behind the **Load Balancer**.

### 5. "Prevent Crashing Providers & Adhere to Rate Limits"
**Solution: Rate Limiting Queues (Token Bucket)**
-   **Problem**: Workers might process 1000 items/sec, but SendGrid only allows 100/sec.
-   **Second Queue Layer**: After the main worker formats the message, it pushes it to a `Provider Queue`.
-   **Controlled Consumption**: A separate "Sender" service consumes from this queue at a fixed rate (e.g., creating a "Leaky Bucket" effect). This ensures we never exceed the provider's API limits, protecting both our system and our account standing.

## 3. Data Flow Summary
## 3. Data Flow Summary
1.  **Ingestion**: LB accepts request -> API Server -> Save to DB -> Push to Queue.
2.  **Processing**: Workers pull from Queue.
    -   **Push**: Format -> Push to `Push Rate Limit Queue` -> Sender sends to FCM.
    -   **Email**: Format -> Push to `Email Rate Limit Queue` -> Sender sends to SendGrid.
    -   **In-App**: Update DB -> Publish to Real-Time Service.
3.  **Delivery**:
    -   **Mobile**: Receive FCM Push.
    -   **Web**: Receive WebSocket event (if online) or View Notification Bell (if offline).
