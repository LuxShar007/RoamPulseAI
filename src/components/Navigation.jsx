import React from 'react';
import { Home, Radio, Compass, Bookmark, Star, User } from 'lucide-react';

export default function Navigation({ activeTab, onSelectTab }) {
  return (
    <nav className="bottom-nav">
      <button
        onClick={() => onSelectTab('home')}
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('radar')}
        className={`nav-item ${activeTab === 'radar' ? 'active' : ''}`}
      >
        <Radio size={20} />
        <span>Radar</span>
      </button>

      <button
        onClick={() => onSelectTab('itinerary')}
        className={`nav-item ${activeTab === 'itinerary' ? 'active' : ''}`}
      >
        <Compass size={20} />
        <span>Itinerary</span>
      </button>

      <button
        onClick={() => onSelectTab('saved')}
        className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
      >
        <Bookmark size={20} />
        <span>Saved</span>
      </button>

      <button
        onClick={() => onSelectTab('review')}
        className={`nav-item ${activeTab === 'review' ? 'active' : ''}`}
      >
        <Star size={20} />
        <span>Review</span>
      </button>

      <button
        onClick={() => onSelectTab('profile')}
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
      >
        <User size={20} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
