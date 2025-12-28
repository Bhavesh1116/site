import { Expense } from '../types';
import { getExpenses, addExpense as dbAddExpense } from './mockDatabase';
import { v4 as uuidv4 } from 'uuid'; // We will use a simple random string generator instead of full uuid lib to save file count if needed, but here implies generic ID generation

const generateId = () => Math.random().toString(36).substring(2, 9);

export const createExpense = async (employeeId: string, employeeName: string, reason: string, amount: number): Promise<Expense> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpense: Expense = {
        id: generateId(),
        employeeId,
        employeeName,
        reason,
        amount,
        date: new Date().toISOString(),
      };
      dbAddExpense(newExpense);
      resolve(newExpense);
    }, 500);
  });
};

export const getExpensesByEmployee = async (employeeId: string): Promise<Expense[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getExpenses();
      const filtered = all.filter(e => e.employeeId === employeeId);
      resolve(filtered);
    }, 400);
  });
};

export const getAllExpenses = async (): Promise<Expense[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getExpenses());
    }, 400);
  });
};