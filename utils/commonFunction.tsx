import { Helper } from "@/components/Home/DashboardComponent";

export function calculateSalary(totalSalary: number, paidLeaves: number, totalLeaves: number, workingDays: number, netAmount: number = 0, netDirection: string = '', extraWorkDay: number) {
    const unpaidLeaves = Math.max(0, totalLeaves - paidLeaves);
    const totalAmtPerDay = totalSalary / workingDays;
    const deductions = unpaidLeaves * totalAmtPerDay;
    let finalSalary = (totalSalary - deductions);

    if (extraWorkDay !== 0) {
        const extraPay = extraWorkDay * totalAmtPerDay;
        finalSalary += extraPay;
    }

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
    status?: string;
    present: number;
    absent: number;
    dates: any[];
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

export const getCurrentMonthString = () => new Date().toISOString().slice(0, 7);

export const generateUniqueColor = (index: number): string => {
    const hue = (index * 25) % 360;         // spaced hues
    const saturation = 70;                 // medium saturation
    const lightness = 50;                  // darker pastel
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const calculateAttendanceRate = (
    helpers: Helper[],
    attendanceDocs: AttendanceData[]
) => {
    const month = getCurrentMonthString();
    const totalDaysInMonth = getTotalDaysInCurrentMonth();
    const attendanceRates = helpers.map((helper) => {
        const leaveDoc = attendanceDocs.find(
            (doc) => doc.helper_id === helper._id && doc.status === 'leave'
        );
        const extraDoc = attendanceDocs.find(
            (doc) => doc.helper_id === helper._id && doc.status === 'extra-work'
        );

        const leaveCount = leaveDoc?.dates?.filter((date) => date.startsWith(month)).length || 0;
        const extraCount = extraDoc?.dates?.filter((date) => date.startsWith(month)).length || 0;

        const attendance =
            ((totalDaysInMonth - leaveCount + extraCount) / totalDaysInMonth) * 100;

        return {
            helper_id: helper._id,
            name: helper.name,
            leaveCount,
            extraCount,
            attendanceRate: +attendance.toFixed(1),
        };
    });

    const avgRate =
        attendanceRates.reduce((sum, h) => sum + h.attendanceRate, 0) / attendanceRates.length || 0;

    return { attendanceRates, avgRate: +avgRate.toFixed(1) };
};



