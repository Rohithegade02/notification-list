import { COLORS } from '@/src/constants/color';
import React, { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/atoms/AppText';
import { NotificationCard } from '../../components/molecules/NotificationCard';
import { SearchBar } from '../../components/molecules/SearchBar';
import { Notification } from '../../types/notification';
import NotificationModal from './NotificationModal';
import { styles } from './styles';

interface NotificationListScreenProps {
    items: Notification[];
    loading: boolean;
    searchQuery: string;
    onSearch: (text: string) => void;
    onClearSearch: () => void;
    onLoadMore: () => void;
    onRefresh: () => void;
    refreshing: boolean;
    onItemPress: (item: Notification) => void;
    selectedItem: Notification | null;
    onCloseDetail: () => void;
}

// Notification List Presentational Component
export const NotificationListScreen: React.FC<NotificationListScreenProps> = memo(({
    items,
    loading,
    searchQuery,
    onSearch,
    onClearSearch,
    onLoadMore,
    onRefresh,
    refreshing,
    onItemPress,
    selectedItem,
    onCloseDetail,
}) => {
    const { top } = useSafeAreaInsets();
    const renderFooter = useCallback(() => {
        if (!loading) return <View style={styles.footer} />;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={COLORS.blue} />
            </View>
        );
    }, [loading]);

    const renderEmpty = useCallback(() => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText} color={COLORS.gray999}>
                    No notifications found.
                </AppText>
            </View>
        );
    }, [loading]);

    const renderItem = useCallback(({ item }: { item: Notification }) => {
        return <NotificationCard item={item} onPress={onItemPress} />;
    }, [onItemPress]);

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <SearchBar
                value={searchQuery}
                onChangeText={onSearch}
                onClear={onClearSearch}
            />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={30}
                initialNumToRender={20}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={{ flexGrow: 1 }}
            />

            <NotificationModal
                visible={!!selectedItem}
                selectedItem={selectedItem}
                onCloseDetail={onCloseDetail}
            />
        </View>
    );
});


