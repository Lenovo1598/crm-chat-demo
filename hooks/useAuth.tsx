'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ id: 1, username: 'admin', role: 'admin', nombre: 'Admin Demo' });
  const [token, setToken] = useState<string | null>('demo-admin-token');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Demo: keep admin user by default
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Demo: accept any credentials
    setUser({ id: 1, username: username, role: 'admin', nombre: 'Admin Demo' });
    setToken('demo-admin-token');
    localStorage.setItem('auth_token', 'demo-admin-token');
    router.push('/admin/inventory');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'admin' || false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
