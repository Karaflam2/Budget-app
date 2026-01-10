// src/pages/Categories.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryPicker from '../components/CategoryPicker';
import type { category } from '../types';

const DEFAULT_CATEGORIES: category[] = [
  { id: '1', name: 'Alimentation', color: '#10B981', icon: '🍔' },
  { id: '2', name: 'Transport', color: '#3B82F6', icon: '🚗' },
  { id: '3', name: 'Loisirs', color: '#F59E0B', icon: '🎮' },
  { id: '4', name: 'Salaire', color: '#06B6D4', icon: '💰' },
  { id: '5', name: 'Santé', color: '#EC4899', icon: '⚕️' },
];

function Categories() {
  
  const [categories, setCategories] = useState<category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const handleCreateCategory = async (name: string) => {
    const newCategory: category = {
      id: Date.now().toString(),
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      icon: '📁'
    };
    
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    if (selectedCategory === id) setSelectedCategory(undefined);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Catégories</h2>

      <div className="bg-white rounded-lg shadow p-8">
        <CategoryPicker
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
          allowCreate={true}
          allowDelete={true}
        />
      </div>

      {/* Statistiques par Catégorie */}
      {categories.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
          <p className="text-gray-600">
            Total: <span className="font-bold">{categories.length} catégories</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Categories;