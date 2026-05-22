import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext';

const Layout = React.lazy(() => import('./shared/components/Layout'));
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./features/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('./features/dashboard/DashboardPage'));
const ClientsPage = React.lazy(() => import('./features/clients/ClientsPage'));
const JobsPage = React.lazy(() => import('./features/jobs/JobsPage'));
const SettingsPage = React.lazy(() => import('./features/settings/SettingsPage'));

const AppLoading = () => (
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

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoading />;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Suspense fallback={<AppLoading />}>
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
    </Suspense>
  );
}

export default App;
