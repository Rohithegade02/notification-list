import React, { useCallback, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../types/notification';
import { NotificationListScreen } from './NotificationListScreen';

export const NotificationListContainer: React.FC = () => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 400);
    const [selectedItem, setSelectedItem] = useState<Notification | null>(null);

    const { items, loading, loadMore, refresh, refreshing } = useNotifications(debouncedQuery);

    const handleSearch = useCallback((text: string) => {
        setQuery(text);
    }, []);

    const handleClearSearch = useCallback(() => {
        setQuery('');
    }, []);

    const handleItemPress = useCallback((item: Notification) => {
        setSelectedItem(item);
        // Mark as read logic could go here
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedItem(null);
    }, []);

    return (
        <NotificationListScreen
            items={items}
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
};
