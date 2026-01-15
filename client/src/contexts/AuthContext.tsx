// src/contexts/AuthContext.tsx
import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/auth';
import type { User } from '../types';

// ✅ ÉTAPE 1: Définir le type du contexte
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Méthodes
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// ✅ ÉTAPE 2: Créer le contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ ÉTAPE 3: Créer le provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  
  // États
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ ÉTAPE 4: Charger les données au montage (restore session)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier s'il y a un token sauvegardé
        const savedToken = authService.getToken();
        if (savedToken) {
          setToken(savedToken);
          
          // Vérifier que le token est toujours valide
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        // Si le token n'est pas valide, le nettoyer
        authService.logout();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ✅ ÉTAPE 5: Fonction login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      // Nettoyer en cas d'erreur
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ ÉTAPE 6: Fonction register
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(name, email, password);
      
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ ÉTAPE 7: Fonction logout
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  // ✅ ÉTAPE 8: Vérifier l'authentification
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Token invalide
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // ✅ ÉTAPE 9: Valeur du contexte
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}