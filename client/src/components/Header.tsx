import React from 'react';

interface HeaderProps {
  title: string;
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

function Header({ title, user, onLogout }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow">
      {/* ✅ ÉTAPE 1: Conteneur principal */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* ✅ ÉTAPE 2: Logo + Titre */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* ✅ ÉTAPE 3: Section utilisateur (droite) */}
        <div className="flex items-center gap-4">
          
          {/* ✅ ÉTAPE 4: Message de bienvenue */}
          {user && (
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-600">Bienvenue !</p>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
            </div>
          )}

          {/* ✅ ÉTAPE 5: Menu utilisateur (dropdown) */}
          {user && (
            <div className="relative">
              {/* Bouton pour ouvrir le menu */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-600 transition"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {/* Menu déroulant */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  {/* Info utilisateur dans le menu */}
                  <div className="px-4 py-3 border-b">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Bouton Logout */}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-4 py-2 text-danger hover:bg-gray-100 transition"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ ÉTAPE 6: Si pas de user (optionnel) */}
          {!user && (
            <div className="text-gray-600">
              Chargement...
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;