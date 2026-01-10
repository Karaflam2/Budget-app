// src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';
import Button from '../components/Button';
import Input from '../components/Input';

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  submit?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

function Register() {
  
  // ✅ ÉTAPE 1: Définir les états
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ ÉTAPE 2: Calculer la force du mot de passe
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

    return {
      score: Math.min(score, 4),
      label: labels[score] || 'Très faible',
      color: colors[score] || 'bg-red-500'
    };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // ✅ ÉTAPE 3: Validation complète
  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    // Validation nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Le nom ne doit pas dépasser 50 caractères';
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation password
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Doit contenir au moins une minuscule';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Doit contenir au moins une majuscule';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Doit contenir au moins un chiffre';
    }

    // Validation confirmation password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation conditions d'utilisation
    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ÉTAPE 4: Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await register(
        formData.name,
        formData.email,
        formData.password
      );

      // Sauvegarder l'utilisateur
      localStorage.setItem('user', JSON.stringify(response.user));

      console.log('✅ Inscription réussie!');

      // Rediriger vers dashboard
      navigate('/dashboard');

    } catch (error: any) {
      setErrors({
        submit: error.message || 'Erreur lors de l\'inscription. Essayez un autre email.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ÉTAPE 5: Gérer les changements de champs
  const handleFieldChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    
    // Nettoyer l'erreur du champ
    if (errors[field as keyof RegisterFormErrors]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
  };

  // ✅ ÉTAPE 6: Vérifier si le formulaire peut être soumis
  const isFormValid = formData.name && formData.email && 
                      formData.password && formData.confirmPassword && 
                      acceptTerms && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-success to-emerald-700 flex items-center justify-center p-4 py-8">
      
      {/* Conteneur principal */}
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Logo/Titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Créer un compte</h1>
            <p className="text-gray-600 text-sm mt-1">Gérez vos finances gratuitement</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nom */}
            <Input
              label="Nom complet"
              type="text"
              value={formData.name}
              onChange={(value) => handleFieldChange('name', value)}
              placeholder="Jean Dupont"
              error={errors.name}
              required={true}
              disabled={isLoading}
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleFieldChange('email', value)}
              placeholder="vous@example.com"
              error={errors.email}
              required={true}
              disabled={isLoading}
            />

            {/* Mot de passe */}
            <div>
              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(value) => handleFieldChange('password', value)}
                  placeholder="••••••••"
                  error={errors.password}
                  required={true}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Indicateur force password */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Force du mot de passe</span>
                    <span className={`font-semibold ${
                      passwordStrength.color === 'bg-red-500' ? 'text-red-600' :
                      passwordStrength.color === 'bg-orange-500' ? 'text-orange-600' :
                      passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' :
                      passwordStrength.color === 'bg-lime-500' ? 'text-lime-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score + 1) * 25}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation password */}
            <div className="relative">
              <Input
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(value) => handleFieldChange('confirmPassword', value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                required={true}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Conditions d'utilisation */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors({ ...errors, terms: undefined });
                  }
                }}
                className="mt-1 w-4 h-4 text-primary cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                J'accepte les{' '}
                <a href="/terms" className="text-primary font-medium hover:underline">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-primary font-medium hover:underline">
                  politique de confidentialité
                </a>
              </label>
            </div>

            {errors.terms && (
              <p className="text-danger text-sm">{errors.terms}</p>
            )}

            {/* Erreur générale */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">
                  ❌ {errors.submit}
                </p>
              </div>
            )}

            {/* Bouton Inscription */}
            <Button
              type="submit"
              variant="success"
              disabled={!isFormValid}
            >
              {isLoading ? '⏳ Création en cours...' : '✅ Créer mon compte'}
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

          {/* Connexion */}
          <p className="text-center text-gray-600">
            Vous avez déjà un compte?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-bold"
            >
              Se connecter
            </Link>
          </p>

        </div>

        {/* Infos supplémentaires */}
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-90">
            💳 Gratuit • 🔒 Sécurisé • 📱 Accessible partout
          </p>
        </div>

      </div>

    </div>
  );
}

export default Register;