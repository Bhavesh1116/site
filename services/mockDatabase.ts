import { User, UserRole, Expense } from '../types';

// Initial Seed Data
const SEED_USERS: User[] = [
  {
    id: 'u_1',
    name: 'Admin Owner',
    email: 'admin@ppms',
    role: UserRole.ADMIN,
    isLoggedIn: false,
  },
  {
    id: 'u_2',
    name: 'Pintu Kumar Yadav',
    email: 'pintu@ppms',
    role: UserRole.EMPLOYEE,
    isLoggedIn: false,
  },
  {
    id: 'u_3',
    name: 'Sarah Johnson',
    email: 'sarah@ppms',
    role: UserRole.EMPLOYEE,
    isLoggedIn: false,
  }
];

// Seed expenses for visualization
const SEED_EXPENSES: Expense[] = [
  {
    id: 'e_1',
    employeeId: 'u_2',
    employeeName: 'Pintu Kumar Yadav',
    reason: 'Travel to Client Site',
    amount: 500,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'e_2',
    employeeId: 'u_2',
    employeeName: 'Pintu Kumar Yadav',
    reason: 'Office Supplies',
    amount: 1200,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'e_3',
    employeeId: 'u_3',
    employeeName: 'Sarah Johnson',
    reason: 'Software License',
    amount: 4500,
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

const KEYS = {
  USERS: 'ppms_users',
  EXPENSES: 'ppms_expenses',
  SESSION: 'ppms_session'
};

// Initialize DB if empty
export const initDB = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(KEYS.EXPENSES)) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
  }
};

// --- User Operations ---
export const getUsers = (): User[] => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const updateUserStatus = (userId: string, isLoggedIn: boolean) => {
  const users = getUsers();
  const updated = users.map(u => u.id === userId ? { ...u, isLoggedIn } : u);
  localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
};

// --- Expense Operations ---
export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const addExpense = (expense: Expense) => {
  const expenses = getExpenses();
  expenses.unshift(expense); // Add to top
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

// --- Session ---
export const getSession = () => {
  const sess = localStorage.getItem(KEYS.SESSION);
  return sess ? JSON.parse(sess) : null;
};

export const setSession = (user: User) => {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  updateUserStatus(user.id, true);
};

export const clearSession = () => {
  const user = getSession();
  if (user) {
    updateUserStatus(user.id, false);
  }
  localStorage.removeItem(KEYS.SESSION);
};