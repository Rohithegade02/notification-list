import React, { memo, useCallback, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../types/notification';
import { NotificationListScreen } from './NotificationListScreen';

export const NotificationListContainer: React.FC = memo(() => {
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<Notification | null>(null);

    //  hooks 
    const debouncedQuery = useDebounce(query, 400);
    const { items, loading, loadMore, refresh, refreshing } = useNotifications(debouncedQuery);

    const handleSearch = useCallback((text: string) => {
        setQuery(text);
    }, []);

    const handleClearSearch = useCallback(() => {
        setQuery('');
    }, []);

    const handleItemPress = useCallback((item: Notification) => {
        setSelectedItem(item);
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
});
