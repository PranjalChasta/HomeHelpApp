import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import PieChart from 'react-native-pie-chart';

type PieData = {
    name: string;
    value: number;
    color: string;
};

type Props = {
    pieChartSalaryData: PieData[];
};

const CustomPieChart: React.FC<Props> = ({ pieChartSalaryData }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const widthAndHeight = Dimensions.get('screen').width - 150;

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>

                <View style={styles.chartWrapper}>
                    <PieChart widthAndHeight={widthAndHeight} series={pieChartSalaryData} />
                </View>

                <View style={styles.legendContainer}>
                    {pieChartSalaryData?.map((h, idx) => (
                        <View key={idx} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: h.color }]} />
                            <Text style={[styles.legendText, { color: isDark ? '#f9fafb' : '#333' }]}>
                                {h.name}: ₹{h.value}
                            </Text>
                        </View>
                    ))}
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    chartWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    legendContainer: {
        marginTop: 20,
        width: '90%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    colorBox: {
        width: 16,
        height: 16,
        marginRight: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 16,
    },
});

export default CustomPieChart;
