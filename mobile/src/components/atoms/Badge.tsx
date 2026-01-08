import { BADGE_COLORS, COLORS } from '@/src/constants/color';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { NotificationType } from '../../types/notification';
import { AppText } from './AppText';

interface BadgeProps {
    type: NotificationType;
}



export const Badge: React.FC<BadgeProps> = memo(({ type }) => {
    return (
        <View style={[styles.container, { backgroundColor: BADGE_COLORS[type] }]}>
            <AppText variant="caption" color={COLORS.white} weight="bold" style={styles.text}>
                {type.at(0)?.toUpperCase() + type?.slice(1)}
            </AppText>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    text: {
        fontSize: 10,
    },
});
