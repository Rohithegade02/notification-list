# Notification System (Mobile)

A React Native application demonstrating a high-performance notification list with search, pagination, and detail views. Built with **Expo** and **TypeScript** using **Atomic Design** and **Container/Presenter** patterns.

## Features

### 1. Notifications List
-   **Visual Indicators**: Color-coded badges for notification types (Transactional, Marketing, Alert, Info).
-   **Details**: Displays title, truncated body, relative timestamp (e.g., "5m ago"), and read status styling.
-   **Performance**: Optimized `FlatList` handling 100+ items smoothly.

### 2. Search
-   **Real-time Filter**: Search by title or body.
-   **Debounce**: Input is debounced by **400ms** to prevent excessive processing/API calls.

### 3. Pagination
-   **Infinite Scroll**: Automatically loads more items (10 per batch) when reaching the end of the list.
-   **Loading States**: distinct footer loader for pagination and main screen loader for initial fetch.

### 4. Detail View
-   **Modal**: Tapping a notification opens a lightweight modal overlay with the full message content.

### 5. Mock Data & Simulation
-   **Generator**: Client-side generation of 100 deterministic mock notifications.
-   **Network Simulation**: Artificial **300ms delay** on all data fetching to mimic real-world network interaction.

---

## Technical Decisions

### Architecture: Container / Presenter Pattern
-   **Separation of Concerns**: Logic (state, hooks, handlers) is strictly separated from UI (JSX, styles).
    -   `NotificationListContainer`: Handles `useNotifications`, `useDebounce`, and search logic.
    -   `NotificationListScreen`: Pure presentation component receiving props.
-   **Testability**: Makes it easier to unit test logic independent of React Native rendering.

### Component Structure: Atomic Design
-   **Atoms**: Base primitives like `AppText`, `Badge`.
-   **Molecules**: Composite parts like `NotificationCard`, `SearchBar`.
-   **Screens**: assembled pages.

### State Management: Custom Hooks
-   **`useNotifications`**: Encapsulates the complexity of pagination, searching, buffering, and caching.
-   **`useDebounce`**: Generic hook for delaying value updates.

---

## Optimization Techniques

1.  **List Virtualization**:
    -   configured `FlatList` with `maxToRenderPerBatch`, `initialNumToRender`, and `updateCellsBatchingPeriod` to balance memory usage and scroll speed.
    -   Enabled `removeClippedSubviews` to unmount off-screen components on Android.

2.  **Memoization**:
    -   **`React.memo`**: Applied to `NotificationCard` and List Screens to prevent re-renders when parent state changes (e.g., typing in search bar shouldn't re-render all list items).
    -   **`useCallback`**: All event handlers passed to children are memoized to preserve formatting.

3.  **Caching**:
    -   Implemented a simple in-memory cache in `useNotifications` to store results of previous searches or pages, reducing redundant "network" calls.

---

## Setup & Running Locally

### Prerequisites
-   Node.js & npm/bun
-   Expo Go app on your physical device OR iOS Simulator / Android Emulator

### Installation

1.  Navigate to the mobile directory:
    ```bash
    cd mobile
    ```

2.  Install dependencies:
    ```bash
    bun install
    # or
    npm install
    ```

### Running the App

Start the Metro Bundler:

```bash
bun start --ios     # For iOS Simulator
# or
bun start --android # For Android Emulator
# or
bun start           # To read QR code for physical device
```
