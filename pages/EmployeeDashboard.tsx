import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Expense } from '../types';
import { createExpense, getExpensesByEmployee } from '../services/expenseService';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { IndianRupee, Plus, History, TrendingUp, Calendar } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getExpensesByEmployee(user.id);
    setExpenses(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !reason) return;

    setSubmitting(true);
    try {
      await createExpense(user.id, user.name, reason, parseFloat(amount));
      setAmount('');
      setReason('');
      await loadExpenses(); // Refresh list
    } catch (error) {
      console.error("Failed to add expense", error);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
           <Calendar className="w-4 h-4 mr-2" />
           {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
           {/* Summary Card */}
          <div className="bg-gradient-to-br from-ppms-blue to-blue-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-4 opacity-90">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Total Lifetime Spend</span>
            </div>
            <div className="text-4xl font-bold flex items-center">
              <IndianRupee className="h-8 w-8 mr-1" />
              {totalSpent.toLocaleString('en-IN')}
            </div>
            <p className="mt-2 text-xs text-blue-200">
              Across {expenses.length} entries
            </p>
          </div>

          <Card title="New Expense Entry" className="border-t-4 border-t-ppms-accent">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Reason for Spending"
                placeholder="e.g. Taxi to Client Location"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <Input
                label="Amount (INR)"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                icon={<IndianRupee className="h-4 w-4" />}
              />
              <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Expense
                </Button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  * Entries cannot be edited once submitted.
                </p>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: History Table */}
        <div className="lg:col-span-2">
          <Card title="Recent Expense History" icon={<History className="h-5 w-5" />}>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading records...</div>
            ) : expenses.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No expenses recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
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
      </div>
    </div>
  );
};