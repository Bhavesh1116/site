import React, { useEffect, useState } from 'react';
import { getAllExpenses, createExpense } from '../services/expenseService'; // createExpense not used here but imported
import { getUsers } from '../services/mockDatabase';
import { Expense, User, UserRole } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndianRupee, Users, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AggregatedData {
  name: string;
  fullName: string;
  total: number;
  userId: string;
}

export const AdminDashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const allExpenses = await getAllExpenses();
      setExpenses(allExpenses);
      setUsers(getUsers());
    };
    loadData();
  }, []);

  // Calculate Metrics
  const totalEmployees = users.filter(u => u.role === UserRole.EMPLOYEE).length;
  const activeEmployees = users.filter(u => u.role === UserRole.EMPLOYEE && u.isLoggedIn).length;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Aggregate for Chart
  const dataByEmployee: AggregatedData[] = users
    .filter(u => u.role === UserRole.EMPLOYEE)
    .map(u => {
      const userExpenses = expenses.filter(e => e.employeeId === u.id);
      return {
        name: u.name.split(' ')[0], // First name for chart
        fullName: u.name,
        total: userExpenses.reduce((sum, e) => sum + e.amount, 0),
        userId: u.id
      };
    })
    .sort((a, b) => b.total - a.total);

  const colors = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Executive Overview</h1>
        <Button 
          variant="secondary" 
          onClick={() => window.open('/', '_blank')}
          className="text-xs w-full sm:w-auto"
        >
          View User Panel <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 bg-blue-50 rounded-full mr-4">
            <Users className="h-8 w-8 text-ppms-blue" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              {activeEmployees} Active Now
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 bg-amber-50 rounded-full mr-4">
            <IndianRupee className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Company Spend</p>
            <p className="text-2xl font-bold text-gray-900">₹ {totalSpent.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400 mt-1">Lifetime aggregate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 bg-emerald-50 rounded-full mr-4">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Top Spender</p>
            <p className="text-lg font-bold text-gray-900 truncate w-32">
              {dataByEmployee[0]?.fullName || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
               ₹ {dataByEmployee[0]?.total.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <Card title="Spending Analytics (By Employee)" className="h-full">
            <div className="mt-4" style={{ width: '100%', height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataByEmployee} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    formatter={(value: number) => [`₹ ${value.toLocaleString()}`, 'Spent']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                    {dataByEmployee.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Employee List Section */}
        <div className="lg:col-span-1">
          <Card title="Employee Directory" className="h-full flex flex-col">
            <div className="overflow-y-auto max-h-[400px] pr-2">
              <ul className="space-y-3">
                {users.filter(u => u.role === UserRole.EMPLOYEE).map((u) => {
                  const spend = expenses.filter(e => e.employeeId === u.id).reduce((acc, curr) => acc + curr.amount, 0);
                  return (
                    <li 
                      key={u.id}
                      onClick={() => navigate(`/admin/employee/${u.id}`)}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm group-hover:bg-ppms-blue group-hover:text-white transition-colors">
                          {u.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-gray-900">₹{spend.toLocaleString()}</p>
                         <p className="text-xs text-ppms-blue font-medium">View Details &rarr;</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};