import { useState, useEffect } from 'react';
import './index.css';
import { ArrowLeft } from 'lucide-react';

// Components
import SplashScreen from './components/SplashScreen';
import AuthModal from './components/AuthModal';
import PreferencesSetup from './components/PreferencesSetup';
import PermissionsPrompt from './components/PermissionsPrompt';
import Header from './components/Header';
import CategoryChips from './components/CategoryChips';
import StaysCategoryFeed from './components/StaysCategoryFeed';
import LocoGemsFeed from './components/LocoGemsFeed';
import RadarMap from './components/RadarMap';
import AIStatCardView from './components/AIStatCardView';
import NotificationCenter from './components/NotificationCenter';
import ActiveSearch from './components/ActiveSearch';
import FilterModal from './components/FilterModal';
import BookingConfirmation from './components/BookingConfirmation';
import SavedPlaces from './components/SavedPlaces';
import UserProfile from './components/UserProfile';
import BudgetOptimizer from './components/BudgetOptimizer';
import OfflineMaps from './components/OfflineMaps';
import SettingsPage from './components/SettingsPage';
import Navigation from './components/Navigation';
import NavigationPreview from './components/NavigationPreview';
import LiveNavigationModal from './components/LiveNavigationModal';
import ItineraryPlanner from './components/ItineraryPlanner';
import BudgetAnalyticsView from './components/BudgetAnalyticsView';
import IPhone17ProMaxFrame from './components/IPhone17ProMaxFrame';

// Services & Data
import { mockData } from './data/mockData';
import { apiClient } from './data/apiClient';
import { fetchLiveWeatherAndAQI } from './services/weatherService';

const SCREEN = {
  SPLASH: 'splash',
  AUTH: 'auth',
  PREFERENCES: 'preferences',
  PERMISSIONS: 'permissions',
  MAIN: 'main',
};

export default function App() {
  const [screen, setScreen] = useState(SCREEN.SPLASH);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('emerald');

  // Real-Time Locality Data & Weather State
  const [userPos, setUserPos] = useState([19.033, 73.029]);
  const [localityName, setLocalityName] = useState('Navi Mumbai');
  const [weatherData, setWeatherData] = useState(null);
  const [dbItineraries, setDbItineraries] = useState([]);
  const [liveData, setLiveData] = useState({
    stays: mockData.stays,
    locogems: mockData.locoGems,
    dining: mockData.dining,
    washrooms: mockData.washrooms,
    medicalHubs: mockData.medicalHubs,
    loading: false
  });

  // Overlays
  const [selectedStay, setSelectedStay] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showOfflineMaps, setShowOfflineMaps] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNavPreview, setShowNavPreview] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [navTarget, setNavTarget] = useState(null);

  // ─── Fetch SQLite DB Saved Itineraries ──────────────────────────────────

  const fetchDbItineraries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/db/itineraries');
      const json = await res.json();
      if (json?.data) {
        setDbItineraries(json.data);
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchDbItineraries();
  }, []);

  // ─── Real-Time OpenStreetMap Locality & Weather Fetch ──────────────────────

  const fetchLiveLocality = async (lat, lng) => {
    setLiveData(prev => ({ ...prev, loading: true }));
    try {
      const [data, weather] = await Promise.all([
        apiClient.getLiveLocalityData(lat, lng),
        fetchLiveWeatherAndAQI(lat, lng)
      ]);

      if (weather) setWeatherData(weather);

      if (data) {
        if (data.locality) setLocalityName(data.locality);
        setLiveData({
          stays: data.stays || [],
          locogems: data.locogems || [],
          dining: data.dining || [],
          washrooms: data.washrooms || [],
          medicalHubs: data.medicalHubs || [],
          loading: false
        });
      } else {
        setLiveData(prev => ({ ...prev, loading: false }));
      }
    } catch {
      setLiveData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserPos([lat, lng]);
          fetchLiveLocality(lat, lng);
        },
        () => fetchLiveLocality(19.033, 73.029)
      );
    } else {
      fetchLiveLocality(19.033, 73.029);
    }
  }, []);

  const handleSelectSearchedLocality = async (queryText) => {
    setSearchQuery(queryText);
    setShowSearch(false);
    try {
      const res = await fetch(`http://localhost:5000/api/google/place?query=${encodeURIComponent(queryText)}`);
      const json = await res.json();
      if (json?.data?.lat && json?.data?.lng) {
        const lat = json.data.lat;
        const lng = json.data.lng;
        setUserPos([lat, lng]);
        setLocalityName(json.data.name || queryText);
        fetchLiveLocality(lat, lng);
      }
    } catch (err) {
      console.error('Locality resolution error:', err);
    }
  };

  // SQLite Persistence Save Handlers
  const handleSaveItinerary = async (plan) => {
    try {
      await fetch('http://localhost:5000/api/db/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locality: localityName,
          days: plan.length,
          vibe: 'PEACE',
          budget: '₹3,000 - ₹6,000',
          planJson: plan
        })
      });
      fetchDbItineraries();
    } catch {
      // Graceful fallback
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      await fetch('http://localhost:5000/api/db/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } catch {
      // Graceful fallback
    }
  };

  // Onboarding flow
  const handleGetStarted = () => setScreen(SCREEN.AUTH);
  const handleLogin = () => setScreen(SCREEN.PREFERENCES);
  const handlePreferencesSave = () => setScreen(SCREEN.PERMISSIONS);
  const handlePermissionsExplore = () => setScreen(SCREEN.MAIN);
  const handleLogout = () => {
    setScreen(SCREEN.SPLASH);
    setActiveTab('home');
    setShowSettings(false);
  };

  // Screen content renderer
  const renderAppView = () => {
    if (selectedStay && screen === SCREEN.MAIN) {
      return (
        <div id="app-viewport" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="screen-content">
            <AIStatCardView
              stay={selectedStay}
              onBack={() => setSelectedStay(null)}
              onBook={() => setShowBooking(true)}
              onNavigate={() => setNavTarget(selectedStay)}
              currency={currency}
            />
          </div>

          {showBooking && (
            <div className="overlay">
              <div style={{ flex: 1 }} onClick={() => setShowBooking(false)} />
              <div className="sheet">
                <div className="sheet-handle" />
                <div className="sheet-body">
                  <BookingConfirmation
                    booking={{
                      name: selectedStay.name,
                      location: selectedStay.location,
                      date: 'Aug 12 - Aug 14, 2026',
                      price: selectedStay.price,
                      hygiene: selectedStay.aiMetrics?.hygiene || 94,
                      ticketId: 'RP-884920-AI'
                    }}
                    onBackToHome={() => {
                      handleCreateBooking({
                        placeName: selectedStay.name,
                        location: selectedStay.location,
                        dateRange: 'Aug 12 - Aug 14, 2026',
                        price: selectedStay.price,
                        hygiene: selectedStay.aiMetrics?.hygiene || 94,
                        ticketId: `RP-${Math.floor(Math.random() * 900000 + 100000)}-AI`
                      });
                      setShowBooking(false);
                      setSelectedStay(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {showNavPreview && (
            <div className="overlay">
              <div style={{ flex: 1 }} onClick={() => setShowNavPreview(false)} />
              <div className="sheet">
                <div className="sheet-handle" />
                <div className="sheet-body">
                  <NavigationPreview
                    target={selectedStay}
                    onClose={() => setShowNavPreview(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {navTarget && (
            <LiveNavigationModal
              target={navTarget}
              userPos={userPos}
              onClose={() => setNavTarget(null)}
            />
          )}
        </div>
      );
    }

    if (showSettings && screen === SCREEN.MAIN) {
      return (
        <div id="app-viewport" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="screen-content">
            <SettingsPage
              user={mockData.user}
              onBack={() => setShowSettings(false)}
              onLogout={handleLogout}
              currency={currency}
              setCurrency={setCurrency}
              currentTheme={theme}
              onSelectTheme={setTheme}
            />
          </div>
        </div>
      );
    }

    // Onboarding screens
    if (screen === SCREEN.SPLASH) return <SplashScreen onStart={handleGetStarted} />;
    if (screen === SCREEN.AUTH) return <AuthModal onLogin={handleLogin} onGuest={handleLogin} />;
    if (screen === SCREEN.PREFERENCES) return <PreferencesSetup onSave={handlePreferencesSave} />;
    if (screen === SCREEN.PERMISSIONS) return <PermissionsPrompt onExplore={handlePermissionsExplore} />;

    // Main app tab rendering
    const renderTabContent = () => {
      if (activeTab === 'home') {
        const showLocogems = activeCategory === 'locogems' || activeCategory === 'dining';
        return (
          <>
            <Header
              location={localityName || mockData.user.location}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenSearch={() => setShowSearch(true)}
              onOpenNotifications={() => setShowNotifications(true)}
              onOpenFilter={() => setShowFilter(true)}
              unreadNotifsCount={3}
              weatherData={weatherData}
            />
            <CategoryChips
              categories={mockData.categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Hero Banner with Live Weather & AQI Badge */}
            <div className="hero-banner">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
                alt="Explore India with RoamPulse AI"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(6,11,18,0.85) 0%, rgba(6,11,18,0.3) 60%, transparent 100%)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'flex-end'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="live-dot" />
                  <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800', letterSpacing: '0.5px' }}>
                    {liveData.loading ? 'SCANNING LOCALITY...' : 'REAL-TIME RADAR ACTIVE'}
                  </span>
                  {weatherData && (
                    <span style={{
                      fontSize: '10px',
                      color: weatherData.aqi?.color || 'var(--accent-cyan)',
                      background: 'rgba(6,11,18,0.8)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontWeight: '800'
                    }}>
                      {weatherData.icon} {weatherData.temperature}°C • AQI {weatherData.aqi?.score} ({weatherData.aqi?.rating})
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.2, color: '#FFF' }}>
                  Explore {localityName} <br />
                  <span style={{ color: 'var(--accent-cyan)' }}>Safely & Smart</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                  {liveData.washrooms.length} Washrooms • {liveData.medicalHubs.length} Medical Hubs • {liveData.stays.length} Stays
                </div>
              </div>
            </div>

            {showLocogems
              ? <LocoGemsFeed
                  locoGemsList={liveData.locogems}
                  diningList={liveData.dining}
                  loading={liveData.loading}
                  onSelectFood={(item) => setNavTarget(item)}
                  currency={currency}
                />
              : <StaysCategoryFeed
                  staysList={liveData.stays}
                  loading={liveData.loading}
                  onSelectStay={setSelectedStay}
                  activeCategoryTab={activeCategory === 'stays' ? 'all' : 'all'}
                  currency={currency}
                />
            }
          </>
        );
      }

      if (activeTab === 'radar') {
        return (
          <RadarMap
            washrooms={liveData.washrooms}
            medicalHubs={liveData.medicalHubs}
            stays={liveData.stays}
            locogems={liveData.locogems}
            userCenter={userPos}
            onNavigate={(item) => setNavTarget(item)}
          />
        );
      }

      if (activeTab === 'itinerary') {
        return (
          <ItineraryPlanner
            localityName={localityName}
            onClose={() => setActiveTab('home')}
            onSaveItinerary={handleSaveItinerary}
          />
        );
      }

      if (activeTab === 'saved') {
        return (
          <SavedPlaces
            savedStays={liveData.stays.slice(0, 2)}
            savedFood={liveData.locogems.slice(0, 2)}
            savedItineraries={dbItineraries}
            onSelectStay={setSelectedStay}
            currency={currency}
          />
        );
      }

      if (activeTab === 'profile') {
        return (
          <UserProfile
            user={mockData.user}
            onOpenSettings={() => setShowSettings(true)}
            onOpenBudget={() => setShowBudget(true)}
            onOpenOfflineMaps={() => setShowOfflineMaps(true)}
            onLogout={handleLogout}
          />
        );
      }
    };

    return (
      <div id="app-viewport" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="screen-content">
          {renderTabContent()}
        </div>

        <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

        {showNotifications && (
          <NotificationCenter
            notifications={mockData.notifications}
            onClose={() => setShowNotifications(false)}
          />
        )}

        {showSearch && (
          <ActiveSearch
            recentSearches={mockData.recentSearches}
            onClose={() => setShowSearch(false)}
            onSelectQuery={handleSelectSearchedLocality}
          />
        )}

        {showFilter && (
          <div className="overlay">
            <div style={{ flex: 1 }} onClick={() => setShowFilter(false)} />
            <div className="sheet">
              <div className="sheet-handle" />
              <div className="sheet-body">
                <FilterModal onApplyFilters={() => setShowFilter(false)} onClose={() => setShowFilter(false)} />
              </div>
            </div>
          </div>
        )}

        {showBudget && (
          <div className="overlay">
            <div style={{ flex: 1 }} onClick={() => setShowBudget(false)} />
            <div className="sheet">
              <div className="sheet-handle" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 6px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setShowBudget(false)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '800',
                    fontSize: '13px'
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                  Saved Money & Budget
                </span>
                <button
                  onClick={() => setShowBudget(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
              <div className="sheet-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
                <BudgetAnalyticsView localityName={localityName} stays={liveData.stays} food={liveData.locogems} currency={currency} />
                <BudgetOptimizer savingsSummary={mockData.savingsSummary} currency={currency} />
              </div>
            </div>
          </div>
        )}

        {showOfflineMaps && (
          <div className="overlay">
            <div style={{ flex: 1 }} onClick={() => setShowOfflineMaps(false)} />
            <div className="sheet">
              <div className="sheet-handle" />
              <div className="sheet-body">
                <OfflineMaps />
              </div>
            </div>
          </div>
        )}

        {showItineraryModal && (
          <ItineraryPlanner
            localityName={localityName}
            onClose={() => setShowItineraryModal(false)}
            onSaveItinerary={handleSaveItinerary}
          />
        )}

        {navTarget && (
          <LiveNavigationModal
            target={navTarget}
            userPos={userPos}
            onClose={() => setNavTarget(null)}
          />
        )}
      </div>
    );
  };

  return (
    <IPhone17ProMaxFrame currentTheme={theme} onSelectTheme={setTheme}>
      {renderAppView()}
    </IPhone17ProMaxFrame>
  );
}
