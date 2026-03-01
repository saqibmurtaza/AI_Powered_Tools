"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Briefcase, DollarSign, Calendar, Download } from 'lucide-react';
import { calculateDateDifference, Formatters } from '@/utils/dateCalculations';

// Industry-specific calculation rules
const SEVERANCE_RULES = {
  standard: {
    name: 'Standard (2 weeks per year)',
    weeksPerYear: 2,
    description: 'Common for general employees'
  },
  executive: {
    name: 'Executive (4 weeks per year)',
    weeksPerYear: 4,
    description: 'For senior management roles'
  },
  statutory: {
    name: 'Statutory Minimum',
    weeksPerYear: 1,
    description: 'Legal minimum requirement'
  }
};

export default function HRTenureCalculatorPage() {
  const [hireDate, setHireDate] = useState('');
  const [terminationDate, setTerminationDate] = useState('');
  const [annualSalary, setAnnualSalary] = useState('');
  const [selectedRule, setSelectedRule] = useState<keyof typeof SEVERANCE_RULES>('standard');
  const [result, setResult] = useState<{
    tenure: { years: number; months: number; days: number };
    severanceAmount: number;
    tenureYears: number;
  } | null>(null);

  const calculateTenure = () => {
    if (!hireDate || !terminationDate || !annualSalary) return;

    try {
      const diff = calculateDateDifference(hireDate, terminationDate);
      const tenureYears = Formatters.tenureYears(diff);
      
      // Calculate severance
      const weeklySalary = parseFloat(annualSalary) / 52;
      const severanceWeeks = tenureYears * SEVERANCE_RULES[selectedRule].weeksPerYear;
      const severanceAmount = weeklySalary * severanceWeeks;

      setResult({
        tenure: diff,
        severanceAmount,
        tenureYears
      });
    } catch (error) {
      alert('Please enter valid dates');
    }
  };

  const exportToCSV = () => {
    if (!result) return;
    
    const csvContent = [
      ['Hire Date', 'Termination Date', 'Annual Salary', 'Tenure (Years)', 'Severance Amount'],
      [hireDate, terminationDate, annualSalary, result.tenureYears.toFixed(2), `$${result.severanceAmount.toFixed(2)}`]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenure-calculation.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      {/* Header - similar to age calculator */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/tools"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <Briefcase className="w-6 h-6 text-[#4D0682]" />
            <h1 className="text-2xl font-bold text-gray-900">HR Tenure & Severance Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Employee Tenure & Severance</h2>
          
          <div className="space-y-6">
            {/* Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hire Date
                </label>
                <input
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D0682]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Termination Date
                </label>
                <input
                  type="date"
                  value={terminationDate}
                  onChange={(e) => setTerminationDate(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D0682]"
                />
              </div>
            </div>

            {/* Salary Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Salary ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  placeholder="50000"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D0682]"
                />
              </div>
            </div>

            {/* Severance Rule Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severance Rule
              </label>
              <select
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value as keyof typeof SEVERANCE_RULES)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D0682]"
              >
                {Object.entries(SEVERANCE_RULES).map(([key, rule]) => (
                  <option key={key} value={key}>
                    {rule.name} - {rule.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateTenure}
              className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Calculate Tenure & Severance
            </button>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-sm text-gray-600 mb-1">Total Tenure</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {result.tenure.years}y {result.tenure.months}m {result.tenure.days}d
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        ({result.tenureYears.toFixed(2)} years)
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-sm text-gray-600 mb-1">Estimated Severance</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${result.severanceAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Based on {SEVERANCE_RULES[selectedRule].weeksPerYear} week(s) per year
                      </div>
                    </div>
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={exportToCSV}
                    className="mt-4 flex items-center gap-2 text-[#4D0682] hover:text-[#7C3AED] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export to CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Industry Applications Section */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry Applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border">
              <Briefcase className="w-8 h-8 text-[#4D0682] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">HR Departments</h3>
              <p className="text-sm text-gray-600">Calculate tenure for service awards, retention analysis, and severance packages</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border">
              <DollarSign className="w-8 h-8 text-[#4D0682] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Finance Teams</h3>
              <p className="text-sm text-gray-600">Budget for severance liabilities and employee benefit accruals</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border">
              <Calendar className="w-8 h-8 text-[#4D0682] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Legal Compliance</h3>
              <p className="text-sm text-gray-600">Ensure statutory minimum severance requirements are met</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}