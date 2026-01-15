// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsChart from '../components/StatsChart';
import TransactionList from '../components/TransactionList';
// import Button from '../components/Button';
import { getTransaction } from '../services/transaction';
import { getCurrentUser, logout } from '../services/auth';
import type { Transaction, User } from '../types';

function Dashboard() {
  
  // ✅ ÉTAPE 1: Définir les états
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ ÉTAPE 2: Charger les données au montage
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [userData, transactionsData] = await Promise.all([
        getCurrentUser(),
        getTransaction()
      ]);
      
      setUser(userData);
      setTransactions(transactionsData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ÉTAPE 3: Calculer les statistiques
  const stats = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    
    totalExpense: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),

    balance: transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0),

    // Grouper par catégorie pour le pie chart
    byCategory: Object.entries(
      transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value })),

    // Grouper par mois pour le line chart
    byMonth: Object.entries(
      transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('fr-FR', { month: 'short' });
        acc[month] = (acc[month] || 0) + (t.type === 'expense' ? -t.amount : t.amount);
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }))
  };

  // ✅ ÉTAPE 4: Rendu
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath="/dashboard"
        onNavigate={(path) => window.location.href = path}
      />

      {/* Contenu Principal */}
      <div className="flex-1 overflow-auto flex flex-col">
        
        {/* Header */}
        <Header
          title="Dashboard"
          user={user || undefined}
          onLogout={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        />

        {/* Contenu */}
        <main className="flex-1 p-8">
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <>
              <div>
                <h1>Bienvenue, {user?.name}!</h1>
                <button onClick={logout}>Déconnexion</button>
              </div>
              {/* Cartes de Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Solde */}
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Solde Total</p>
                  <p className={`text-3xl font-bold mt-2 ${
                    stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.balance.toFixed(2)}€
                  </p>
                </div>

                {/* Revenus */}
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Revenus</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">
                    +{stats.totalIncome.toFixed(2)}€
                  </p>
                </div>

                {/* Dépenses */}
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Dépenses</p>
                  <p className="text-3xl font-bold mt-2 text-red-600">
                    -{stats.totalExpense.toFixed(2)}€
                  </p>
                </div>
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <StatsChart
                  type="line"
                  data={stats.byMonth}
                  dataKey="value"
                  title="Solde par Mois"
                />
                <StatsChart
                  type="pie"
                  data={stats.byCategory}
                  dataKey="value"
                  title="Dépenses par Catégorie"
                />
              </div>

              {/* Transactions Récentes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Transactions Récentes
                </h3>
                <TransactionList
                  transactions={transactions.slice(0, 10)}
                  emptyMessage="Aucune transaction"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;