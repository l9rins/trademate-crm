import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/components/Layout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ClientsPage from './features/clients/ClientsPage';
import JobsPage from './features/jobs/JobsPage';
import SettingsPage from './features/settings/SettingsPage';
import { useAuth } from './features/auth/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-2xl shadow-teal-500/30 animate-pulse">
          <span className="text-3xl font-black italic">T</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Loading</span>
          <span className="flex gap-0.5">
            <span className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
