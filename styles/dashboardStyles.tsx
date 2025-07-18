import { StyleSheet } from "react-native";

export const dashboardStyles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
        textShadowColor: '#00f0ff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#00f0ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
    },
    cardHeader: {
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    role: {
        fontSize: 14,
        color: '#bbf7d0',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    actionText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
    },
    addButton: {
        marginTop: 20,
        backgroundColor: '#4f46e5',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
});