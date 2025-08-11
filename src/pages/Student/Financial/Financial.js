import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Financial = () => {
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    const fetchFinancial = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole');
        const endpoint = role === 'student' ? '/api/v1/financial/me' : '/api/v1/financial/me';
        const response = await axios.get(`http://localhost:8000${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFinancialData(response.data);
      } catch (error) {
        toast.error('Failed to load financial data');
        setFinancialData(null);
      } finally {
      }
    };
    fetchFinancial();
  }, []);

  const semesters = [
    { id: 'current', name: 'Current Semester' },
    { id: 'previous', name: 'Previous Semester' },
    { id: 'upcoming', name: 'Upcoming Semester' },
  ];

  // Use real data from backend
  const charges = financialData?.charges || [];
  const payments = financialData?.payments || [];
  const aid = financialData?.aid || [];
  const currentBalance = financialData?.balance ?? 0;

// Aggregated values for summary cards
const totalCharges = charges.reduce((sum, charge) => sum + charge.amount, 0);
const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
const financialAid = aid.reduce((sum, a) => sum + a.amount, 0);

// Upcoming payments: charges with a due date in the future and not completed
const now = new Date();
const upcomingPayments = charges.filter(charge => {
  const dueDate = new Date(charge.dueDate || charge.date);
  return dueDate > now && charge.status !== 'completed';
});

  // For charts
  const financialAidData = {
    labels: aid.map(a => a.description),
    datasets: [
      {
        data: aid.map(a => a.amount),
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const paymentHistory = {
    labels: payments.map(p => p.date),
    datasets: [
      {
        label: 'Payments',
        data: payments.map(p => p.amount),
        backgroundColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Charges',
        data: charges.map(c => c.amount),
        backgroundColor: 'rgb(239, 68, 68)',
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'pending':
        return 'text-warning-600 bg-warning-50';
      case 'charged':
        return 'text-primary-600 bg-primary-50';
      case 'due_soon':
        return 'text-danger-600 bg-danger-50';
      case 'upcoming':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'financial_aid':
        return <BanknotesIcon className="h-5 w-5 text-success-600" />;
      case 'loan':
        return <DocumentTextIcon className="h-5 w-5 text-primary-600" />;
      case 'payment':
        return <CreditCardIcon className="h-5 w-5 text-warning-600" />;
      case 'scholarship':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />;
      default:
        return <BanknotesIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tuition, payments, and financial aid
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="input-field w-auto"
          >
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
          <button className="btn-primary">
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Make Payment
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Balance</h3>
          <p className={`text-3xl font-bold ${currentBalance > 0 ? 'text-danger-600' : 'text-success-600'}`}>
            {formatCurrency(currentBalance)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentBalance > 0 ? 'Amount due' : 'Credit balance'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Charges</h3>
          <p className="text-3xl font-bold text-danger-600">{formatCurrency(totalCharges)}</p>
          <p className="text-sm text-gray-500 mt-1">This semester</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Payments</h3>
          <p className="text-3xl font-bold text-success-600">{formatCurrency(totalPayments)}</p>
          <p className="text-sm text-gray-500 mt-1">This semester</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Aid</h3>
          <p className="text-3xl font-bold text-primary-600">{formatCurrency(financialAid)}</p>
          <p className="text-sm text-gray-500 mt-1">Awarded</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
          <div className="h-64">
            <Bar
              data={paymentHistory}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Aid Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut
                data={financialAidData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Payments</h3>
        {upcomingPayments.length > 0 ? (
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-warning-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{payment.description}</h4>
                    <p className="text-sm text-gray-500">
                      {getDaysUntilDue(payment.dueDate)} • {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                  <span className={`badge ${getStatusColor(payment.status)}`}>
                    {payment.status.replace('_', ' ').charAt(0).toUpperCase() + payment.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-success-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming payments</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up with your payments!
            </p>
          </div>
        )}
      </div>

      {/* Charges and Payments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Charges */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Charges</h3>
          <div className="space-y-3">
            {charges.map((charge) => (
              <div key={charge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{charge.description}</div>
                  <div className="text-sm text-gray-500">{format(new Date(charge.date), 'MMM d, yyyy')}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(charge.amount)}</div>
                  <span className={`badge ${getStatusColor(charge.status)}`}>
                    {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total Charges</span>
                <span>{formatCurrency(charges.reduce((sum, charge) => sum + charge.amount, 0))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payments & Financial Aid</h3>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getPaymentTypeIcon(payment.type)}
                  <div>
                    <div className="font-medium text-gray-900">{payment.description}</div>
                    <div className="text-sm text-gray-500">{format(new Date(payment.date), 'MMM d, yyyy')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                  <span className={`badge ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total Payments</span>
                <span>{formatCurrency(payments.reduce((sum, payment) => sum + payment.amount, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Aid Status */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Aid Status</h3>
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-success-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-success-800">Financial Aid Awarded</h4>
              <p className="text-sm text-success-700 mt-1">
                Your financial aid has been processed and applied to your account. 
                Remaining balance: {formatCurrency(currentBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-primary">
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Make Payment
          </button>
          <button className="btn-secondary">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            View Statement
          </button>
          <button className="btn-secondary">
            <BanknotesIcon className="h-4 w-4 mr-2" />
            Financial Aid
          </button>
          <button className="btn-secondary">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            Payment Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Financial; 