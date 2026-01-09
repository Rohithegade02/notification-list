import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../types/notification';
import { NotificationListScreen } from './NotificationListScreen';

export const NotificationListContainer: React.FC = memo(() => {
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<Notification | null>(null);
    const [data, setData] = useState<Notification[]>([]);

    const debouncedQuery = useDebounce(query, 400);
    const { items, loading, loadMore, refresh, refreshing } =
        useNotifications(debouncedQuery);

    // Sync remote items into local state
    useEffect(() => {
        setData(items);
    }, [items]);

    const handleSearch = useCallback((text: string) => {
        setQuery(text);
    }, []);

    const handleClearSearch = useCallback(() => {
        setQuery('');
    }, []);

    const handleItemPress = useCallback((item: Notification) => {
        setSelectedItem(item);
        setData(prev =>
            prev.map(i =>
                i.id === item.id ? { ...i, isRead: true } : i
            )
        );
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedItem(null);
    }, []);

    return (
        <NotificationListScreen
            items={data}
            loading={loading}
            searchQuery={query}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            onLoadMore={loadMore}
            onRefresh={refresh}
            refreshing={refreshing}
            onItemPress={handleItemPress}
            selectedItem={selectedItem}
            onCloseDetail={handleCloseDetail}
        />
    );
});
