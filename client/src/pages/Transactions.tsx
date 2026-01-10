// src/pages/Transactions.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { getTransaction, createTransaction } from '../services/transaction';
import type { Transaction } from '../types';

function Transactions() {
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories] = useState(['Alimentation', 'Transport', 'Salaire', 'Loisirs']);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransaction();
      setTransactions(data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setIsLoading(true);
      await createTransaction(transaction);
      await loadTransactions();
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={true}
        onClose={() => {}}
        currentPath="/transactions"
        onNavigate={(path) => window.location.href = path}
      />

      <div className="flex-1 overflow-auto flex flex-col">
        <Header
          title="Transactions"
          user={undefined}
          onLogout={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        />

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mes Transactions</h2>
            <Button
              onClick={() => setIsFormOpen(true)}
              variant="success"
            >
              + Nouvelle Transaction
            </Button>
          </div>

          <TransactionList
            transactions={transactions}
            isLoading={isLoading}
            onEdit={setEditingTransaction}
            onDelete={async (id) => {
              // À implémenter: deleteTransaction(id)
              await loadTransactions();
            }}
          />
        </main>
      </div>

      {/* Modal Formulaire */}
      <Modal
        isOpen={isFormOpen || !!editingTransaction}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? 'Modifier' : 'Nouvelle Transaction'}
      >
        <TransactionForm
          onSubmit={handleCreateTransaction}
          isLoading={isLoading}
          initialData={editingTransaction || undefined}
          categories={categories}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Transactions;