import { Ionicons } from "@expo/vector-icons";
import { BaseToast } from "react-native-toast-message";

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#22d3ee', // A bright cyan accent
                backgroundColor: '#179217ff', // Deep background
                borderRadius: 12,
                marginHorizontal: 16,
                marginTop: 10,
                zIndex: 9999,
                elevation: 9999,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                minHeight: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 10,
            }}
            text1Style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: '#fff',
                letterSpacing: 0.5,
            }}
            text2Style={{
                fontSize: 15,
                color: '#e0e0e0',
                marginTop: 4,
            }}
            renderLeadingIcon={() => (
                <Ionicons name="checkmark-circle" size={28} color="#22d3ee" style={{ marginRight: 10 }} />
            )}
        />
    ),
    error: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#ef4444',
                backgroundColor: '#2d1a1a',
                borderRadius: 12,
                marginHorizontal: 16,
                marginTop: 10,
                zIndex: 9999,
                elevation: 9999,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                minHeight: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 10,
            }}
            text1Style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: '#fff',
                letterSpacing: 0.5,
            }}
            text2Style={{
                fontSize: 15,
                color: '#fca5a5',
                marginTop: 4,
            }}
            renderLeadingIcon={() => (
                <Ionicons name="close-circle" size={28} color="#ef4444" style={{ marginRight: 10 }} />
            )}
        />
    ),
    info: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#3b82f6',
                backgroundColor: '#1e293b',
                borderRadius: 12,
                marginHorizontal: 16,
                marginTop: 10,
                zIndex: 9999,
                elevation: 9999,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                minHeight: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 10,
            }}
            text1Style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: '#fff',
                letterSpacing: 0.5,
            }}
            text2Style={{
                fontSize: 15,
                color: '#bae6fd',
                marginTop: 4,
            }}
            renderLeadingIcon={() => (
                <Ionicons name="information-circle" size={28} color="#3b82f6" style={{ marginRight: 10 }} />
            )}
        />
    ),
};