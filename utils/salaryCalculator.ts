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

export type AttendanceData = {
    helper_id: string;
    name: string;
    role: string;
    present: number;
    absent: number;
    leaves: number;
    month: string;
};

export type SalaryDataType = {
    helper_id: string;
    name: string;
    role: string;
    monthly_salary: number;
    leaves: number;
    deductions: number;
    paid: number;
    due: number;
    month: any;
    amount: any;
};
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getMonthName = (monthString: string): string => {
    const [year, month] = monthString.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("en-US", { month: "short" }); // returns "Jan", "Feb", etc.
};

export const getCurrentMonth = () => {
    const today = new Date();
    const currentMonthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const currentMonth = getMonthName(currentMonthString);
    return currentMonth;
}

export const getTotalDaysInCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-indexed

    return new Date(year, month, 0).getDate();
};

export const getSalaryHistory = (helpers: any[], months: string[]) => {
    const allSalaryData: any = [];
    const helper = helpers[0];

    // helpers.forEach(helper => {
    const { _id: helper_id, name, role, monthly_salary } = helper;

    months.forEach(month => {
        allSalaryData.push({
            helper_id,
            name,
            role,
            month,
            amount: monthly_salary
        });
    });
    // });

    return allSalaryData;
};



