import React, { useState, useEffect } from 'react';
import { PropertyTransaction, SoraRateData, MortgageCalculationResult } from '../types';
import { calculateMortgage, fetchSoraRates } from '../services/api';
import { X, Calculator, ShieldAlert, Sparkles, Building, Landmark, Percent } from 'lucide-react';

interface SoraPlannerModalProps {
  property: PropertyTransaction | null;
  initialMode: 'purchase' | 'sale';
  onClose: () => void;
}

export const SoraPlannerModal: React.FC<SoraPlannerModalProps> = ({
  property,
  initialMode,
  onClose,
}) => {
  const [mode, setMode] = useState<'purchase' | 'sale'>(initialMode);
  const [soraData, setSoraData] = useState<SoraRateData | null>(null);

  // Purchase state
  const [price, setPrice] = useState<number>(property?.lastPrice || 1500000);
  const [loanPercentage, setLoanPercentage] = useState<number>(75);
  const [tenureYears, setTenureYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(3.88);
  const [citizenship, setCitizenship] = useState<'citizen' | 'pr' | 'foreigner'>('citizen');
  const [propertyCount, setPropertyCount] = useState<1 | 2 | 3>(1);
  const [calcResult, setCalcResult] = useState<MortgageCalculationResult | null>(null);
  const [loadingCalc, setLoadingCalc] = useState<boolean>(false);

  // Sale state
  const [sellingPrice, setSellingPrice] = useState<number>(property?.lastPrice || 1500000);
  const [outstandingLoan, setOutstandingLoan] = useState<number>(Math.round((property?.lastPrice || 1500000) * 0.45));
  const [cpfRefund, setCpfRefund] = useState<number>(Math.round((property?.lastPrice || 1500000) * 0.25));
  const [agentCommissionRate, setAgentCommissionRate] = useState<number>(2); // 2%
  const [legalFee, setLegalFee] = useState<number>(2500);

  // Load SORA benchmarks on mount
  useEffect(() => {
    fetchSoraRates()
      .then((data) => {
        setSoraData(data);
        if (data.effectiveMortgageRate) {
          setInterestRate(data.effectiveMortgageRate);
        }
      })
      .catch((err) => console.error('Failed to load SORA benchmarks:', err));
  }, []);

  // Recalculate purchase mortgage
  useEffect(() => {
    if (mode !== 'purchase') return;

    setLoadingCalc(true);
    const isHdb = property?.propertyType.includes('HDB') || false;

    calculateMortgage({
      propertyPrice: price,
      loanPercentage,
      loanTenureYears: tenureYears,
      interestRate,
      propertyType: isHdb ? 'hdb' : 'condo',
      buyerCitizenship: citizenship,
      propertyCount,
    })
      .then((res) => setCalcResult(res))
      .catch((err) => console.error(err))
      .finally(() => setLoadingCalc(false));
  }, [price, loanPercentage, tenureYears, interestRate, citizenship, propertyCount, mode, property]);

  const formatSgd = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Sale proceeds calculation
  const agentCommissionAmount = Math.round(sellingPrice * (agentCommissionRate / 100));
  const netSaleProceeds = Math.max(
    0,
    sellingPrice - outstandingLoan - cpfRefund - agentCommissionAmount - legalFee
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Singapore Property Financial Planner
              </h2>
              <p className="text-xs text-slate-400">
                SORA Benchmark Mortgages, IRAS Stamp Duties (BSD/ABSD) & Net Proceeds
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

        {/* Mode Switcher */}
        <div className="px-6 pt-4">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMode('purchase')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'purchase'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Buyer Affordability & SORA Mortgage
            </button>
            <button
              onClick={() => setMode('sale')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'sale'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Seller Net Proceeds Estimator
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {mode === 'purchase' ? (
            <>
              {/* SORA Rate Benchmark Banner */}
              <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Landmark className="h-4 w-4" /> MAS 3-Month Compounded SORA Benchmark
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {soraData?.sora3M || 3.18}% p.a.
                  </span>
                </div>
                <p className="text-slate-400 mt-1">
                  Floating residential home loans in Singapore are pegged to SORA + bank spread (~0.70%), currently{' '}
                  <span className="text-white font-medium">{interestRate}%</span> effective interest rate.
                </p>
              </div>

              {/* Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Target Purchase Price (SGD)</label>
                  <input
                    type="number"
                    step={10000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Loan Quantum (LTV %)</label>
                  <select
                    value={loanPercentage}
                    onChange={(e) => setLoanPercentage(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={75}>75% (Standard MAS Bank Max Loan)</option>
                    <option value={80}>80% (HDB Concessionary Loan)</option>
                    <option value={70}>70%</option>
                    <option value={60}>60%</option>
                    <option value={50}>50%</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Loan Tenure (Years)</label>
                  <select
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={30}>30 Years (Max for Private)</option>
                    <option value={25}>25 Years (Max for HDB)</option>
                    <option value={20}>20 Years</option>
                    <option value={15}>15 Years</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Mortgage Rate (% p.a.)</label>
                  <input
                    type="number"
                    step={0.05}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Buyer Citizenship</label>
                  <select
                    value={citizenship}
                    onChange={(e) => setCitizenship(e.target.value as any)}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="citizen">Singapore Citizen (SC)</option>
                    <option value="pr">Singapore Permanent Resident (SPR)</option>
                    <option value="foreigner">Foreigner (FR)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Property Count Owned</label>
                  <select
                    value={propertyCount}
                    onChange={(e) => setPropertyCount(Number(e.target.value) as any)}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={1}>1st Residential Property</option>
                    <option value={2}>2nd Residential Property</option>
                    <option value={3}>3rd or Subsequent Property</option>
                  </select>
                </div>
              </div>

              {/* Calculation Output Cards */}
              {calcResult && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <span className="text-slate-400 text-xs font-medium">Monthly Installment</span>
                      <p className="mt-1 text-2xl font-black text-white tabular-nums tracking-tight">
                        {formatSgd(calcResult.monthlyRepayment)}
                        <span className="text-xs text-slate-400 font-normal"> / mo</span>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        At {interestRate}% SORA pegged floating rate
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <span className="text-slate-400 text-xs font-medium">
                        Min. Household Income Required
                      </span>
                      <p className="mt-1 text-2xl font-black text-emerald-400 tabular-nums tracking-tight">
                        {formatSgd(calcResult.minGrossMonthlyIncomeTDSR)}
                        <span className="text-xs text-slate-400 font-normal"> / mo</span>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        MAS TDSR Cap (55% debt ceiling @ 4.0% stress floor)
                      </p>
                    </div>
                  </div>

                  {/* Stamp Duties & Downpayment Breakdown */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-xs space-y-2.5">
                    <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                      Required Initial Capital Breakdown
                    </h4>

                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Total Downpayment ({100 - loanPercentage}%)</span>
                      <span className="font-semibold text-white">{formatSgd(calcResult.downpaymentTotal)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 pl-3">↳ Minimum Cash Component (5%)</span>
                      <span className="text-amber-400 font-medium">{formatSgd(calcResult.downpaymentCashMin)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 pl-3">↳ CPF OA or Cash Component (20%)</span>
                      <span className="text-slate-300 font-medium">{formatSgd(calcResult.downpaymentCpfOrCash)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Buyer&apos;s Stamp Duty (IRAS BSD)</span>
                      <span className="font-semibold text-white">{formatSgd(calcResult.bsd)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">
                        Additional Buyer&apos;s Stamp Duty (ABSD)
                      </span>
                      <span className={`font-semibold ${calcResult.absd > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {formatSgd(calcResult.absd)}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 text-sm font-bold border-t border-slate-700">
                      <span className="text-emerald-400">Total Upfront Cash + CPF Needed</span>
                      <span className="text-emerald-400 tabular-nums">
                        {formatSgd(calcResult.totalInitialCashCpfNeeded)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Sale Proceeds Planning */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-medium">Selling Price (SGD)</label>
                  <input
                    type="number"
                    step={10000}
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Outstanding Bank Mortgage Loan</label>
                  <input
                    type="number"
                    step={5000}
                    value={outstandingLoan}
                    onChange={(e) => setOutstandingLoan(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium">CPF Principal + Accrued Interest to Refund</label>
                  <input
                    type="number"
                    step={5000}
                    value={cpfRefund}
                    onChange={(e) => setCpfRefund(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Property Agent Commission (% + GST)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={agentCommissionRate}
                    onChange={(e) => setAgentCommissionRate(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-semibold tabular-nums focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Net Proceeds Result */}
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-5 mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Estimated Net Cash Proceeds in Hand
                </span>
                <p className="mt-1 text-3xl font-black text-white tabular-nums tracking-tight">
                  {formatSgd(netSaleProceeds)}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-emerald-900/40 pt-3 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Gross Selling Price</span>
                    <span className="text-white">{formatSgd(sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Less: Bank Loan Settlement</span>
                    <span>- {formatSgd(outstandingLoan)}</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Less: CPF OA Refund + Accrued Interest</span>
                    <span>- {formatSgd(cpfRefund)}</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Less: Estate Agent Commission ({agentCommissionRate}%)</span>
                    <span>- {formatSgd(agentCommissionAmount)}</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Less: Legal Conveyancing Fees</span>
                    <span>- {formatSgd(legalFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
