import { useCallback, useEffect, useRef, useState } from 'react';
import { Notification } from '../types/notification';
import { fetchNotifications } from '../utils/mockServer';

export const useNotifications = (searchQuery: string) => {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // Prevent race conditions
    const currentQuery = useRef(searchQuery);

    // Reset and fetch first page when query changes
    useEffect(() => {
        currentQuery.current = searchQuery;
        let isActive = true;

        const fetchFirstPage = async () => {
            setLoading(true);
            try {
                const { items: newItems, hasMore: moreAvailable } = await fetchNotifications(1, 10, searchQuery);
                if (isActive && currentQuery.current === searchQuery) {
                    setItems(newItems);
                    setHasMore(moreAvailable);
                    setPage(2); // Next page is 2
                }
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            } finally {
                if (isActive && currentQuery.current === searchQuery) {
                    setLoading(false);
                }
            }
        };

        fetchFirstPage();

        return () => {
            isActive = false;
        };
    }, [searchQuery]);

    // Load more notifications
    const loadMore = useCallback(async () => {
        if (loading || !hasMore || refreshing) return;

        setLoading(true);
        try {
            const { items: newItems, hasMore: moreAvailable } = await fetchNotifications(
                page,
                10,
                searchQuery
            );

            setItems(prev => [...prev, ...newItems]);
            setHasMore(moreAvailable);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Failed to load more declarations', error);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, refreshing, searchQuery]);

    // Refresh notifications
    const refresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const { items: newItems, hasMore: moreAvailable } = await fetchNotifications(
                1,
                10,
                searchQuery
            );
            setItems(newItems);
            setHasMore(moreAvailable);
            setPage(2);
        } finally {
            setRefreshing(false);
        }
    }, [searchQuery]);

    return { items, loading, hasMore, loadMore, refresh, refreshing };
};
