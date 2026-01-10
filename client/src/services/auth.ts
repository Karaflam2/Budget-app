// src/services/auth.ts
import { api } from './api';
import type { User } from '../types';

/**
 * Service d'authentification
 * Gère login, register, logout et récupération de l'utilisateur courant
 */

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}

// ✅ ÉTAPE 1: Connexion utilisateur
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });

    // 💾 Sauvegarder le token
    localStorage.setItem('token', response.data.token);

    return response.data;
  } catch (error: any) {
    // Extraire le message d'erreur du serveur
    const message = error.response?.data?.message || 'Erreur de connexion';
    throw new Error(message);
  }
};

// ✅ ÉTAPE 2: Inscription nouvel utilisateur
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    });

    // 💾 Sauvegarder le token
    localStorage.setItem('token', response.data.token);

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Erreur d\'inscription';
    throw new Error(message);
  }
};

// ✅ ÉTAPE 3: Déconnexion
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ✅ ÉTAPE 4: Récupérer l'utilisateur courant
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Impossible de récupérer l\'utilisateur');
  }
};

// ✅ ÉTAPE 5: Vérifier si utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// ✅ ÉTAPE 6: Récupérer le token sauvegardé
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// ✅ ÉTAPE 7: Réinitialiser le mot de passe
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/reset-password', { email });
  } catch (error: any) {
    throw new Error('Erreur lors de la réinitialisation');
  }
};