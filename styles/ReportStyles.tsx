import { StyleSheet } from "react-native";

export const reportStyles = StyleSheet.create({
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
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    chartContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // elevation: 2,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    commingSoon: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center'
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
        marginBottom: 8,
    },
    barGroup: {
        alignItems: 'center',
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 150,
    },
    bar: {
        width: 12,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    barLabel: {
        marginTop: 8,
        fontSize: 12,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
    },
    lineChartContainer: {
        height: 200,
        position: 'relative',
    },
    chartGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        marginVertical: 10
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        borderBottomWidth: 1,
    },
    lineChart: {
        height: 160,
        overflow: 'visible',
        marginHorizontal: 20
    },
    lineChartInner: {
        position: 'relative',
        height: 160,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    lineSegment: {
        width: 40,
        height: '100%',
        position: 'relative',
    },
    line: {
        position: 'absolute',
        height: 3,
        width: 40,
        bottom: 0,
        left: 0,
        borderRadius: 1.5,
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        bottom: 0,
        left: 0,
        marginLeft: -4,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    xAxisLabel: {
        fontSize: 12,
        width: 40,
        textAlign: 'center',
    },
});