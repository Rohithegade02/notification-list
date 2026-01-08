import { COLORS } from '@/src/constants/color';
import React, { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../atoms/AppText';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
}
const height = Dimensions.get('window').height;


export const SearchBar: React.FC<SearchBarProps> = memo(({ value, onChangeText, onClear }) => {

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder="Search notifications..."
                placeholderTextColor={COLORS.gray999}
                returnKeyType="search"
            />
            {value.length > 0 && (
                <Pressable onPress={onClear} style={styles.clearButton}>
                    <AppText color={COLORS.darkGray} style={{ fontSize: 18 }}>×</AppText>
                </Pressable>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: height * 0.05,
        backgroundColor: COLORS.white500,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
        color: COLORS.black,
    },
    clearButton: {
        marginLeft: 8,
        padding: 4,
    }
});
