import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Define icons per role
export const roleIconMap: Record<string, { lib: string; name: string }> = {
    // Role-based icons
    Cook: { lib: 'MaterialCommunityIcons', name: 'chef-hat' },
    Maid: { lib: 'MaterialCommunityIcons', name: 'broom' },
    Driver: { lib: 'FontAwesome5', name: 'car' },
    Newspaper: { lib: 'FontAwesome5', name: 'newspaper' },
    Babysitter: { lib: 'Ionicons', name: 'baby-outline' },
    Gardener: { lib: 'MaterialCommunityIcons', name: 'flower' },
    Milk: { lib: 'MaterialCommunityIcons', name: 'cow' },
    Milkman: { lib: 'MaterialCommunityIcons', name: 'cow' },
    Plumber: { lib: 'MaterialCommunityIcons', name: 'pipe' },
    Electrician: { lib: 'MaterialCommunityIcons', name: 'lightbulb-on' },
    Security: { lib: 'MaterialCommunityIcons', name: 'shield-home' },
    Carpenter: { lib: 'MaterialCommunityIcons', name: 'hammer' },
    Laundry: { lib: 'MaterialCommunityIcons', name: 'washing-machine' },
    ACService: { lib: 'MaterialCommunityIcons', name: 'air-conditioner' },
    PestControl: { lib: 'MaterialCommunityIcons', name: 'bug' },
    Water: { lib: 'MaterialCommunityIcons', name: 'water-pump' },

    // Stat icons (reused from the existing icon sets)
    Leave: { lib: 'MaterialCommunityIcons', name: 'calendar-check' },     // reuse for 'Leave'
    Absent: { lib: 'MaterialCommunityIcons', name: 'calendar-remove' },   // best match for absent
    'Leave Taken': { lib: 'MaterialCommunityIcons', name: 'calendar-check' },
    'Total Salary': { lib: 'MaterialCommunityIcons', name: 'currency-inr' }, // matches salary
    Deduction: { lib: 'MaterialCommunityIcons', name: 'cash-minus' },     // reuse deduction icon

    // Default fallback
    Default: { lib: 'Ionicons', name: 'person-circle-outline' },
};
type Props = {
    role: string;
    size?: number;
    color?: string;
};

export const RoleIcon = ({ role, size = 24, color = '#4B5563' }: Props) => {
    const icon = roleIconMap[role] || roleIconMap['Default'];

    if (icon.lib === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
    } else if (icon.lib === 'FontAwesome5') {
        return <FontAwesome5 name={icon.name} size={size} color={color} solid />;
    } else if (icon.lib === 'Ionicons') {
        return <Ionicons name={icon.name as any} size={size} color={color} />;
    }

    return <View />;
};
