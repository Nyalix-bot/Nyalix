import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute = ({ element, requiredRole = 'user' }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();

  // Still loading authentication state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admin trying to access user routes
  if (requiredRole === 'user' && userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User trying to access admin routes
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
