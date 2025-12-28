import { User, LoginResponse, UserRole } from '../types';
import { getUsers, setSession, clearSession } from './mockDatabase';

// Mock password hashing for security simulation
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        reject(new Error('Invalid credentials'));
        return;
      }

      // Hardcoded Mock Passwords matching the prompt
      // pintu@ppms -> pintu@1234
      // admin@ppms -> admin@1234
      // others -> password123
      const expectedPass = email.startsWith('pintu') ? 'pintu@1234' : 
                           email.startsWith('admin') ? 'admin@1234' : 'password123';

      if (password !== expectedPass) {
        reject(new Error('Invalid credentials'));
        return;
      }

      setSession(user);
      
      resolve({
        user,
        token: 'mock-jwt-token-' + Date.now()
      });
    }, 800);
  });
};

export const logout = async () => {
  clearSession();
  return Promise.resolve();
};