import {
  PropertyTransaction,
  MarketAnalytics,
  SoraRateData,
  MortgageCalculationResult,
  RouteResult,
} from '../types';

export interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  minSizeSqft?: number;
  maxSizeSqft?: number;
  minPsf?: number;
  maxPsf?: number;
  propertyTypes?: string[];
  marketSegments?: string[];
  tenureType?: 'all' | 'freehold' | 'leasehold99';
  planningArea?: string;
  search?: string;
  nearLat?: number;
  nearLng?: number;
  radiusKm?: number;
}

export async function fetchTransactions(filters: FilterParams): Promise<{
  data: PropertyTransaction[];
  analytics: MarketAnalytics;
  totalRecords: number;
}> {
  const params = new URLSearchParams();
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.minSizeSqft !== undefined) params.append('minSizeSqft', filters.minSizeSqft.toString());
  if (filters.maxSizeSqft !== undefined) params.append('maxSizeSqft', filters.maxSizeSqft.toString());
  if (filters.minPsf !== undefined) params.append('minPsf', filters.minPsf.toString());
  if (filters.maxPsf !== undefined) params.append('maxPsf', filters.maxPsf.toString());
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    params.append('propertyTypes', filters.propertyTypes.join(','));
  }
  if (filters.marketSegments && filters.marketSegments.length > 0) {
    params.append('marketSegments', filters.marketSegments.join(','));
  }
  if (filters.tenureType && filters.tenureType !== 'all') {
    params.append('tenureType', filters.tenureType);
  }
  if (filters.planningArea) params.append('planningArea', filters.planningArea);
  if (filters.search) params.append('search', filters.search);
  if (filters.nearLat !== undefined && filters.nearLng !== undefined) {
    params.append('nearLat', filters.nearLat.toString());
    params.append('nearLng', filters.nearLng.toString());
    if (filters.radiusKm !== undefined) params.append('radiusKm', filters.radiusKm.toString());
  }

  const res = await fetch(`/api/transactions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions (${res.status})`);
  }
  return res.json();
}

export async function fetchSoraRates(): Promise<SoraRateData> {
  const res = await fetch('/api/sora');
  if (!res.ok) {
    throw new Error('Failed to fetch SORA data');
  }
  const json = await res.json();
  return json.data;
}

export async function calculateMortgage(payload: {
  propertyPrice: number;
  loanPercentage?: number;
  loanTenureYears?: number;
  interestRate?: number;
  propertyType?: 'condo' | 'hdb';
  buyerCitizenship?: 'citizen' | 'pr' | 'foreigner';
  propertyCount?: 1 | 2 | 3;
}): Promise<MortgageCalculationResult> {
  const res = await fetch('/api/sora', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to calculate mortgage');
  }
  const json = await res.json();
  return json.calculation;
}

export async function searchOneMap(searchVal: string, pageNum = 1) {
  const res = await fetch(
    `/api/onemap/search?searchVal=${encodeURIComponent(searchVal)}&pageNum=${pageNum}`
  );
  if (!res.ok) {
    throw new Error('OneMap search error');
  }
  return res.json();
}

export async function reverseGeocodeOneMap(lat: number, lng: number, buffer = 100) {
  const res = await fetch(
    `/api/onemap/revgeocode?location=${lat},${lng}&buffer=${buffer}&addressType=All`
  );
  if (!res.ok) {
    throw new Error('OneMap reverse geocode error');
  }
  return res.json();
}

export async function fetchRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  routeType: 'walk' | 'drive' | 'cycle' | 'pt' = 'walk'
): Promise<RouteResult> {
  const res = await fetch(
    `/api/onemap/route?start=${startLat},${startLng}&end=${endLat},${endLng}&routeType=${routeType}`
  );
  if (!res.ok) {
    throw new Error('OneMap routing error');
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error('Health check error');
  }
  return res.json();
}

export async function configureOneMapToken(token: string) {
  const res = await fetch('/api/onemap/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export const mintOneMapToken = configureOneMapToken;

export async function fetchHdbResale(params?: {
  town?: string;
  flat_type?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const query = new URLSearchParams();
  if (params?.town) query.set('town', params.town);
  if (params?.flat_type) query.set('flat_type', params.flat_type);
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.offset) query.set('offset', params.offset.toString());
  if (params?.sort) query.set('sort', params.sort);
  if (params?.minPrice) query.set('minPrice', params.minPrice.toString());
  if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());

  const res = await fetch(`/api/hdb?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch HDB resale transactions');
  }
  return res.json();
}

export async function fetchHdbMetadata() {
  const res = await fetch('/api/hdb/metadata');
  if (!res.ok) {
    throw new Error('Failed to fetch HDB dataset metadata');
  }
  return res.json();
}

