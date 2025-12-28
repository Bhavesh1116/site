import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole } from '../types';
import { getSession, initDB } from '../services/mockDatabase';
import { logout as apiLogout } from '../services/authService';

interface AuthContextType extends AuthState {
  loginSuccess: (user: User) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Initialize DB on first load
    initDB();

    // Check for existing session
    const sessionUser = getSession();
    if (sessionUser) {
      setState({
        user: sessionUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const loginSuccess = (user: User) => {
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logoutUser = async () => {
    await apiLogout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Force reload/redirect is handled by the consumer or router usually, 
    // but clearing state triggers re-render of protected routes
  };

  return (
    <AuthContext.Provider value={{ ...state, loginSuccess, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};