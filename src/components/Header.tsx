import React from 'react';
import { MarketAnalytics } from '../types';
import { Building2, Layers, TrendingUp, ShieldCheck, Map, Percent } from 'lucide-react';

interface HeaderProps {
  analytics: MarketAnalytics | null;
  mapBasemap?: 'onemap_light' | 'dark' | 'streets';
  onBasemapChange?: (bm: 'onemap_light' | 'dark' | 'streets') => void;
  onOpenSlaModal: () => void;
  onOpenSoraModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  analytics,
  onOpenSlaModal,
  onOpenSoraModal,
}) => {
  const formatSgd = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${Math.round(val / 1000)}k`;
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-100">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-950 text-white font-black text-sm">
          SG
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              SG GeoProp
              <span className="text-[11px] font-normal text-slate-400">| SG Property GIS</span>
            </h1>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400">
              SLA OneMap + SORA
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Singapore Condominiums & HDB Last Sale Transactions Detector
          </p>
        </div>
      </div>

      {/* Market Pulse Indicators */}
      {analytics && (
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
            <span className="text-slate-400">Avg Last Done:</span>
            <span className="font-bold text-white tabular-nums">
              {formatSgd(analytics.averagePrice)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
            <span className="text-slate-400">Avg PSF:</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              ${analytics.averagePsf.toLocaleString()} psf
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
            <span className="text-slate-400">Median PSF:</span>
            <span className="font-semibold text-slate-200 tabular-nums">
              ${analytics.medianPsf.toLocaleString()} psf
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">{analytics.condoCount} Condos</span>
            <span className="text-slate-600">/</span>
            <span className="text-indigo-400 font-medium">{analytics.hdbCount} HDBs</span>
          </div>
        </div>
      )}

      {/* Right Controls: SORA, SLA API Status, OneMap Basemap */}
      <div className="flex items-center gap-2">
        {/* SORA Rate Shortcut */}
        <button
          onClick={onOpenSoraModal}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-800/60 bg-cyan-950/40 hover:bg-cyan-900/40 px-3 py-1.5 text-xs text-cyan-300 font-medium transition-colors"
          title="Singapore Overnight Rate Average (SORA) mortgage benchmarks"
        >
          <Percent className="h-3.5 w-3.5 text-cyan-400" />
          <span>SORA 3.18%</span>
        </button>

        {/* SLA Connection Button */}
        <button
          onClick={onOpenSlaModal}
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 text-xs text-slate-300 font-medium transition-colors"
          title="SLA OneMap API Connection & Serverless Endpoints"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>SLA Endpoints</span>
        </button>

        {/* SLA OneMap Basemap Indicator */}
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-2.5 py-1.5 text-xs text-emerald-300 font-medium">
          <Map className="h-3.5 w-3.5 text-emerald-400" />
          <span>OneMap</span>
        </div>
      </div>
    </header>
  );
};
