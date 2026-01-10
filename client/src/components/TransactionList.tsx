import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => Promise<void>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  emptyMessage?: string;
}

function TransactionList({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore = false,
  emptyMessage = 'Aucune transaction',
}: TransactionListProps) {
  
  // ✅ ÉTAPE 1: État pour la confirmation de suppression
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ ÉTAPE 2: Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  // ✅ ÉTAPE 3: Fonction pour formater le montant
  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'income' ? '+' : '-';
    const className = type === 'income' ? 'text-green-600' : 'text-danger';
    return (
      <span className={`${className} font-semibold`}>
        {sign}{amount.toFixed(2)}€
      </span>
    );
  };

  // ✅ ÉTAPE 4: Gérer la suppression
  const handleDeleteConfirm = async (id: string) => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setIsDeleting(false);
    }
  };

  // ✅ ÉTAPE 5: État vide
  if (transactions.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
        <p className="text-gray-400 text-sm mt-2">
          Créez votre première transaction pour commencer 💰
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ ÉTAPE 6: Conteneur */}
      <div className="space-y-2">
        
        {/* ✅ ÉTAPE 7: En-tête du tableau */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-200 rounded-t-lg font-semibold text-sm text-gray-700">
          <div className="col-span-3">Catégorie</div>
          <div className="col-span-2">Montant</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Actions</div>
        </div>

        {/* ✅ ÉTAPE 8: Liste des transactions */}
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-lg shadow p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center border-l-4"
            style={{
              borderLeftColor: transaction.type === 'income' ? '#10B981' : '#EF4444',
            }}
          >
            {/* Mobile: Layout en colonne */}
            <div className="md:hidden mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {transaction.category}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                {formatAmount(transaction.amount, transaction.type)}
              </div>
              {transaction.description && (
                <p className="text-xs text-gray-600 mt-2">
                  {transaction.description}
                </p>
              )}
            </div>

            {/* Desktop: Layout en grille */}
            <div className="hidden md:block md:col-span-3 font-semibold text-gray-800">
              {transaction.category}
            </div>
            <div className="hidden md:block md:col-span-2">
              {formatAmount(transaction.amount, transaction.type)}
            </div>
            <div className="hidden md:block md:col-span-2">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {transaction.type === 'income' ? '💰 Revenu' : '🛒 Dépense'}
              </span>
            </div>
            <div className="hidden md:block md:col-span-2 text-gray-600 text-sm">
              {formatDate(transaction.date)}
            </div>

            {/* ✅ ÉTAPE 9: Boutons d'actions */}
            <div className="flex gap-2 md:col-span-3">
              {onEdit && (
                <button
                  onClick={() => onEdit(transaction)}
                  className="flex-1 md:flex-none px-3 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600 transition"
                >
                  ✏️ Éditer
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => setDeleteConfirm(transaction.id)}
                  className="flex-1 md:flex-none px-3 py-1 bg-danger text-white text-sm rounded hover:bg-red-600 transition"
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
          </div>
        ))}

        {/* ✅ ÉTAPE 10: Spinner de chargement */}
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Chargement...</p>
          </div>
        )}

        {/* ✅ ÉTAPE 11: Bouton "Charger plus" */}
        {hasMore && !isLoading && onLoadMore && (
          <div className="text-center mt-4">
            <Button
              onClick={onLoadMore}
              variant="primary"
              disabled={isLoading}
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>

      {/* ✅ ÉTAPE 12: Modal de confirmation de suppression */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmer la suppression"
      >
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer cette transaction ?
        </p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDeleteConfirm(deleteConfirm)}
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
    </>
  );
}

export default TransactionList;