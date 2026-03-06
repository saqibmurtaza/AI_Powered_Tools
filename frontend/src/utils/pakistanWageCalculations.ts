// frontend/src/utils/pakistanWageCalculations.ts

export interface WageInput {
  basicSalary: number;
  allowances: {
    houseRent: number;
    conveyance: number;
    medical: number;
    utility: number;
  };
  province: 'punjab' | 'sindh' | 'kpk' | 'balochistan';
  overtimeHours: number;
  employeeType: 'formal' | 'informal';
}

export interface WageBreakdown {
  grossSalary: number;
  taxableIncome: number;
  incomeTax: number;
  eobiEmployee: number;  // 1% of minimum wage [citation:5]
  eobiEmployer: number;   // 5% of minimum wage [citation:5]
  socialSecurity: number; // 6-7% employer contribution [citation:5]
  overtimePay: number;
  netPayable: number;
  totalEmployerCost: number;
}

// Provincial minimum wages (2025) [citation:7]
const MINIMUM_WAGES = {
  punjab: 40000,
  sindh: 37000, // proposed 42000 [citation:8]
  kpk: 37000,
  balochistan: 37000
};

// Tax slabs 2024-25 [citation:7]
const TAX_SLABS = [
  { limit: 600000, rate: 0 },
  { limit: 1200000, rate: 7.5 },
  { limit: 2400000, rate: 12.5 },
  { limit: 3000000, rate: 17.5 },
  { limit: 4000000, rate: 22.5 },
  { limit: Infinity, rate: 35 }
];

export function calculatePakistanWage(input: WageInput): WageBreakdown {
  // Implementation with all statutory deductions
  const grossSalary = input.basicSalary + 
    Object.values(input.allowances).reduce((a, b) => a + b, 0);
  
  // Calculate income tax based on slabs
  const annualizedGross = grossSalary * 12;
  let incomeTax = 0;
  let remainingIncome = annualizedGross;
  let previousLimit = 0;
  
  for (const slab of TAX_SLABS) {
    if (remainingIncome <= 0) break;
    const taxableInThisSlab = Math.min(
      remainingIncome, 
      slab.limit - previousLimit
    );
    if (taxableInThisSlab > 0) {
      incomeTax += taxableInThisSlab * (slab.rate / 100);
      remainingIncome -= taxableInThisSlab;
    }
    previousLimit = slab.limit;
  }
  
  // Monthly tax deduction
  const monthlyTax = incomeTax / 12;
  
  // EOBI contributions (based on minimum wage) [citation:5]
  const minWage = MINIMUM_WAGES[input.province];
  const eobiEmployee = minWage * 0.01; // 1%
  const eobiEmployer = minWage * 0.05;  // 5%
  
  // Social Security (varies by province, using 6% average) [citation:5]
  const socialSecurity = minWage * 0.06;
  
  // Overtime (2x normal rate, assuming 26 working days) [citation:6]
  const dailyRate = grossSalary / 26;
  const hourlyRate = dailyRate / 8;
  const overtimePay = input.overtimeHours * hourlyRate * 2;
  
  const netPayable = grossSalary - monthlyTax - eobiEmployee;
  const totalEmployerCost = grossSalary + eobiEmployer + socialSecurity;
  
  return {
    grossSalary,
    taxableIncome: grossSalary,
    incomeTax: monthlyTax,
    eobiEmployee,
    eobiEmployer,
    socialSecurity,
    overtimePay,
    netPayable,
    totalEmployerCost
  };
}