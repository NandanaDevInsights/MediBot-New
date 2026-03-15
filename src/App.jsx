import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Lazy load major pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const LabAdminDashboard = lazy(() => import('./pages/LabAdminDashboard'))
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminSignupPage = lazy(() => import('./pages/admin/AdminSignupPage'))
const AdminForgotPasswordPage = lazy(() => import('./pages/admin/AdminForgotPasswordPage'))
const AdminAuthLayout = lazy(() => import('./pages/admin/AdminAuthLayout'))
// Static assets
import heroImage from './assets/bg.jpg'
import logoImage from './assets/logo.png'
import './App.css'

const AuthLayout = ({ children, heading, subheading }) => {
  const location = useLocation()
  const isLogin = location.pathname === '/' || location.pathname === '/login'

  return (
    <div className="auth-shell">
      <div className="hero-side">
        <img src={heroImage} alt="MediBot Healthcare" />
        <div className="hero-copy">
          <p className="hero-title">Healthcare Intelligence</p>
          <p className="hero-sub">Access your AI-powered healthcare management system.</p>
        </div>
      </div>

      <div className="form-side">
        <div className="admin-chip">
          <Link to="/admin/login">Admin panel</Link>
        </div>
        <div className="brand-row" style={{ flexDirection: 'column', marginBottom: '16px' }}>
          <img src={logoImage} alt="MediBot Logo" style={{ width: 56, height: 'auto', marginBottom: '12px' }} />
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: 0 }}>MediBot</h2>
        </div>
        <div className="intro">
          {/* Main heading now integrated into brand-row */}
          <p className="sub-text">{subheading || 'Please enter your details to continue.'}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

import { LoadingProvider } from './utils/LoadingContext'
import GlobalLoader from './components/GlobalLoader'

function App() {
  return (
    <LoadingProvider>
      <GlobalLoader />
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          gap: '24px',
          color: '#0369a1'
        }}>
          <div style={{ padding: '40px', background: 'white', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid #f1f5f9', 
              borderTop: '4px solid #0ea5e9', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>MediBot</h2>
              <p style={{ margin: '4px 0 0', fontWeight: '600', color: '#64748b' }}>Healthcare Intelligence</p>
            </div>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      }>
        <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout heading="Welcome back" subheading="Please enter your details to access your account.">
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout heading="Create Account" subheading="Sign up with your work email to access MediBot.">
              <SignupPage />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot"
          element={
            <AuthLayout heading="Forgot Password" subheading="Enter your account email to receive reset instructions.">
              <ForgotPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset"
          element={
            <AuthLayout heading="Set a new password" subheading="Enter a strong password for your MediBot account.">
              <ResetPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/lab-admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
              <LabAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Auth Routes */}
        <Route
          path="/admin/login"
          element={
            <AdminAuthLayout heading="Admin Access">
              <AdminLoginPage />
            </AdminAuthLayout>
          }
        />
        <Route
          path="/admin/signup"
          element={
            <AdminAuthLayout heading="Request Access">
              <AdminSignupPage />
            </AdminAuthLayout>
          }
        />
        <Route
          path="/admin/forgot"
          element={
            <AdminAuthLayout heading="Reset Password">
              <AdminForgotPasswordPage />
            </AdminAuthLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </LoadingProvider>
  )
}


export default App
