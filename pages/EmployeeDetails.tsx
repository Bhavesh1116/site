import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpensesByEmployee } from '../services/expenseService';
import { getUsers } from '../services/mockDatabase';
import { Expense, User } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, User as UserIcon, Calendar, IndianRupee, Download } from 'lucide-react';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const allUsers = getUsers();
      const user = allUsers.find(u => u.id === id);
      setEmployee(user || null);

      getExpensesByEmployee(id).then(data => {
        setExpenses(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleExportCSV = () => {
    if (expenses.length === 0 || !employee) return;

    // Define CSV headers
    const headers = ['Date', 'Employee Name', 'Reason', 'Amount (INR)'];
    
    // Create CSV rows
    const csvRows = expenses.map(expense => {
      const date = new Date(expense.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      // Escape double quotes by doubling them, and wrap field in quotes to handle commas
      const escapedReason = `"${expense.reason.replace(/"/g, '""')}"`;
      const escapedName = `"${employee.name.replace(/"/g, '""')}"`;
      
      return [date, escapedName, escapedReason, expense.amount].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${employee.name.replace(/\s+/g, '_')}_expenses.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8 text-center">Loading data...</div>;
  if (!employee) return <div className="p-8 text-center">Employee not found</div>;

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin')} className="pl-0 hover:bg-transparent hover:text-ppms-blue">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-16 w-16 bg-ppms-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {employee.name.charAt(0)}
          </div>
          <div className="ml-5">
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <div className="flex items-center text-gray-500 mt-1">
              <UserIcon className="h-4 w-4 mr-1" />
              <span className="mr-4">{employee.email}</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full capitalize">
                {employee.role.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Lifetime Spend</p>
          <p className="text-3xl font-bold text-ppms-blue">₹ {totalSpent.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <Card title="Expense History" 
        action={
          <Button variant="secondary" className="text-xs" onClick={handleExportCSV} disabled={expenses.length === 0}>
            <Download className="h-3 w-3 mr-1" /> Export CSV
          </Button>
        }
      >
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No records found for this employee.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                       ₹ {expense.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};