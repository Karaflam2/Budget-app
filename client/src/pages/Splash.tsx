import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Si la vérification est terminée
    if (!isLoading) {
      // Rediriger selon l'authentification
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 animate-pulse">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Budget App</h1>
        <p className="text-blue-100">Chargement en cours...</p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export default Splash;