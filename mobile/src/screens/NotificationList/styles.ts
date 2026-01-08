import { COLORS } from "@/src/constants/color";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    footer: {

        paddingVertical: 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
    },
    header: {
        paddingVertical: 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
});