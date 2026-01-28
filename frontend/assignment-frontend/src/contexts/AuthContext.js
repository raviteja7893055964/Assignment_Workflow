import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('auth', JSON.stringify(user));
    else localStorage.removeItem('auth');
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const auth = { token: res.data.token, role: res.data.role, name: res.data.name };
      setUser(auth);
      setLoading(false);
      return auth;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
