export function calculateSalary(totalSalary: number, presentDays: number, totalLeaves: number, workingDays: number) {
    const paidLeaves = 2;
    const unpaidLeaves = Math.max(0, totalLeaves - paidLeaves);
    const deductionPerDay = totalSalary / workingDays;
    const deductions = unpaidLeaves * deductionPerDay;
    const finalSalary = totalSalary - deductions;

    return {
        deductions: Math.round(deductions),
        finalSalary: Math.round(finalSalary),
    };
}
