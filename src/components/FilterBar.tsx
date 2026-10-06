import React, { useState } from 'react';
import { FilterParams } from '../services/api';
import { DetectedLocation } from '../types';
import {
  Navigation,
  Search,
  Filter,
  Layers,
  MapPin,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onDetectLocation: () => void;
  onSimulateLocation: (name: string, lat: number, lng: number) => void;
  isDetectingLocation: boolean;
  userLocation: DetectedLocation | null;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  totalResults: number;
}

const PRESET_LOCATIONS = [
  { name: 'Raffles Place / CBD', lat: 1.2839, lng: 103.8515 },
  { name: 'Queenstown (Dawson)', lat: 1.2952, lng: 103.8098 },
  { name: 'Bishan Central', lat: 1.3508, lng: 103.8488 },
  { name: 'Tampines Regional Hub', lat: 1.3533, lng: 103.9452 },
  { name: 'Jurong East Gateway', lat: 1.3331, lng: 103.7422 },
  { name: 'Punggol Waterway', lat: 1.4067, lng: 103.9022 },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onDetectLocation,
  onSimulateLocation,
  isDetectingLocation,
  userLocation,
  radiusKm,
  onRadiusChange,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchInput });
  };

  const handleSegmentToggle = (seg: string) => {
    const current = filters.marketSegments || ['CCR', 'RCR', 'OCR'];
    let updated: string[];
    if (current.includes(seg)) {
      if (current.length === 1) return; // keep at least one
      updated = current.filter((s) => s !== seg);
    } else {
      updated = [...current, seg];
    }
    onFilterChange({ ...filters, marketSegments: updated });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const current = filters.propertyTypes || [];
    let updated: string[];
    if (current.includes(type)) {
      updated = current.filter((t) => t !== type);
    } else {
      updated = [...current, type];
    }
    onFilterChange({ ...filters, propertyTypes: updated });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    onFilterChange({
      marketSegments: ['CCR', 'RCR', 'OCR'],
      propertyTypes: [],
      tenureType: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      minSizeSqft: undefined,
      maxSizeSqft: undefined,
      search: undefined,
    });
  };

  return (
    <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 py-3 text-slate-200">
      {/* Primary Bar: Search, Geolocation Detector, Quick Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search condo, HDB block, road, postal code..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </form>

        {/* Center: Geolocation detector button & quick simulator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDetectLocation}
            disabled={isDetectingLocation}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
              userLocation
                ? 'bg-emerald-600/90 text-white hover:bg-emerald-500 border border-emerald-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Navigation
              className={`h-3.5 w-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`}
            />
            <span>
              {isDetectingLocation
                ? 'Detecting GPS...'
                : userLocation
                ? 'Location Detected'
                : 'Detect Geolocation'}
            </span>
          </button>

          {/* Quick Hub Simulators */}
          <select
            onChange={(e) => {
              const selected = PRESET_LOCATIONS.find((l) => l.name === e.target.value);
              if (selected) {
                onSimulateLocation(selected.name, selected.lat, selected.lng);
              }
            }}
            defaultValue=""
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="" disabled>
              Jump to Focal Estate...
            </option>
            {PRESET_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          {/* Radius selector if location is active */}
          {userLocation && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Radius:</span>
              <select
                value={radiusKm}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none"
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={0}>All SG</option>
              </select>
            </div>
          )}
        </div>

        {/* Right: Advanced Filters toggle & result count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 tabular-nums">
            <span className="font-bold text-white">{totalResults}</span> units matched
          </span>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
              showAdvanced
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
            <ChevronDown
              className={`h-3 w-3 transform transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
          {/* Market Segments */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5">Market Segment</label>
            <div className="flex gap-1.5">
              {['CCR', 'RCR', 'OCR'].map((seg) => {
                const isActive = (filters.marketSegments || ['CCR', 'RCR', 'OCR']).includes(seg);
                return (
                  <button
                    key={seg}
                    onClick={() => handleSegmentToggle(seg)}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold text-xs transition-colors ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Property Types */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5">Property Type</label>
            <div className="flex gap-1.5">
              {[
                { label: 'Condo', value: 'Condominium' },
                { label: 'HDB 4-Rm', value: 'HDB 4-Room' },
                { label: 'HDB 5-Rm', value: 'HDB 5-Room' },
              ].map((pt) => {
                const isActive = (filters.propertyTypes || []).includes(pt.value);
                return (
                  <button
                    key={pt.value}
                    onClick={() => handlePropertyTypeToggle(pt.value)}
                    className={`flex-1 py-1.5 px-1 rounded-lg border font-medium text-[11px] truncate transition-colors ${
                      isActive
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {pt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Land Tenure & Estate Town */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5">Town / Estate</label>
            <select
              value={filters.planningArea || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, planningArea: e.target.value || undefined })
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Estates</option>
              <option value="Tampines">Tampines</option>
              <option value="Bishan">Bishan</option>
              <option value="Queenstown">Queenstown</option>
              <option value="Bedok">Bedok</option>
              <option value="Toa Payoh">Toa Payoh</option>
              <option value="Jurong">Jurong East / West</option>
              <option value="Punggol">Punggol</option>
              <option value="Woodlands">Woodlands</option>
              <option value="Orchard">Orchard / River Valley</option>
              <option value="Downtown">Downtown / Marina Bay</option>
            </select>
          </div>

          {/* Land Tenure */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5">Tenure</label>
            <select
              value={filters.tenureType || 'all'}
              onChange={(e) =>
                onFilterChange({ ...filters, tenureType: e.target.value as any })
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Tenures</option>
              <option value="freehold">Freehold / 999-Year</option>
              <option value="leasehold99">99-Year Leasehold</option>
            </select>
          </div>

          {/* Max Price & Reset */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-slate-400 font-medium block mb-1.5">Max Price</label>
              <select
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Any Price</option>
                <option value="800000">Up to $800k</option>
                <option value="1200000">Up to $1.2M</option>
                <option value="1800000">Up to $1.8M</option>
                <option value="2500000">Up to $2.5M</option>
                <option value="4000000">Up to $4.0M</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
