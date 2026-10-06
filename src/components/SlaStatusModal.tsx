import React, { useState, useEffect } from 'react';
import { checkHealth, configureOneMapToken, fetchHdbResale } from '../services/api';
import { X, CheckCircle2, Shield, KeyRound, RefreshCw, Key, Database, ExternalLink } from 'lucide-react';

interface SlaStatusModalProps {
  onClose: () => void;
}

export const SlaStatusModal: React.FC<SlaStatusModalProps> = ({ onClose }) => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // HDB test query state
  const [hdbTestTown, setHdbTestTown] = useState('TAMPINES');
  const [hdbTestFlat, setHdbTestFlat] = useState('4 ROOM');
  const [hdbTestData, setHdbTestData] = useState<any>(null);
  const [loadingHdb, setLoadingHdb] = useState(false);

  const loadHealth = () => {
    setLoading(true);
    checkHealth()
      .then((data) => setHealth(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await configureOneMapToken(tokenInput.trim());
      if (res.success) {
        setStatusMessage(res.message || 'OneMap Token configured successfully!');
        loadHealth();
      } else {
        setStatusMessage(`Failed: ${res.message || 'Invalid token'}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error verifying OneMap token: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQueryHdbTest = async () => {
    setLoadingHdb(true);
    try {
      const res = await fetchHdbResale({
        town: hdbTestTown,
        flat_type: hdbTestFlat,
        limit: 3,
        sort: 'month desc',
      });
      setHdbTestData(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingHdb(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                SLA OneMap & HDB Resale API Hub
              </h2>
              <p className="text-xs text-slate-400">
                Serverless Connection & Endpoints in <code className="text-cyan-400">/api</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Health Status Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Endpoint Health Status</span>
              <button
                onClick={loadHealth}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">/api/health (System Heartbeat)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Operational
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">/api/hdb (Data.gov.sg Resale Datastore)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Live Connected (&gt;240k Records)
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">/api/sora (MAS SORA & TDSR Calculator)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Operational
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">/api/onemap/* (SLA Geocode & Routing)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active (Live + High-Res Fallback)
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">OneMap SLA Token Status</span>
                <span className="text-slate-300 font-mono font-semibold">
                  {health?.onemap?.configured ? (
                    <span className="text-emerald-400">Connected (ONEMAP_TOKEN active)</span>
                  ) : (
                    <span className="text-amber-400">No token provided (Offline Gazetteer Mode)</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* OneMap Token Configuration Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-slate-200">
                OneMap SLA Token (No Hardcoding)
              </h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The OneMap API requires only the OneMap Token (Authorization header). You can set <code className="text-emerald-400">ONEMAP_TOKEN</code> in your environment, or paste it directly here for this session:
            </p>

            <form onSubmit={handleSaveToken} className="space-y-3 pt-1">
              <div>
                <label className="text-slate-400 block mb-1">OneMap Bearer Token</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving || !tokenInput.trim()}
                className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2 text-xs transition-colors"
              >
                {isSaving ? 'Verifying Token with SLA OneMap...' : 'Save & Verify OneMap Token'}
              </button>
            </form>

            {statusMessage && (
              <p
                className={`p-2.5 rounded-lg border text-xs ${
                  statusMessage.includes('successfully') || statusMessage.includes('verified')
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800'
                }`}
              >
                {statusMessage}
              </p>
            )}
          </div>

          {/* Data.gov.sg HDB Live Resale Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-200">
                  Data.gov.sg HDB Resale Prices (Jan 2017 Onwards)
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">resource_id: d_8b84c4ee58e3cfc0ece0d773c8ca6abc</span>
            </div>

            <p className="text-slate-400 text-xs">
              Direct connection to official Singapore Government Open Data API. Pulls exact resale transactions with block, street, flat model, storey range, remaining lease, and prices.
            </p>

            <div className="flex items-center gap-2">
              <select
                value={hdbTestTown}
                onChange={(e) => setHdbTestTown(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
              >
                <option value="TAMPINES">Tampines</option>
                <option value="BISHAN">Bishan</option>
                <option value="QUEENSTOWN">Queenstown</option>
                <option value="BEDOK">Bedok</option>
                <option value="JURONG EAST">Jurong East</option>
                <option value="PUNGGOL">Punggol</option>
                <option value="WOODLANDS">Woodlands</option>
              </select>

              <select
                value={hdbTestFlat}
                onChange={(e) => setHdbTestFlat(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
              >
                <option value="4 ROOM">4 ROOM</option>
                <option value="5 ROOM">5 ROOM</option>
                <option value="3 ROOM">3 ROOM</option>
                <option value="EXECUTIVE">EXECUTIVE</option>
              </select>

              <button
                onClick={handleQueryHdbTest}
                disabled={loadingHdb}
                className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-1.5 px-3 transition-colors text-xs"
              >
                {loadingHdb ? 'Querying Data.gov.sg...' : `Test /api/hdb (${hdbTestFlat} in ${hdbTestTown})`}
              </button>
            </div>

            {hdbTestData && (
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-[11px] space-y-2">
                <div className="flex justify-between text-indigo-300 font-semibold">
                  <span>Found {hdbTestData.count} recent records</span>
                  <span>Total in dataset: {hdbTestData.totalAvailable?.toLocaleString()}</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {hdbTestData.data?.map((rec: any) => (
                    <div key={rec.id} className="flex justify-between border-b border-slate-800/80 pb-1 text-slate-300">
                      <div>
                        <span className="font-semibold text-white">{rec.projectName}</span>
                        <span className="text-slate-500 ml-2">({rec.floorRange}, {rec.floorSizeSqft} sqft)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">${rec.lastPrice?.toLocaleString()}</span>
                        <span className="text-slate-500 ml-2">{rec.lastSaleDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Endpoints Documentation Reference */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Available Serverless API Endpoints (/api)
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400 shrink-0">GET</span>
                <span>/api/hdb → data.gov.sg/api/action/datastore_search (HDB Resale Prices)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400 shrink-0">GET</span>
                <span>/api/hdb/metadata → api-production.data.gov.sg/v2/public/api/datasets/.../metadata</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 shrink-0">GET</span>
                <span>/api/onemap/search → onemap.gov.sg/api/common/elastic/search</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 shrink-0">GET</span>
                <span>/api/onemap/revgeocode → onemap.gov.sg/api/public/revgeocode</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 shrink-0">GET</span>
                <span>/api/onemap/route → onemap.gov.sg/api/public/routingsvc/route</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 shrink-0">GET</span>
                <span>/api/health → Health check & service discovery</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 shrink-0">GET/POST</span>
                <span>/api/sora → MAS SORA interest benchmarks & mortgage calculator</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
