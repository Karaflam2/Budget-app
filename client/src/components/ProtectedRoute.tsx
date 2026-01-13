// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  
  // ✅ Vérifier si utilisateur est authentifié
  if (!isAuthenticated()) {
    // Rediriger vers login
    return <Navigate to="/login" replace />;
  }

  // ✅ Sinon afficher la page
  return <>{children}</>;
}

export default ProtectedRoute;