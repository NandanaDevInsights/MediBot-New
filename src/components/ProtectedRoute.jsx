import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = sessionStorage.getItem('auth_role');
    const location = useLocation();
    const [isLoading, setIsLoading] = React.useState(!role);
    const [isVerified, setIsVerified] = React.useState(!!role);

    React.useEffect(() => {
        if (!role) {
            // Attempt to recover session from backend
            fetch(`${API_BASE}/profile`, { credentials: 'include' })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Not authenticated');
                })
                .then(data => {
                    // Recovered!
                    sessionStorage.setItem('auth_role', data.role);
                    setIsVerified(true);
                })
                .catch(() => {
                    setIsVerified(false);
                })
                .finally(() => setIsLoading(false));
        }
    }, [role]);

    if (isLoading) {
        return (
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
                        <p style={{ margin: '4px 0 0', fontWeight: '600', color: '#64748b' }}>Verifying session...</p>
                    </div>
                </div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Role check after loading
    const currentRole = sessionStorage.getItem('auth_role');

    if (!currentRole) {
        // Not logged in
        if (allowedRoles.includes('LAB_ADMIN') || allowedRoles.includes('SUPER_ADMIN')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        // Wrong role
        if (currentRole === 'USER') return <Navigate to="/" replace />;
        if (currentRole === 'LAB_ADMIN') return <Navigate to="/lab-admin-dashboard" replace />;
        if (currentRole === 'SUPER_ADMIN') return <Navigate to="/super-admin-dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
