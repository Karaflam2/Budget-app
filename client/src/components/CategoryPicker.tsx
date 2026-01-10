import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface CategoryPickerProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  onCreateCategory?: (name: string) => Promise<void>;
  onDeleteCategory?: (id: string) => Promise<void>;
  isLoading?: boolean;
  allowCreate?: boolean;
  allowDelete?: boolean;
}

function CategoryPicker({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
  onDeleteCategory,
  isLoading = false,
  allowCreate = false,
  allowDelete = false,
}: CategoryPickerProps) {
  
  // ✅ ÉTAPE 1: États
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // ✅ ÉTAPE 2: Validation et création
  const handleCreateCategory = async () => {
    setError('');

    // Validation
    if (!newCategoryName.trim()) {
      setError('Le nom de la catégorie ne peut pas être vide');
      return;
    }

    // Vérifier si la catégorie existe déjà
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setError('Cette catégorie existe déjà');
      return;
    }

    if (!onCreateCategory) return;

    setIsCreating(true);
    try {
      await onCreateCategory(newCategoryName);
      setNewCategoryName('');
    } catch (err) {
      setError('Erreur lors de la création de la catégorie');
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ ÉTAPE 3: Suppression
  const handleDeleteCategory = async (id: string) => {
    if (!onDeleteCategory) return;

    setIsDeleting(true);
    try {
      await onDeleteCategory(id);
      setDeleteConfirm(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ✅ ÉTAPE 4: Afficher les catégories existantes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Catégories
        </h3>
        
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune catégorie créée</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category.id} className="relative group">
                <button
                  onClick={() => onSelectCategory?.(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </button>

                {/* ✅ ÉTAPE 5: Bouton supprimer au survol */}
                {allowDelete && (
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                    title="Supprimer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ ÉTAPE 6: Créer une nouvelle catégorie */}
      {allowCreate && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Nouvelle catégorie
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError('');
              }}
              placeholder="Nom de la catégorie"
              disabled={isCreating}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateCategory();
                }
              }}
            />
            <Button
              variant="success"
              onClick={handleCreateCategory}
              disabled={isCreating || !newCategoryName.trim()}
            >
              {isCreating ? 'Création...' : 'Créer'}
            </Button>
          </div>

          {/* ✅ ÉTAPE 7: Messages d'erreur */}
          {error && (
            <p className="text-danger text-sm mt-2">{error}</p>
          )}
        </div>
      )}

      {/* ✅ ÉTAPE 8: Modal de confirmation de suppression */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Supprimer la catégorie"
      >
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer cette catégorie ?
        </p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDeleteCategory(deleteConfirm)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
          <Button
            variant="primary"
            onClick={() => setDeleteConfirm(null)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default CategoryPicker;