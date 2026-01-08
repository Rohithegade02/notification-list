# Database Design: Notification System

## Problem Statement
Design a MongoDB schema for a notification system supporting Push, Email, and In-App channels, with individual status tracking and support for various message types.

## 1. Schema Design
We will use a single `notifications` collection to store notification requests. The delivery status for each channel will be tracked in an array of sub-documents, allowing for flexibility and individual status updates.

### Collection: `notifications`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique identifier. |
| `userId` | ObjectId | Yes | Reference to the receiving user. |
| `type` | String | Yes | Message category: `transactional`, `marketing`, `alert`.Enum validated. |
| `validChannels` | [String] | Yes | List of channels intended for this notification (e.g., `["email", "push"]`). |
| `content` | Object | Yes | core content. |
| `content.subject` | String | No | Subject line (email/push title). |
| `content.body` | String | Yes | Main message text. |
| `content.templateId`| String | No | ID if using a template engine. |
| `content.payload` | Object | No | Deep link data or extra JSON payload for push. |
| `delivery` | [Object] | Yes | Array tracking status per channel. |
| `priority` | String | No | `high`, `normal`, `low`. Default `normal`. |
| `createdAt` | Date | Yes | Timestamp of creation. |
| `updatedAt` | Date | Yes | Timestamp of last update. |

### Sub-document: `delivery` (within `notifications`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `channel` | String | Yes | `email`, `push`, `in-app`. |
| `status` | String | Yes | `pending`, `sending`, `sent`, `delivered`, `failed`, `read` (for in-app). |
| `providerMessageId` | String | No | ID returned by provider (e.g., SendGrid/FCM ID). |
| `attemptCount` | Number | Yes | Number of retry attempts. Default 0. |
| `lastAttempt` | Date | No | Timestamp of last send attempt. |
| `failureReason` | String | No | Error message if failed. |
| `sentAt` | Date | No | Timestamp when successfully sent to provider. |
| `deliveredAt` | Date | No | Timestamp when delivery receipt was received. |

#### Example Document
```json
{
  "_id": "609c123...",
  "userId": "507f1f77bcf86cd799439011",
  "type": "transactional",
  "validChannels": ["email", "push", "in-app"],
  "content": {
    "subject": "Your order has shipped!",
    "body": "Order #12345 is on its way.",
    "payload": { "orderId": "12345", "trackingUrl": "..." }
  },
  "delivery": [
    {
      "channel": "email",
      "status": "delivered",
      "providerMessageId": "sg_12345",
      "sentAt": "2023-10-27T10:00:05Z",
      "deliveredAt": "2023-10-27T10:00:15Z"
    },
    {
      "channel": "push",
      "status": "failed",
      "attemptCount": 2,
      "lastAttempt": "2023-10-27T10:05:00Z",
      "failureReason": "Device token invalid"
    },
    {
      "channel": "in-app",
      "status": "read",
      "deliveredAt": "2023-10-27T10:00:01Z"
    }
  ],
  "priority": "high",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:05:00Z"
}
```

## 2. Critical Indexes

We need to ensure high performance for:
1.  **User Feeds**: Retrieving a user's notification history (especially in-app).
2.  **Retry Worker**: Finding notifications that failed or are pending.
3.  **Analytics/Filtering**: Querying by type.

### Index 1: User History
**Definition**: `{ "userId": 1, "createdAt": -1 }`
**Reasoning**:
This is the most frequent query for the mobile app ("Show me my notifications").
-   `userId`: Filters by the specific user.
-   `createdAt`: Sorts by most recent first.
This compound index covers both the equality match on user and the sort operation, preventing in-memory sorts.

**Command:**
```javascript
db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
```

### Index 2: Delivery Status for Retries
**Definition**: `{ "delivery.status": 1, "delivery.channel": 1, "delivery.lastAttempt": 1 }`
**Reasoning**:
Background workers need to efficiently poll for failed or pending messages to process them.
-   `delivery.status`: Allows finding all `failed` or `pending` items.
-   `delivery.channel`: Allows workers to be channel-specific (e.g., an "Email Worker" claiming email tasks).
-   `delivery.lastAttempt`: Used to implement exponential backoff (e.g., "find failed emails where last attempt was > 10 mins ago").
*Note: MongoDB multikey indexes on arrays work well here as we want to find documents containing *any* delivery status matching the criteria.*

**Command:**
```javascript
db.notifications.createIndex({ "delivery.status": 1, "delivery.channel": 1, "delivery.lastAttempt": 1 });
```

### Index 3: Notification Type
**Definition**: `{ "type": 1, "createdAt": -1 }`
**Reasoning**:
Useful for admin dashboards or analytics (e.g., "Show all marketing messages sent today"). It also helps if we want to prioritize `transactional` over `marketing` messages in the worker queues.

**Command:**
```javascript
db.notifications.createIndex({ "type": 1, "createdAt": -1 });
```
