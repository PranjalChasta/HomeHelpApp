import { StyleSheet } from "react-native";

export const settingStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionContent: {
        paddingHorizontal: 8,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
    },
    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitle: {
        flex: 1,
        fontSize: 16,
    },
    actionButton: {
        padding: 8,
    },
    appInfo: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
    },
    appVersion: {
        fontSize: 14,
    },
});