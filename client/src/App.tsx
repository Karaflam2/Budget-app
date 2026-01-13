// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Categories from './pages/categories';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages protégées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;