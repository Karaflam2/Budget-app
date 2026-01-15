import { useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook pour restaurer la session automatiquement
 * Appelé au démarrage de l'app
 */
export function useAuthPersist() {
  const { checkAuth, isLoading } = useAuth();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await checkAuth();
      } catch (error) {
        // La session n'a pas pu être restaurée
        console.log('Session non restaurée');
      }
    };

    // Restaurer la session au montage
    restoreSession();
  }, [checkAuth]);

  return { isLoading };
}