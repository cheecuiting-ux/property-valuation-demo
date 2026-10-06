export interface PropertyTransaction {
  id: string;
  projectName: string;
  propertyType: 'Condominium' | 'Executive Condominium' | 'HDB 3-Room' | 'HDB 4-Room' | 'HDB 5-Room' | 'HDB Executive';
  marketSegment: 'CCR' | 'RCR' | 'OCR';
  district: string;
  planningArea: string;
  street: string;
  postalCode: string;
  lat: number;
  lng: number;
  lastPrice: number;
  lastSaleDate: string;
  tenure: string;
  remainingLease: string;
  floorSizeSqft: number;
  floorSizeSqm: number;
  psf: number;
  floorRange: string;
  yearBuilt: number;
  unitsInDev?: number;
  mrtProximity: string;
  distanceFromUserKm?: number;
  historicalTrend: {
    year2020Psf: number;
    year2022Psf: number;
    year2024Psf: number;
    currentPsf: number;
    growth5YrPercent: number;
  };
}

export interface MarketAnalytics {
  averagePrice: number;
  averagePsf: number;
  medianPsf: number;
  minPrice: number;
  maxPrice: number;
  condoCount: number;
  hdbCount: number;
}

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

export interface MortgageCalculationResult {
  propertyPrice: number;
  loanAmount: number;
  downpaymentTotal: number;
  downpaymentCashMin: number;
  downpaymentCpfOrCash: number;
  monthlyRepayment: number;
  stressMonthlyRepayment: number;
  minGrossMonthlyIncomeTDSR: number;
  minGrossMonthlyIncomeMSR?: number;
  bsd: number;
  absd: number;
  totalInitialCashCpfNeeded: number;
  effectiveRate: number;
  loanTenureYears: number;
}

export interface DetectedLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  address?: string;
  buildingName?: string;
  postalCode?: string;
  source: 'browser_gps' | 'simulated' | 'onemap_search';
}

export interface RouteResult {
  source: string;
  route_summary: {
    total_time: number; // in seconds
    total_distance: number; // in meters
    start_point: string;
    end_point: string;
    mode: 'walk' | 'drive' | 'cycle' | 'pt';
  };
  route_geometry: Array<[number, number]>;
  directions?: string[];
}
