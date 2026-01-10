import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

function Sidebar({ isOpen, onClose, currentPath, onNavigate }: SidebarProps) {
  
  // ✅ ÉTAPE 1: Définir les éléments de navigation
  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/budgets', label: 'Budgets', icon: '💰' },
    { path: '/categories', label: 'Catégories', icon: '🏷️' },
  ];

  // ✅ ÉTAPE 2: Fonction pour vérifier si c'est la page active
  const isActive = (path: string) => currentPath === path;

  // ✅ ÉTAPE 3: Fermer le sidebar quand on clique dehors (mobile)
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* ✅ ÉTAPE 4: Overlay (mobile uniquement) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* ✅ ÉTAPE 5: Sidebar lui-même */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* ✅ ÉTAPE 6: Header du sidebar (fermer sur mobile) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Budget App</h2>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* ✅ ÉTAPE 7: Liste de navigation */}
        <nav className="mt-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                isActive(item.path)
                  ? 'bg-primary border-l-4 border-primary font-semibold'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ✅ ÉTAPE 8: Espacement et logout */}
        <div className="absolute bottom-0 w-full border-t border-gray-700">
          <button
            onClick={() => onNavigate('/logout')}
            className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-gray-800 transition"
          >
            <span className="text-xl">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;