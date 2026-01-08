export type NotificationType = 'transactional' | 'marketing' | 'alert' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    timestamp: string; // ISO string
    isRead: boolean;
}
