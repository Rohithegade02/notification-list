# Notification Admin Panel

A modern React-based admin dashboard for managing notifications, built with **Vite**, **Shadcn/UI**, **TailwindCSS**, and **Bun**.

## Features

### 1. List View
-   **Table View**: Displays all notifications in a clean, paginated table format.
-   **Columns**: Shows Notification Type (color-coded badge), Title, Body (truncated), and Timestamp.

### 2. Actions
-   **Resend (Mocked)**: A "Resend" button on each row allows re-triggering notifications.
-   **Feedback**: Displays a toast notification upon successful action.

### 3. Create Notification
-   **Creation Form**: A modal dialog containing a form to send new notifications.
-   **Fields**: Title, Type (Select), and Body.
-   **Mock Implementation**: Adds the new notification to the local list.

---

## Technical Stack

-   **Runtime/Package Manager**: [Bun](https://bun.sh/)
-   **Framework**: [Vite](https://vitejs.dev/) + React
-   **UI Library**: [Shadcn/UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

---

## Setup & Running Locally

### Prerequisites
-   [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Navigate to the web directory:
    ```bash
    cd web
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

### Running the App

Start the development server:

```bash
bun run dev
```
