// frontend/src/utils/dateCalculations.ts
// This pure function can run ANYWHERE (browser, server, edge)

export interface DateDifference {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export function calculateDateDifference(
  startDate: Date | string,
  endDate: Date | string = new Date()
): DateDifference {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  // Calculate total days first (useful for many industries)
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate years, months, days precisely
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  
  // Adjust days
  if (days < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Adjust months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days, totalDays };
}

// Industry-specific formatters
export const Formatters = {
  // HR: Tenure in years with decimal (for severance calculation)
  tenureYears: (diff: DateDifference): number => {
    return diff.years + (diff.months / 12) + (diff.days / 365);
  },
  
  // Legal: Exact years/months/days for contracts
  legalFormat: (diff: DateDifference): string => {
    return `${diff.years} years, ${diff.months} months, ${diff.days} days`;
  },
  
  // Project Management: Total days for billing
  projectDays: (diff: DateDifference): number => {
    return diff.totalDays;
  },
  
  // Finance: Days for interest calculation (actual/365)
  interestDays: (diff: DateDifference): number => {
    return diff.totalDays; // For actual/365 convention
  }
};