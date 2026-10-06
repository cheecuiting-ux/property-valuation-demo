import { Request, Response } from 'express';

export interface SoraRateData {
  asOfDate: string;
  sora1M: number;
  sora3M: number;
  sora6M: number;
  benchmarkSpread: number;
  effectiveMortgageRate: number;
  stressTestRate: number;
  hdbConcessionaryRate: number;
  historicalTrend: Array<{
    period: string;
    sora3M: number;
    effectiveRate: number;
  }>;
}

export interface MortgageCalculationInput {
  propertyPrice: number;
  loanPercentage?: number; // default 75%
  loanTenureYears?: number; // default 25
  interestRate?: number; // default SORA 3M + 0.70%
  propertyType?: 'condo' | 'hdb';
  buyerCitizenship?: 'citizen' | 'pr' | 'foreigner' | 'entity';
  propertyCount?: 1 | 2 | 3; // for ABSD
}

export interface MortgageCalculationResult {
  propertyPrice: number;
  loanAmount: number;
  downpaymentTotal: number;
  downpaymentCashMin: number;
  downpaymentCpfOrCash: number;
  monthlyRepayment: number;
  stressMonthlyRepayment: number;
  minGrossMonthlyIncomeTDSR: number; // 55% TDSR
  minGrossMonthlyIncomeMSR?: number; // 30% MSR if HDB
  bsd: number;
  absd: number;
  totalInitialCashCpfNeeded: number;
  effectiveRate: number;
  loanTenureYears: number;
}

// Recent benchmark rates in Singapore (published daily by MAS)
export const CURRENT_SORA_DATA: SoraRateData = {
  asOfDate: '2025-02-15',
  sora1M: 3.12,
  sora3M: 3.18,
  sora6M: 3.24,
  benchmarkSpread: 0.70, // Bank spread typically 0.65% - 0.75%
  effectiveMortgageRate: 3.88, // 3.18% + 0.70%
  stressTestRate: 4.00, // MAS regulatory stress test floor
  hdbConcessionaryRate: 2.60, // HDB loan pegged at CPF OA rate + 0.1%
  historicalTrend: [
    { period: '2023 Q1', sora3M: 3.45, effectiveRate: 4.15 },
    { period: '2023 Q3', sora3M: 3.65, effectiveRate: 4.35 },
    { period: '2024 Q1', sora3M: 3.52, effectiveRate: 4.22 },
    { period: '2024 Q3', sora3M: 3.34, effectiveRate: 4.04 },
    { period: '2024 Q4', sora3M: 3.22, effectiveRate: 3.92 },
    { period: '2025 Q1', sora3M: 3.18, effectiveRate: 3.88 },
  ],
};

// Calculate Singapore Buyer's Stamp Duty (BSD) under current IRAS schedule
export function calculateBSD(price: number): number {
  let bsd = 0;
  // First $180,000 @ 1%
  if (price > 0) {
    const tier1 = Math.min(price, 180000);
    bsd += tier1 * 0.01;
  }
  // Next $180,000 @ 2% ($180k - $360k)
  if (price > 180000) {
    const tier2 = Math.min(price - 180000, 180000);
    bsd += tier2 * 0.02;
  }
  // Next $640,000 @ 3% ($360k - $1M)
  if (price > 360000) {
    const tier3 = Math.min(price - 360000, 640000);
    bsd += tier3 * 0.03;
  }
  // Next $500,000 @ 4% ($1M - $1.5M)
  if (price > 1000000) {
    const tier4 = Math.min(price - 1000000, 500000);
    bsd += tier4 * 0.04;
  }
  // Next $1.5M @ 5% ($1.5M - $3M)
  if (price > 1500000) {
    const tier5 = Math.min(price - 1500000, 1500000);
    bsd += tier5 * 0.05;
  }
  // In excess of $3M @ 6%
  if (price > 3000000) {
    const tier6 = price - 3000000;
    bsd += tier6 * 0.06;
  }
  return Math.round(bsd);
}

// Calculate Singapore Additional Buyer's Stamp Duty (ABSD)
export function calculateABSD(
  price: number,
  citizenship: 'citizen' | 'pr' | 'foreigner' | 'entity' = 'citizen',
  propertyCount: 1 | 2 | 3 = 1
): number {
  let rate = 0;
  if (citizenship === 'citizen') {
    if (propertyCount === 1) rate = 0;
    else if (propertyCount === 2) rate = 0.20;
    else rate = 0.30;
  } else if (citizenship === 'pr') {
    if (propertyCount === 1) rate = 0.05;
    else if (propertyCount === 2) rate = 0.30;
    else rate = 0.35;
  } else if (citizenship === 'foreigner') {
    rate = 0.60;
  } else {
    rate = 0.65;
  }
  return Math.round(price * rate);
}

export function calculateMonthlyRepayment(
  principal: number,
  annualRatePercent: number,
  tenureYears: number
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = tenureYears * 12;
  if (monthlyRate === 0) return principal / totalMonths;
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(monthlyPayment);
}

export function handleSora(req: Request, res: Response) {
  if (req.method === 'POST') {
    const {
      propertyPrice = 1200000,
      loanPercentage = 75,
      loanTenureYears = 25,
      interestRate = CURRENT_SORA_DATA.effectiveMortgageRate,
      propertyType = 'condo',
      buyerCitizenship = 'citizen',
      propertyCount = 1,
    } = req.body;

    const loanAmount = Math.round(propertyPrice * (loanPercentage / 100));
    const downpaymentTotal = propertyPrice - loanAmount;
    // For bank loan in SG: min 5% cash, remainder 20% can be CPF OA or Cash
    const downpaymentCashMin = Math.round(propertyPrice * 0.05);
    const downpaymentCpfOrCash = Math.max(0, downpaymentTotal - downpaymentCashMin);

    const monthlyRepayment = calculateMonthlyRepayment(
      loanAmount,
      interestRate,
      loanTenureYears
    );
    // Stress test repayment at 4.0%
    const stressMonthlyRepayment = calculateMonthlyRepayment(
      loanAmount,
      Math.max(CURRENT_SORA_DATA.stressTestRate, interestRate),
      loanTenureYears
    );

    // TDSR cap is 55% of gross monthly income
    const minGrossMonthlyIncomeTDSR = Math.round(stressMonthlyRepayment / 0.55);

    // MSR cap is 30% for HDB/EC
    let minGrossMonthlyIncomeMSR: number | undefined;
    if (propertyType === 'hdb') {
      minGrossMonthlyIncomeMSR = Math.round(stressMonthlyRepayment / 0.30);
    }

    const bsd = calculateBSD(propertyPrice);
    const absd = calculateABSD(propertyPrice, buyerCitizenship, propertyCount);
    const totalInitialCashCpfNeeded = downpaymentTotal + bsd + absd;

    const calculationResult: MortgageCalculationResult = {
      propertyPrice,
      loanAmount,
      downpaymentTotal,
      downpaymentCashMin,
      downpaymentCpfOrCash,
      monthlyRepayment,
      stressMonthlyRepayment,
      minGrossMonthlyIncomeTDSR,
      minGrossMonthlyIncomeMSR,
      bsd,
      absd,
      totalInitialCashCpfNeeded,
      effectiveRate: interestRate,
      loanTenureYears,
    };

    return res.json({
      success: true,
      soraBenchmark: CURRENT_SORA_DATA,
      calculation: calculationResult,
    });
  }

  // GET request returns standard SORA benchmark rates & mortgage guides
  res.json({
    success: true,
    data: CURRENT_SORA_DATA,
    description:
      'Singapore Overnight Rate Average (SORA) benchmark and residential mortgage interest indices administered by MAS.',
  });
}
