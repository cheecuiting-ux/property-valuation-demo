import React, { useState } from 'react';
import { PropertyTransaction } from '../types';
import { Building2, Calendar, MapPin, ArrowUpDown, ChevronRight, ShieldCheck } from 'lucide-react';

interface PropertyListProps {
  transactions: PropertyTransaction[];
  selectedProperty: PropertyTransaction | null;
  onSelectProperty: (property: PropertyTransaction) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  transactions,
  selectedProperty,
  onSelectProperty,
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc' | 'psf' | 'distance'>('date');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const sortedList = [...transactions].sort((a, b) => {
    if (sortBy === 'price_asc') return a.lastPrice - b.lastPrice;
    if (sortBy === 'price_desc') return b.lastPrice - a.lastPrice;
    if (sortBy === 'psf') return b.psf - a.psf;
    if (sortBy === 'distance') {
      return (a.distanceFromUserKm || 999) - (b.distanceFromUserKm || 999);
    }
    // default date descending
    return new Date(b.lastSaleDate).getTime() - new Date(a.lastSaleDate).getTime();
  });

  return (
    <div className="flex h-full flex-col bg-slate-900 border-l border-slate-800 text-slate-100 overflow-hidden w-full md:w-96 lg:w-[400px]">
      {/* List Header & Sorting */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-3.5 text-xs">
        <span className="font-semibold text-slate-300">
          Transactions ({transactions.length})
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="date">Latest Date</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="psf">Highest PSF</option>
            <option value="distance">Nearest to You</option>
          </select>
        </div>
      </div>

      {/* Transaction List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 space-y-1.5">
        {sortedList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No transactions match the selected filters.
          </div>
        ) : (
          sortedList.map((tx) => {
            const isCondo = tx.propertyType.includes('Condominium') || tx.propertyType.includes('EC');
            const isSelected = selectedProperty?.id === tx.id;

            return (
              <div
                key={tx.id}
                onClick={() => onSelectProperty(tx)}
                className={`group cursor-pointer rounded-xl p-3 transition-all ${
                  isSelected
                    ? 'bg-slate-800 border border-emerald-500/50 shadow-md'
                    : 'hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span
                        className={`font-semibold ${
                          isCondo ? 'text-emerald-400' : 'text-indigo-400'
                        }`}
                      >
                        {tx.propertyType}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{tx.district}</span>
                      {tx.distanceFromUserKm !== undefined && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-emerald-400 font-medium">
                            {tx.distanceFromUserKm} km
                          </span>
                        </>
                      )}
                    </div>
                    <h4 className="mt-0.5 font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                      {tx.projectName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-white text-xs tabular-nums">
                      {formatPrice(tx.lastPrice)}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-400 tabular-nums">
                      ${tx.psf.toLocaleString()} psf
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{tx.floorSizeSqft} sqft ({tx.floorSizeSqm} sqm)</span>
                  <span className="truncate max-w-[170px] text-slate-500" title={tx.tenure}>
                    {tx.tenure.split(' from ')[0]}
                  </span>
                  <span>{tx.lastSaleDate}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
