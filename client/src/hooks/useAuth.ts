// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook pour accéder au contexte d'authentification
 * À utiliser dans n'importe quel composant
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'AuthProvider');
  }
  
  return context;
}