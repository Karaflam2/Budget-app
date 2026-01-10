// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import Button from '../components/Button';
import Input from '../components/Input';

interface LoginFormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

function Login() {
  
  // ✅ ÉTAPE 1: Définir les états
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ ÉTAPE 2: Validation côté client
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation password
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ÉTAPE 3: Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valider
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Appeler l'API
      const response = await login(email, password);

      // Sauvegarder l'utilisateur (optionnel)
      localStorage.setItem('user', JSON.stringify(response.user));

      // Afficher un message de succès
      console.log('✅ Connexion réussie!');

      // Rediriger vers dashboard
      navigate('/dashboard');

    } catch (error: any) {
      // Afficher l'erreur
      setErrors({
        submit: error.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ÉTAPE 4: Réinitialiser les erreurs lors de la saisie
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center p-4">
      
      {/* Conteneur principal */}
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Logo/Titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Budget App</h1>
            <p className="text-gray-600 text-sm mt-1">Gérez vos finances intelligemment</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="vous@example.com"
                error={errors.email}
                required={true}
                disabled={isLoading}
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                error={errors.password}
                required={true}
                disabled={isLoading}
              />
              {/* Bouton afficher/masquer */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600 hover:text-gray-800 transition"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Erreur générale */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">
                  ❌ {errors.submit}
                </p>
              </div>
            )}

            {/* Lien mot de passe oublié */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Mot de passe oublié?
              </Link>
            </div>

            {/* Bouton Connexion */}
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Connexion en cours...' : '🔓 Se Connecter'}
            </Button>

          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Inscription */}
          <p className="text-center text-gray-600">
            Pas encore de compte?{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-bold"
            >
              S'inscrire
            </Link>
          </p>

        </div>

        {/* Infos supplémentaires */}
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-90">
            Données sécurisées • Suivi automatique • Gratuit
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;