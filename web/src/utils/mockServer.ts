import { Notification, NotificationType } from '../types/notification';

const TYPES: NotificationType[] = ['transactional', 'marketing', 'alert', 'info'];
const TITLES = [
    'Order Shipped', 'New Sale!', 'Security Alert', 'Welcome', 'Payment Received',
    'System Update', 'Friend Request', 'New Message', 'Daily Digest', 'Password Changed'
];
const BODIES = [
    'Your order #12345 has been shipped.',
    'Get 50% off on all items today!',
    'Unusual login attempt detected.',
    'Thanks for signing up.',
    'We received your payment of $50.',
    'Maintenance scheduled for tonight.',
    'John sent you a friend request.',
    'You have a new private message.',
    'Here is your daily summary.',
    'Your password was updated successfully.'
];

// Generate 100 mock items deterministic-ish
let MOCK_DATA: Notification[] = Array.from({ length: 100 }, (_, i) => ({
    id: `id-${i}`,
    type: TYPES[i % TYPES.length],
    title: `${TITLES[i % TITLES.length]}`,
    body: `${BODIES[i % BODIES.length]} This is some extra text to simulate a truncated body that is longer.`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    isRead: i > 20,
}));

export const fetchNotifications = async (
    page: number = 1,
    pageSize: number = 100, // Default fetch all for table usually, or implement server pagination
    query: string = ''
): Promise<{ items: Notification[]; total: number }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = MOCK_DATA;
            if (query) {
                const lowerQuery = query.toLowerCase();
                filtered = MOCK_DATA.filter(
                    item =>
                        item.title.toLowerCase().includes(lowerQuery) ||
                        item.body.toLowerCase().includes(lowerQuery)
                );
            }

            // For table, we might just return all or a slice. 
            // Let's return slice if pagination is needed, or just all for simple client-side table
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const items = filtered.slice(start, end);

            resolve({ items, total: filtered.length });
        }, 300);
    });
};

export const createNotification = async (data: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    return new Promise<Notification>((resolve) => {
        setTimeout(() => {
            const newItem: Notification = {
                id: `id-${Date.now()}`,
                timestamp: new Date().toISOString(),
                isRead: false,
                ...data
            };
            MOCK_DATA = [newItem, ...MOCK_DATA];
            resolve(newItem);
        }, 300);
    });
};
