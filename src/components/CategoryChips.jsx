import React from 'react';
import { Sparkles, Home, Utensils, Flame, ShieldAlert } from 'lucide-react';

const iconMap = { Sparkles, Home, Utensils, Flame, ShieldAlert };

export default function CategoryChips({ categories, activeCategory, onSelectCategory }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '8px 20px',
      scrollbarWidth: 'none'
    }}>
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Sparkles;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`category-chip ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={14} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
