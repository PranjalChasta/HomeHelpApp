import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonBlock = ({ style }: { style?: any }) => {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const opacity = shimmer.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1, 0.3],
    });

    return (
        <Animated.View style={[styles.skeletonBox, style, { opacity }]} />
    );
};

export const CalendarSkeleton = (isDark: any) => {
    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f3f4f6' }]}>
            {/* Header */}
            <SkeletonBlock style={styles.header} />

            {/* Week Days */}
            <View style={styles.row}>
                {Array.from({ length: 5 }).map((_, idx) => (
                    <SkeletonBlock key={idx} style={styles.weekDay} />
                ))}
            </View>

            {/* Calendar Grid: 6 weeks x 7 days = 42 blocks */}
            {Array.from({ length: 6 }).map((_, rowIdx) => (
                <View key={rowIdx} style={styles.row}>
                    {Array.from({ length: 7 }).map((_, colIdx) => (
                        <SkeletonBlock key={colIdx} style={styles.dayCell} />
                    ))}
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20
    },
    skeletonBox: {
        backgroundColor: '#e5e7eb',
        borderRadius: 6,
    },
    header: {
        height: 25,
        width: SCREEN_WIDTH * 0.4,
        marginVertical: 16,
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    weekDay: {
        width: 40,
        height: 14,
        borderRadius: 4,
        backgroundColor: '#d1d5db',
    },
    dayCell: {
        width: 24,
        height: 24,
        borderRadius: 8,
    },
});