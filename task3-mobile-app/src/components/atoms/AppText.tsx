import { COLORS } from '@/src/constants/color';
import React, { memo } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';



interface AppTextProps extends TextProps {
    variant?: 'title' | 'body' | 'caption';
    color?: string;
    weight?: 'normal' | 'bold' | '500';
}


export const AppText: React.FC<AppTextProps> = memo(({
    children,
    variant = 'body',
    color = COLORS.black,
    weight = 'normal',
    style,
    ...props
}) => {
    return (
        <Text
            style={[
                styles[variant],
                { color, fontWeight: weight },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
});

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        lineHeight: 22,
    },
    body: {
        fontSize: 14,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
    },
});
