import React, { useState } from 'react';
import { PropertyTransaction, DetectedLocation, RouteResult } from '../types';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  Maximize2,
  TrendingUp,
  Compass,
  Calculator,
  Train,
  Clock,
  Layers,
  Building2,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { fetchRoute } from '../services/api';

interface PropertyDetailsPanelProps {
  property: PropertyTransaction;
  onClose: () => void;
  userLocation: DetectedLocation | null;
  onOpenSoraPlanner: (property: PropertyTransaction, mode: 'purchase' | 'sale') => void;
  onRouteCalculated: (route: RouteResult | null) => void;
  activeRoute: RouteResult | null;
}

export const PropertyDetailsPanel: React.FC<PropertyDetailsPanelProps> = ({
  property,
  onClose,
  userLocation,
  onOpenSoraPlanner,
  onRouteCalculated,
  activeRoute,
}) => {
  const [routeType, setRouteType] = useState<'walk' | 'drive' | 'pt' | 'cycle'>('walk');
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const isCondo = property.propertyType.includes('Condominium') || property.propertyType.includes('EC');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-SG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCalculateRoute = async (mode: 'walk' | 'drive' | 'pt' | 'cycle') => {
    if (!userLocation) {
      setRouteError('Please enable Geolocation detection first to calculate route.');
      return;
    }

    setRouteType(mode);
    setLoadingRoute(true);
    setRouteError(null);

    try {
      const res = await fetchRoute(
        userLocation.lat,
        userLocation.lng,
        property.lat,
        property.lng,
        mode
      );
      onRouteCalculated(res);
    } catch (err: any) {
      console.error(err);
      setRouteError('Could not calculate route. Ensure SLA endpoints are reachable.');
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100 overflow-y-auto w-full md:w-96 lg:w-[420px]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                isCondo ? 'text-emerald-400' : 'text-indigo-400'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              {property.propertyType}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{property.marketSegment}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{property.district}</span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-white tracking-tight leading-snug">
            {property.projectName}
          </h2>
          <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span>{property.street}, Singapore {property.postalCode}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Last Done Transaction Highlight Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Last Done Sale Transaction
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white tabular-nums tracking-tight">
              {formatPrice(property.lastPrice)}
            </span>
            <span className="text-sm font-semibold text-emerald-400 tabular-nums">
              ${property.psf.toLocaleString()} psf
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Sale Date
              </span>
              <p className="mt-0.5 font-medium text-slate-200">{formatDate(property.lastSaleDate)}</p>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1">
                <Layers className="h-3 w-3" /> Floor Level
              </span>
              <p className="mt-0.5 font-medium text-slate-200">Level {property.floorRange}</p>
            </div>
          </div>
        </div>

        {/* Essential Property Specs */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Unit & Tenure Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-800/40 p-2.5 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Maximize2 className="h-3 w-3 text-cyan-400" /> Floor Size
              </span>
              <p className="mt-1 font-semibold text-white">
                {property.floorSizeSqft.toLocaleString()} sqft
                <span className="text-slate-400 font-normal ml-1">({property.floorSizeSqm} sqm)</span>
              </p>
            </div>

            <div className="rounded-lg bg-slate-800/40 p-2.5 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-amber-400" /> Year Built
              </span>
              <p className="mt-1 font-semibold text-white">
                {property.yearBuilt}
                {property.unitsInDev && (
                  <span className="text-slate-400 font-normal ml-1">({property.unitsInDev} units)</span>
                )}
              </p>
            </div>

            <div className="col-span-2 rounded-lg bg-slate-800/40 p-2.5 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Land Tenure
              </span>
              <p className="mt-1 font-semibold text-white">{property.tenure}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Remaining Lease: <span className="text-slate-200 font-medium">{property.remainingLease}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Connectivity */}
        <div className="rounded-lg bg-slate-800/30 p-3 border border-slate-800/80 flex items-start gap-2.5 text-xs">
          <Train className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">Public Transit Accessibility</span>
            <p className="text-slate-400 mt-0.5 leading-relaxed">{property.mrtProximity}</p>
            {property.distanceFromUserKm !== undefined && (
              <p className="mt-1 text-emerald-400 font-medium">
                📍 {property.distanceFromUserKm} km from your detected geolocation
              </p>
            )}
          </div>
        </div>

        {/* Historical Price Trend Sparkline */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> 5-Year Capital Appreciation
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              +{property.historicalTrend.growth5YrPercent}%
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs">
            <div className="bg-slate-900/60 rounded p-1.5 border border-slate-800/60">
              <p className="text-[10px] text-slate-500">2020</p>
              <p className="font-semibold text-slate-300 tabular-nums">
                ${property.historicalTrend.year2020Psf}
              </p>
            </div>
            <div className="bg-slate-900/60 rounded p-1.5 border border-slate-800/60">
              <p className="text-[10px] text-slate-500">2022</p>
              <p className="font-semibold text-slate-300 tabular-nums">
                ${property.historicalTrend.year2022Psf}
              </p>
            </div>
            <div className="bg-slate-900/60 rounded p-1.5 border border-slate-800/60">
              <p className="text-[10px] text-slate-500">2024</p>
              <p className="font-semibold text-slate-300 tabular-nums">
                ${property.historicalTrend.year2024Psf}
              </p>
            </div>
            <div className="bg-emerald-950/40 rounded p-1.5 border border-emerald-800/50">
              <p className="text-[10px] text-emerald-400">Current</p>
              <p className="font-bold text-white tabular-nums">
                ${property.historicalTrend.currentPsf}
              </p>
            </div>
          </div>
        </div>

        {/* SLA OneMap Routing Planner */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-cyan-400" /> SLA OneMap Route Engine
            </span>
            <span className="text-[10px] text-slate-500">Official Routing API</span>
          </div>

          <p className="text-xs text-slate-400">
            Calculate accurate Singapore walking or transit route from your detected location to this unit.
          </p>

          <div className="flex items-center gap-1.5">
            {(['walk', 'drive', 'cycle', 'pt'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleCalculateRoute(mode)}
                disabled={loadingRoute}
                className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                  routeType === mode && activeRoute
                    ? 'bg-cyan-950 text-cyan-200 border-cyan-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {mode === 'pt' ? 'Transit' : mode}
              </button>
            ))}
          </div>

          {loadingRoute && (
            <p className="text-xs text-cyan-400 animate-pulse">
              Querying SLA OneMap routing serverless endpoint...
            </p>
          )}

          {routeError && (
            <p className="text-xs text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-800/50">
              {routeError}
            </p>
          )}

          {activeRoute && !loadingRoute && (
            <div className="mt-2 rounded-lg bg-slate-900/90 p-2.5 border border-cyan-900/40 text-xs space-y-1">
              <div className="flex justify-between font-semibold text-cyan-300">
                <span>Est. Duration: {Math.ceil(activeRoute.route_summary.total_time / 60)} mins</span>
                <span>Distance: {(activeRoute.route_summary.total_distance / 1000).toFixed(2)} km</span>
              </div>
              {activeRoute.directions && activeRoute.directions.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {activeRoute.directions[0]}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Plan Purchase or Plan Sale */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => onOpenSoraPlanner(property, 'purchase')}
            className="w-full flex items-center justify-between rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Plan Purchase (SORA Mortgage)
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onOpenSoraPlanner(property, 'sale')}
            className="w-full flex items-center justify-between rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-4 py-2.5 font-medium text-xs border border-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-400" />
              Plan Sale (Net Cash Proceeds Estimator)
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
