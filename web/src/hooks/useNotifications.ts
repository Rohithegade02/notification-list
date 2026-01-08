import { useCallback, useEffect, useState } from 'react';
import { Notification } from '../types/notification';
import { fetchNotifications, createNotification } from '../utils/mockServer';

export const useNotifications = () => {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const { items: data } = await fetchNotifications(1, 100); // Fetch first 100 for now
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const addNotification = async (title: string, body: string, type: any) => {
        const newItem = await createNotification({ title, body, type });
        setItems(prev => [newItem, ...prev]);
    };

    const resendNotification = async (id: string) => {
        // Mock resend
        return new Promise<void>(resolve => setTimeout(resolve, 500));
    }

    return { items, loading, refetch: fetchItems, addNotification, resendNotification };
};
