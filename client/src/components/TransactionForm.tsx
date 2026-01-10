import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  isLoading?: boolean;
  initialData?: Transaction;
  categories: string[];
  onCancel?: () => void;
}

function TransactionForm({
  onSubmit,
  isLoading = false,
  initialData,
  categories,
  onCancel,
}: TransactionFormProps) {
  
  // ✅ ÉTAPE 1: États du formulaire
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ ÉTAPE 2: Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être positif';
    }

    if (!formData.category) {
      newErrors.category = 'Sélectionnez une catégorie';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ÉTAPE 3: Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        type: formData.type as 'income' | 'expense',
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description || undefined,
      });
    } catch (err) {
      setErrors({ submit: 'Erreur lors de la création' });
    }
  };

  // ✅ ÉTAPE 4: Gestion des changements
  const handleChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* ✅ ÉTAPE 5: Type de transaction */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">💰 Revenu</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">🛒 Dépense</span>
          </label>
        </div>
      </div>

      {/* ✅ ÉTAPE 6: Montant */}
      <Input
        label="Montant"
        type="number"
        value={formData.amount}
        onChange={(value) => handleChange('amount', value)}
        placeholder="Ex: 150.50"
        error={errors.amount}
        required={true}
        disabled={isLoading}
      />

      {/* ✅ ÉTAPE 7: Catégorie */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie <span className="text-danger">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
            errors.category
              ? 'border-danger focus:ring-danger'
              : 'border-gray-300 focus:ring-primary'
          }`}
        >
          <option value="">-- Sélectionnez --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-danger mt-1">{errors.category}</p>
        )}
      </div>

      {/* ✅ ÉTAPE 8: Date */}
      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(value) => handleChange('date', value)}
        error={errors.date}
        required={true}
        disabled={isLoading}
      />

      {/* ✅ ÉTAPE 9: Description (optionnelle) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optionnel)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ajouter une note..."
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />
      </div>

      {/* ✅ ÉTAPE 10: Boutons */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="danger"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          variant="success"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Création...' : 'Créer'}
        </Button>
      </div>

      {/* ✅ ÉTAPE 11: Erreur générale */}
      {errors.submit && (
        <p className="text-sm text-danger bg-red-50 p-2 rounded">
          {errors.submit}
        </p>
      )}
    </form>
  );
}

export default TransactionForm;