import React, { useState, useEffect, useCallback } from 'react';
import { PropertyTransaction, MarketAnalytics, DetectedLocation, RouteResult } from './types';
import { fetchTransactions, reverseGeocodeOneMap, FilterParams } from './services/api';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { PropertyMap } from './components/PropertyMap';
import { PropertyDetailsPanel } from './components/PropertyDetailsPanel';
import { PropertyList } from './components/PropertyList';
import { SoraPlannerModal } from './components/SoraPlannerModal';
import { SlaStatusModal } from './components/SlaStatusModal';
import { List, Map as MapIcon, SplitSquareVertical } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<PropertyTransaction[]>([]);
  const [analytics, setAnalytics] = useState<MarketAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyTransaction | null>(null);

  // Geolocation detector states
  const [userLocation, setUserLocation] = useState<DetectedLocation | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // SLA routing state
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);

  // Map Basemap (Singapore SLA OneMap)
  const [mapBasemap] = useState<'onemap_light'>('onemap_light');

  // View Layout: 'split' | 'map_only' | 'list_only'
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  // Modals
  const [showSoraPlanner, setShowSoraPlanner] = useState(false);
  const [soraPlannerMode, setSoraPlannerMode] = useState<'purchase' | 'sale'>('purchase');
  const [showSlaStatusModal, setShowSlaStatusModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterParams>({
    marketSegments: ['CCR', 'RCR', 'OCR'],
    propertyTypes: [],
    tenureType: 'all',
  });

  // Fetch transactions based on filters and geolocation
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const queryFilters: FilterParams = {
        ...filters,
      };

      if (userLocation && radiusKm > 0) {
        queryFilters.nearLat = userLocation.lat;
        queryFilters.nearLng = userLocation.lng;
        queryFilters.radiusKm = radiusKm;
      }

      const res = await fetchTransactions(queryFilters);
      setTransactions(res.data);
      setAnalytics(res.analytics);

      // If selected property is no longer in results, unselect or keep
      if (selectedProperty && !res.data.some((d) => d.id === selectedProperty.id)) {
        // keep it or leave it
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation, radiusKm, selectedProperty]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Geolocation detector handler
  const handleDetectLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoNotice('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsDetectingLocation(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // Call SLA reverse geocode endpoint to fetch building & postal details
        let address = 'Singapore Area';
        let buildingName = 'Detected Location';
        let postalCode = '';

        try {
          const revRes = await reverseGeocodeOneMap(latitude, longitude);
          if (revRes.GeocodeInfo && revRes.GeocodeInfo.length > 0) {
            const first = revRes.GeocodeInfo[0];
            buildingName = first.BUILDINGNAME || first.ROAD || 'Singapore Location';
            address = first.ROAD ? `${first.BLOCK ? first.BLOCK + ' ' : ''}${first.ROAD}` : '';
            postalCode = first.POSTALCODE || '';
          }
        } catch (e) {
          console.warn('Reverse geocode fallback:', e);
        }

        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracyMeters: accuracy,
          buildingName,
          address,
          postalCode,
          source: 'browser_gps',
        });
        setIsDetectingLocation(false);
        setGeoNotice(`Located at ${buildingName} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsDetectingLocation(false);
        setGeoNotice(
          'Location access was not granted. You can select a focal Singapore hub like CBD, Queenstown, or Bishan from the dropdown.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Preset location simulator
  const handleSimulateLocation = (name: string, lat: number, lng: number) => {
    setUserLocation({
      lat,
      lng,
      accuracyMeters: 50,
      buildingName: name,
      address: name,
      source: 'simulated',
    });
    setGeoNotice(`Focal location set to ${name}`);
  };

  // Map Click Reverse Geocode
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const revRes = await reverseGeocodeOneMap(lat, lng);
      if (revRes.GeocodeInfo && revRes.GeocodeInfo.length > 0) {
        const first = revRes.GeocodeInfo[0];
        const bName = first.BUILDINGNAME || first.ROAD || 'Custom Pin';
        setUserLocation({
          lat,
          lng,
          buildingName: bName,
          address: first.ROAD || '',
          postalCode: first.POSTALCODE || '',
          source: 'onemap_search',
        });
        setGeoNotice(`Set reference location to ${bName}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open SORA planner
  const handleOpenSoraPlanner = (property: PropertyTransaction, mode: 'purchase' | 'sale') => {
    setSelectedProperty(property);
    setSoraPlannerMode(mode);
    setShowSoraPlanner(true);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Header */}
      <Header
        analytics={analytics}
        onOpenSlaModal={() => setShowSlaStatusModal(true)}
        onOpenSoraModal={() => {
          setSoraPlannerMode('purchase');
          setShowSoraPlanner(true);
        }}
      />

      {/* Geolocation & Filter Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onDetectLocation={handleDetectLocation}
        onSimulateLocation={handleSimulateLocation}
        isDetectingLocation={isDetectingLocation}
        userLocation={userLocation}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        totalResults={transactions.length}
      />

      {/* Geolocation Notice Banner (Dismissible) */}
      {geoNotice && (
        <div className="flex items-center justify-between bg-emerald-950/70 border-b border-emerald-800/40 px-4 py-1.5 text-xs text-emerald-200">
          <span className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{geoNotice}</span>
          </span>
          <button
            onClick={() => setGeoNotice(null)}
            className="text-emerald-400 hover:text-white ml-2 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Map View Container */}
        <div
          className={`relative h-full flex-1 transition-all ${
            viewMode === 'list' ? 'hidden' : 'block'
          }`}
        >
          <PropertyMap
            transactions={transactions}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
            userLocation={userLocation}
            radiusKm={radiusKm}
            activeRoute={activeRoute}
            mapBasemap={mapBasemap}
            onMapClick={handleMapClick}
          />

          {/* Floating View Switcher on Map */}
          <div className="absolute top-4 right-4 z-10 flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/80 shadow-lg backdrop-blur-md text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'split'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <SplitSquareVertical className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Right Drawer / Sidebar: Selected Property Details OR Transaction List */}
        {selectedProperty ? (
          <PropertyDetailsPanel
            property={selectedProperty}
            onClose={() => {
              setSelectedProperty(null);
              setActiveRoute(null);
            }}
            userLocation={userLocation}
            onOpenSoraPlanner={handleOpenSoraPlanner}
            onRouteCalculated={setActiveRoute}
            activeRoute={activeRoute}
          />
        ) : viewMode !== 'map' ? (
          <PropertyList
            transactions={transactions}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
          />
        ) : null}
      </div>

      {/* SORA Mortgage & Purchase/Sale Planner Modal */}
      {showSoraPlanner && (
        <SoraPlannerModal
          property={selectedProperty}
          initialMode={soraPlannerMode}
          onClose={() => setShowSoraPlanner(false)}
        />
      )}

      {/* SLA OneMap Diagnostics & Token Hub Modal */}
      {showSlaStatusModal && (
        <SlaStatusModal onClose={() => setShowSlaStatusModal(false)} />
      )}
    </div>
  );
}
