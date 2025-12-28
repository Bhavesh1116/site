export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export interface User {
  id: string;
  name: string;
  email: string; // Used as username
  role: UserRole;
  isLoggedIn?: boolean; // For admin monitoring
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  reason: string;
  amount: number;
  date: string; // ISO String
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface EmployeeSummary {
  employeeId: string;
  employeeName: string;
  totalSpent: number;
  lastActive: string;
}