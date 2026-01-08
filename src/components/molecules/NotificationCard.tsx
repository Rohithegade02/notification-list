import { COLORS } from '@/src/constants/color';
import { getRelativeTime } from '@/src/utils';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Notification } from '../../types/notification';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';



interface NotificationCardProps {
    item: Notification;
    onPress: (item: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ item, onPress }) => {
    const handlePress = useCallback(() => {
        onPress(item);
    }, [item]);
    return (
        <Pressable
            style={[styles.container, !item.isRead && styles.unread]}
            onPress={handlePress}
        >
            <View style={styles.header}>
                <Badge type={item.type} />
                <AppText variant="caption" color={COLORS.gray}>{getRelativeTime(item.timestamp)}</AppText>
            </View>

            <AppText variant="title" weight="bold" style={styles.title} numberOfLines={1}>
                {item.title}
            </AppText>

            <AppText variant="body" color={COLORS.darkGray} numberOfLines={2}>
                {item.body}
            </AppText>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    unread: {
        backgroundColor: COLORS.lightBlue,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        marginBottom: 2,
    },
});
