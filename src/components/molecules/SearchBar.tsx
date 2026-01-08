import { COLORS } from '@/src/constants/color';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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
                <TouchableOpacity onPress={onClear} style={styles.clearButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <AppText color={COLORS.darkGray} style={{ fontSize: 18 }}>×</AppText>
                </TouchableOpacity>
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
