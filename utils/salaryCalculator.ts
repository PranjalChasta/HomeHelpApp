export function calculateSalary(totalSalary: number, presentDays: number, totalLeaves: number, workingDays: number, netAmount: number = 0, netDirection: string = '') {
    const paidLeaves = 2;
    const unpaidLeaves = Math.max(0, totalLeaves - paidLeaves);
    const deductionPerDay = totalSalary / workingDays;
    const deductions = unpaidLeaves * deductionPerDay;
    const finalSalary = (totalSalary - deductions);

    const finalAmt =
        netDirection && netAmount !== 0
            ? netDirection === 'take'
                ? finalSalary - netAmount
                : finalSalary + netAmount
            : finalSalary;

    return {
        deductions: Math.round(deductions),
        finalSalary: Math.round(finalAmt),
    };
}
