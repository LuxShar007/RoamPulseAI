import React from 'react';
import { Home, Radio, Compass, Bookmark, User } from 'lucide-react';

export default function Navigation({ activeTab, onSelectTab }) {
  return (
    <nav className="bottom-nav">
      <button
        onClick={() => onSelectTab('home')}
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('radar')}
        className={`nav-item ${activeTab === 'radar' ? 'active' : ''}`}
      >
        <Radio size={22} />
        <span>Radar</span>
      </button>

      <button
        onClick={() => onSelectTab('itinerary')}
        className={`nav-item ${activeTab === 'itinerary' ? 'active' : ''}`}
      >
        <Compass size={22} />
        <span>Itinerary</span>
      </button>

      <button
        onClick={() => onSelectTab('saved')}
        className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
      >
        <Bookmark size={22} />
        <span>Saved</span>
      </button>

      <button
        onClick={() => onSelectTab('profile')}
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
      >
        <User size={22} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
