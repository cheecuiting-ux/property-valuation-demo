import { Request, Response } from 'express';

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
  historicalTrend: {
    year2020Psf: number;
    year2022Psf: number;
    year2024Psf: number;
    currentPsf: number;
    growth5YrPercent: number;
  };
}

export const SINGAPORE_TRANSACTIONS: PropertyTransaction[] = [
  // CCR - Core Central Region
  {
    id: 'tx-ccr-001',
    projectName: 'The Sail @ Marina Bay',
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D01',
    planningArea: 'Downtown Core',
    street: '2 Marina Boulevard',
    postalCode: '018987',
    lat: 1.2818,
    lng: 103.8536,
    lastPrice: 2180000,
    lastSaleDate: '2025-01-18',
    tenure: '99-year leasehold from 2002',
    remainingLease: '76 years 8 months',
    floorSizeSqft: 936,
    floorSizeSqm: 87,
    psf: 2329,
    floorRange: '31 to 35',
    yearBuilt: 2008,
    unitsInDev: 1111,
    mrtProximity: '180m to Downtown MRT (DT17)',
    historicalTrend: { year2020Psf: 1980, year2022Psf: 2150, year2024Psf: 2280, currentPsf: 2329, growth5YrPercent: 17.6 },
  },
  {
    id: 'tx-ccr-002',
    projectName: 'Marina One Residences',
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D01',
    planningArea: 'Downtown Core',
    street: '21 Marina Way',
    postalCode: '018978',
    lat: 1.2783,
    lng: 103.8532,
    lastPrice: 2850000,
    lastSaleDate: '2025-01-22',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 7 months',
    floorSizeSqft: 1119,
    floorSizeSqm: 104,
    psf: 2547,
    floorRange: '26 to 30',
    yearBuilt: 2017,
    unitsInDev: 1042,
    mrtProximity: 'Direct underground link to Marina Bay MRT (NS27/TE20/CE2)',
    historicalTrend: { year2020Psf: 2280, year2022Psf: 2420, year2024Psf: 2510, currentPsf: 2547, growth5YrPercent: 11.7 },
  },
  {
    id: 'tx-ccr-003',
    projectName: 'Wallich Residence',
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D02',
    planningArea: 'Tanjong Pagar',
    street: '3 Wallich Street',
    postalCode: '078882',
    lat: 1.2770,
    lng: 103.8459,
    lastPrice: 4200000,
    lastSaleDate: '2024-12-05',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 7 months',
    floorSizeSqft: 1313,
    floorSizeSqm: 122,
    psf: 3198,
    floorRange: '46 to 50',
    yearBuilt: 2017,
    unitsInDev: 181,
    mrtProximity: 'Integrated atop Tanjong Pagar MRT (EW15)',
    historicalTrend: { year2020Psf: 2950, year2022Psf: 3080, year2024Psf: 3160, currentPsf: 3198, growth5YrPercent: 8.4 },
  },
  {
    id: 'tx-ccr-004',
    projectName: 'Nouvel 18',
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D10',
    planningArea: 'Tanglin / Orchard',
    street: '18 Anderson Road',
    postalCode: '259977',
    lat: 1.3117,
    lng: 103.8291,
    lastPrice: 4950000,
    lastSaleDate: '2024-11-19',
    tenure: 'Freehold',
    remainingLease: 'Freehold',
    floorSizeSqft: 1539,
    floorSizeSqm: 143,
    psf: 3216,
    floorRange: '16 to 20',
    yearBuilt: 2014,
    unitsInDev: 156,
    mrtProximity: '650m to Orchard MRT (NS22/TE14)',
    historicalTrend: { year2020Psf: 2850, year2022Psf: 3020, year2024Psf: 3180, currentPsf: 3216, growth5YrPercent: 12.8 },
  },
  {
    id: 'tx-ccr-005',
    projectName: 'Boulevard 88',
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D10',
    planningArea: 'Orchard',
    street: '88 Orchard Boulevard',
    postalCode: '248655',
    lat: 1.3038,
    lng: 103.8262,
    lastPrice: 7100000,
    lastSaleDate: '2024-12-14',
    tenure: 'Freehold',
    remainingLease: 'Freehold',
    floorSizeSqft: 1776,
    floorSizeSqm: 165,
    psf: 3998,
    floorRange: '21 to 25',
    yearBuilt: 2023,
    unitsInDev: 154,
    mrtProximity: '220m to Orchard Boulevard MRT (TE13)',
    historicalTrend: { year2020Psf: 3620, year2022Psf: 3820, year2024Psf: 3940, currentPsf: 3998, growth5YrPercent: 10.4 },
  },
  {
    id: 'tx-ccr-006',
    projectName: "D'Leedon",
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D10',
    planningArea: 'Bukit Timah',
    street: '7 Leedon Heights',
    postalCode: '267953',
    lat: 1.3142,
    lng: 103.8052,
    lastPrice: 2450000,
    lastSaleDate: '2025-01-08',
    tenure: '99-year leasehold from 2010',
    remainingLease: '84 years 5 months',
    floorSizeSqft: 1216,
    floorSizeSqm: 113,
    psf: 2015,
    floorRange: '16 to 20',
    yearBuilt: 2014,
    unitsInDev: 1715,
    mrtProximity: '480m to Farrer Road MRT (CC20)',
    historicalTrend: { year2020Psf: 1680, year2022Psf: 1850, year2024Psf: 1980, currentPsf: 2015, growth5YrPercent: 19.9 },
  },
  {
    id: 'tx-ccr-007',
    projectName: 'Irwell Hill Residences',
    propertyType: 'Condominium',
    marketSegment: 'CCR',
    district: 'D09',
    planningArea: 'River Valley',
    street: '2 Irwell Hill',
    postalCode: '238640',
    lat: 1.2974,
    lng: 103.8327,
    lastPrice: 1980000,
    lastSaleDate: '2025-01-30',
    tenure: '99-year leasehold from 2020',
    remainingLease: '94 years 6 months',
    floorSizeSqft: 667,
    floorSizeSqm: 62,
    psf: 2968,
    floorRange: '26 to 30',
    yearBuilt: 2026,
    unitsInDev: 540,
    mrtProximity: '290m to Great World MRT (TE15)',
    historicalTrend: { year2020Psf: 2600, year2022Psf: 2750, year2024Psf: 2920, currentPsf: 2968, growth5YrPercent: 14.1 },
  },

  // RCR - Rest of Central Region (Condos & Iconic HDBs)
  {
    id: 'tx-rcr-001',
    projectName: 'Pinnacle @ Duxton (1D Cantonment Rd)',
    propertyType: 'HDB 5-Room',
    marketSegment: 'RCR',
    district: 'D02',
    planningArea: 'Bukit Merah / Tanjong Pagar',
    street: '1D Cantonment Road',
    postalCode: '085401',
    lat: 1.2787,
    lng: 103.8415,
    lastPrice: 1518000,
    lastSaleDate: '2025-01-15',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 4 months',
    floorSizeSqft: 1141,
    floorSizeSqm: 106,
    psf: 1330,
    floorRange: '43 to 45',
    yearBuilt: 2011,
    unitsInDev: 1848,
    mrtProximity: '380m to Outram Park MRT (EW16/NE3/TE17)',
    historicalTrend: { year2020Psf: 1020, year2022Psf: 1180, year2024Psf: 1290, currentPsf: 1330, growth5YrPercent: 30.4 },
  },
  {
    id: 'tx-rcr-002',
    projectName: 'Pinnacle @ Duxton (1A Cantonment Rd)',
    propertyType: 'HDB 4-Room',
    marketSegment: 'RCR',
    district: 'D02',
    planningArea: 'Bukit Merah / Tanjong Pagar',
    street: '1A Cantonment Road',
    postalCode: '085101',
    lat: 1.2781,
    lng: 103.8407,
    lastPrice: 1238000,
    lastSaleDate: '2025-01-28',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 4 months',
    floorSizeSqft: 1001,
    floorSizeSqm: 93,
    psf: 1237,
    floorRange: '34 to 36',
    yearBuilt: 2011,
    unitsInDev: 1848,
    mrtProximity: '400m to Outram Park MRT',
    historicalTrend: { year2020Psf: 960, year2022Psf: 1110, year2024Psf: 1205, currentPsf: 1237, growth5YrPercent: 28.8 },
  },
  {
    id: 'tx-rcr-003',
    projectName: 'SkyTerrace @ Dawson (89 Dawson Rd)',
    propertyType: 'HDB 5-Room',
    marketSegment: 'RCR',
    district: 'D03',
    planningArea: 'Queenstown',
    street: '89 Dawson Road',
    postalCode: '142089',
    lat: 1.2961,
    lng: 103.8115,
    lastPrice: 1480000,
    lastSaleDate: '2024-12-28',
    tenure: '99-year leasehold from 2015',
    remainingLease: '89 years 6 months',
    floorSizeSqft: 1237,
    floorSizeSqm: 115,
    psf: 1196,
    floorRange: '37 to 39',
    yearBuilt: 2015,
    unitsInDev: 758,
    mrtProximity: '520m to Queenstown MRT (EW19)',
    historicalTrend: { year2020Psf: 890, year2022Psf: 1050, year2024Psf: 1170, currentPsf: 1196, growth5YrPercent: 34.4 },
  },
  {
    id: 'tx-rcr-004',
    projectName: 'SkyVille @ Dawson (86 Dawson Rd)',
    propertyType: 'HDB 4-Room',
    marketSegment: 'RCR',
    district: 'D03',
    planningArea: 'Queenstown',
    street: '86 Dawson Road',
    postalCode: '141086',
    lat: 1.2952,
    lng: 103.8098,
    lastPrice: 1120000,
    lastSaleDate: '2025-01-09',
    tenure: '99-year leasehold from 2015',
    remainingLease: '89 years 6 months',
    floorSizeSqft: 915,
    floorSizeSqm: 85,
    psf: 1224,
    floorRange: '40 to 42',
    yearBuilt: 2015,
    unitsInDev: 960,
    mrtProximity: '460m to Queenstown MRT',
    historicalTrend: { year2020Psf: 920, year2022Psf: 1080, year2024Psf: 1190, currentPsf: 1224, growth5YrPercent: 33.0 },
  },
  {
    id: 'tx-rcr-005',
    projectName: 'Principal Garden',
    propertyType: 'Condominium',
    marketSegment: 'RCR',
    district: 'D03',
    planningArea: 'Bukit Merah / Alexandra',
    street: '97 Prince Charles Crescent',
    postalCode: '159023',
    lat: 1.2925,
    lng: 103.8202,
    lastPrice: 1890000,
    lastSaleDate: '2025-01-14',
    tenure: '99-year leasehold from 2014',
    remainingLease: '88 years 2 months',
    floorSizeSqft: 797,
    floorSizeSqm: 74,
    psf: 2371,
    floorRange: '16 to 20',
    yearBuilt: 2018,
    unitsInDev: 663,
    mrtProximity: '680m to Redhill MRT (EW18)',
    historicalTrend: { year2020Psf: 1950, year2022Psf: 2180, year2024Psf: 2320, currentPsf: 2371, growth5YrPercent: 21.6 },
  },
  {
    id: 'tx-rcr-006',
    projectName: 'Stirling Residences',
    propertyType: 'Condominium',
    marketSegment: 'RCR',
    district: 'D03',
    planningArea: 'Queenstown',
    street: '21 Stirling Road',
    postalCode: '148960',
    lat: 1.2949,
    lng: 103.8041,
    lastPrice: 1920000,
    lastSaleDate: '2025-01-20',
    tenure: '99-year leasehold from 2017',
    remainingLease: '91 years 8 months',
    floorSizeSqft: 883,
    floorSizeSqm: 82,
    psf: 2174,
    floorRange: '26 to 30',
    yearBuilt: 2022,
    unitsInDev: 1259,
    mrtProximity: '280m to Queenstown MRT (EW19)',
    historicalTrend: { year2020Psf: 1820, year2022Psf: 2040, year2024Psf: 2140, currentPsf: 2174, growth5YrPercent: 19.5 },
  },
  {
    id: 'tx-rcr-007',
    projectName: 'Natura Loft DBSS (273A Bishan St 24)',
    propertyType: 'HDB 5-Room',
    marketSegment: 'RCR',
    district: 'D20',
    planningArea: 'Bishan',
    street: '273A Bishan Street 24',
    postalCode: '571273',
    lat: 1.3579,
    lng: 103.8519,
    lastPrice: 1530000,
    lastSaleDate: '2024-11-30',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 7 months',
    floorSizeSqft: 1291,
    floorSizeSqm: 120,
    psf: 1185,
    floorRange: '34 to 36',
    yearBuilt: 2011,
    unitsInDev: 480,
    mrtProximity: '820m to Bishan MRT (NS17/CC15)',
    historicalTrend: { year2020Psf: 880, year2022Psf: 1030, year2024Psf: 1150, currentPsf: 1185, growth5YrPercent: 34.6 },
  },
  {
    id: 'tx-rcr-008',
    projectName: 'Bishan St 12 Blk 115',
    propertyType: 'HDB 4-Room',
    marketSegment: 'RCR',
    district: 'D20',
    planningArea: 'Bishan',
    street: '115 Bishan Street 12',
    postalCode: '570115',
    lat: 1.3475,
    lng: 103.8492,
    lastPrice: 875000,
    lastSaleDate: '2025-01-11',
    tenure: '99-year leasehold from 1987',
    remainingLease: '61 years 4 months',
    floorSizeSqft: 980,
    floorSizeSqm: 91,
    psf: 893,
    floorRange: '07 to 09',
    yearBuilt: 1987,
    unitsInDev: 110,
    mrtProximity: '320m to Bishan MRT (NS17/CC15)',
    historicalTrend: { year2020Psf: 640, year2022Psf: 760, year2024Psf: 870, currentPsf: 893, growth5YrPercent: 39.5 },
  },
  {
    id: 'tx-rcr-009',
    projectName: 'JadeScape',
    propertyType: 'Condominium',
    marketSegment: 'RCR',
    district: 'D20',
    planningArea: 'Bishan / Marymount',
    street: '8 Shunfu Road',
    postalCode: '575745',
    lat: 1.3524,
    lng: 103.8398,
    lastPrice: 1960000,
    lastSaleDate: '2025-01-25',
    tenure: '99-year leasehold from 2018',
    remainingLease: '92 years 4 months',
    floorSizeSqft: 904,
    floorSizeSqm: 84,
    psf: 2168,
    floorRange: '16 to 20',
    yearBuilt: 2022,
    unitsInDev: 1206,
    mrtProximity: '240m to Marymount MRT (CC16)',
    historicalTrend: { year2020Psf: 1750, year2022Psf: 1950, year2024Psf: 2120, currentPsf: 2168, growth5YrPercent: 23.9 },
  },
  {
    id: 'tx-rcr-010',
    projectName: 'The Tre Ver',
    propertyType: 'Condominium',
    marketSegment: 'RCR',
    district: 'D13',
    planningArea: 'Toa Payoh / Potong Pasir',
    street: '60 Potong Pasir Avenue 1',
    postalCode: '358389',
    lat: 1.3326,
    lng: 103.8661,
    lastPrice: 1720000,
    lastSaleDate: '2024-12-19',
    tenure: '99-year leasehold from 2018',
    remainingLease: '92 years 5 months',
    floorSizeSqft: 797,
    floorSizeSqm: 74,
    psf: 2158,
    floorRange: '11 to 15',
    yearBuilt: 2022,
    unitsInDev: 729,
    mrtProximity: '560m to Potong Pasir MRT (NE10)',
    historicalTrend: { year2020Psf: 1650, year2022Psf: 1890, year2024Psf: 2110, currentPsf: 2158, growth5YrPercent: 30.8 },
  },
  {
    id: 'tx-rcr-011',
    projectName: 'Toa Payoh Crest (131A Lor 1 Toa Payoh)',
    propertyType: 'HDB 4-Room',
    marketSegment: 'RCR',
    district: 'D12',
    planningArea: 'Toa Payoh',
    street: '131A Lorong 1 Toa Payoh',
    postalCode: '311131',
    lat: 1.3392,
    lng: 103.8449,
    lastPrice: 998000,
    lastSaleDate: '2025-01-04',
    tenure: '99-year leasehold from 2018',
    remainingLease: '92 years 3 months',
    floorSizeSqft: 1001,
    floorSizeSqm: 93,
    psf: 997,
    floorRange: '31 to 35',
    yearBuilt: 2018,
    unitsInDev: 420,
    mrtProximity: '410m to Caldecott MRT (CC17/TE9)',
    historicalTrend: { year2020Psf: 760, year2022Psf: 880, year2024Psf: 975, currentPsf: 997, growth5YrPercent: 31.2 },
  },

  // OCR - Outside Central Region (Condos, ECs, HDBs)
  {
    id: 'tx-ocr-001',
    projectName: 'Treasure at Tampines',
    propertyType: 'Condominium',
    marketSegment: 'OCR',
    district: 'D18',
    planningArea: 'Tampines',
    street: '25 Tampines Lane',
    postalCode: '528489',
    lat: 1.3482,
    lng: 103.9515,
    lastPrice: 1540000,
    lastSaleDate: '2025-01-26',
    tenure: '99-year leasehold from 2018',
    remainingLease: '92 years 9 months',
    floorSizeSqft: 915,
    floorSizeSqm: 85,
    psf: 1683,
    floorRange: '06 to 10',
    yearBuilt: 2023,
    unitsInDev: 2203,
    mrtProximity: '630m to Simei MRT (EW3)',
    historicalTrend: { year2020Psf: 1350, year2022Psf: 1510, year2024Psf: 1650, currentPsf: 1683, growth5YrPercent: 24.7 },
  },
  {
    id: 'tx-ocr-002',
    projectName: 'Tampines GreenRidges (605B Tampines St 61)',
    propertyType: 'HDB 5-Room',
    marketSegment: 'OCR',
    district: 'D18',
    planningArea: 'Tampines',
    street: '605B Tampines Street 61',
    postalCode: '522605',
    lat: 1.3582,
    lng: 103.9388,
    lastPrice: 860000,
    lastSaleDate: '2025-01-19',
    tenure: '99-year leasehold from 2019',
    remainingLease: '93 years 8 months',
    floorSizeSqft: 1216,
    floorSizeSqm: 113,
    psf: 707,
    floorRange: '13 to 15',
    yearBuilt: 2019,
    unitsInDev: 1496,
    mrtProximity: '950m to Tampines MRT (EW2/DT32)',
    historicalTrend: { year2020Psf: 530, year2022Psf: 620, year2024Psf: 690, currentPsf: 707, growth5YrPercent: 33.4 },
  },
  {
    id: 'tx-ocr-003',
    projectName: 'Tampines St 21 Blk 258',
    propertyType: 'HDB 4-Room',
    marketSegment: 'OCR',
    district: 'D18',
    planningArea: 'Tampines',
    street: '258 Tampines Street 21',
    postalCode: '520258',
    lat: 1.3541,
    lng: 103.9482,
    lastPrice: 588000,
    lastSaleDate: '2024-12-22',
    tenure: '99-year leasehold from 1985',
    remainingLease: '59 years 5 months',
    floorSizeSqft: 1119,
    floorSizeSqm: 104,
    psf: 525,
    floorRange: '04 to 06',
    yearBuilt: 1985,
    unitsInDev: 88,
    mrtProximity: '480m to Tampines MRT',
    historicalTrend: { year2020Psf: 390, year2022Psf: 460, year2024Psf: 510, currentPsf: 525, growth5YrPercent: 34.6 },
  },
  {
    id: 'tx-ocr-004',
    projectName: 'Parc Central Residences',
    propertyType: 'Executive Condominium',
    marketSegment: 'OCR',
    district: 'D18',
    planningArea: 'Tampines',
    street: '121 Tampines Street 86',
    postalCode: '528536',
    lat: 1.3562,
    lng: 103.9318,
    lastPrice: 1460000,
    lastSaleDate: '2024-12-10',
    tenure: '99-year leasehold from 2020',
    remainingLease: '94 years 8 months',
    floorSizeSqft: 990,
    floorSizeSqm: 92,
    psf: 1475,
    floorRange: '10 to 12',
    yearBuilt: 2024,
    unitsInDev: 700,
    mrtProximity: '1.2km to Tampines West MRT (DT31)',
    historicalTrend: { year2020Psf: 1180, year2022Psf: 1320, year2024Psf: 1460, currentPsf: 1475, growth5YrPercent: 25.0 },
  },
  {
    id: 'tx-ocr-005',
    projectName: 'Watertown',
    propertyType: 'Condominium',
    marketSegment: 'OCR',
    district: 'D19',
    planningArea: 'Punggol',
    street: '71 Punggol Central',
    postalCode: '828755',
    lat: 1.4062,
    lng: 103.9025,
    lastPrice: 1790000,
    lastSaleDate: '2025-01-16',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 8 months',
    floorSizeSqft: 1152,
    floorSizeSqm: 107,
    psf: 1554,
    floorRange: '08 to 11',
    yearBuilt: 2017,
    unitsInDev: 992,
    mrtProximity: 'Direct access to Punggol MRT/LRT (NE17/PTC)',
    historicalTrend: { year2020Psf: 1280, year2022Psf: 1420, year2024Psf: 1530, currentPsf: 1554, growth5YrPercent: 21.4 },
  },
  {
    id: 'tx-ocr-006',
    projectName: 'Waterway Terraces I (308A Punggol Walk)',
    propertyType: 'HDB 5-Room',
    marketSegment: 'OCR',
    district: 'D19',
    planningArea: 'Punggol',
    street: '308A Punggol Walk',
    postalCode: '821308',
    lat: 1.4055,
    lng: 103.8995,
    lastPrice: 878000,
    lastSaleDate: '2024-11-20',
    tenure: '99-year leasehold from 2015',
    remainingLease: '89 years 5 months',
    floorSizeSqft: 1205,
    floorSizeSqm: 112,
    psf: 729,
    floorRange: '16 to 18',
    yearBuilt: 2015,
    unitsInDev: 1072,
    mrtProximity: '310m to Punggol MRT (NE17)',
    historicalTrend: { year2020Psf: 510, year2022Psf: 630, year2024Psf: 715, currentPsf: 729, growth5YrPercent: 42.9 },
  },
  {
    id: 'tx-ocr-007',
    projectName: 'Parc Esta',
    propertyType: 'Condominium',
    marketSegment: 'RCR',
    district: 'D14',
    planningArea: 'Geylang / Eunos',
    street: '900 Sims Avenue',
    postalCode: '400900',
    lat: 1.3188,
    lng: 103.9038,
    lastPrice: 1980000,
    lastSaleDate: '2025-01-27',
    tenure: '99-year leasehold from 2018',
    remainingLease: '92 years 4 months',
    floorSizeSqft: 926,
    floorSizeSqm: 86,
    psf: 2138,
    floorRange: '13 to 15',
    yearBuilt: 2022,
    unitsInDev: 1399,
    mrtProximity: '210m to Eunos MRT (EW7)',
    historicalTrend: { year2020Psf: 1720, year2022Psf: 1940, year2024Psf: 2090, currentPsf: 2138, growth5YrPercent: 24.3 },
  },
  {
    id: 'tx-ocr-008',
    projectName: 'J Gateway',
    propertyType: 'Condominium',
    marketSegment: 'OCR',
    district: 'D22',
    planningArea: 'Jurong East',
    street: '2 Gateway Drive',
    postalCode: '608533',
    lat: 1.3341,
    lng: 103.7431,
    lastPrice: 1680000,
    lastSaleDate: '2025-01-13',
    tenure: '99-year leasehold from 2012',
    remainingLease: '86 years 5 months',
    floorSizeSqft: 893,
    floorSizeSqm: 83,
    psf: 1881,
    floorRange: '21 to 25',
    yearBuilt: 2016,
    unitsInDev: 738,
    mrtProximity: '190m to Jurong East MRT (NS1/EW24)',
    historicalTrend: { year2020Psf: 1540, year2022Psf: 1720, year2024Psf: 1850, currentPsf: 1881, growth5YrPercent: 22.1 },
  },
  {
    id: 'tx-ocr-009',
    projectName: 'Teban Gardens Blk 37',
    propertyType: 'HDB 4-Room',
    marketSegment: 'OCR',
    district: 'D22',
    planningArea: 'Jurong East',
    street: '37 Teban Gardens Road',
    postalCode: '600037',
    lat: 1.3211,
    lng: 103.7388,
    lastPrice: 595000,
    lastSaleDate: '2025-01-05',
    tenure: '99-year leasehold from 2013',
    remainingLease: '87 years 2 months',
    floorSizeSqft: 1001,
    floorSizeSqm: 93,
    psf: 594,
    floorRange: '21 to 23',
    yearBuilt: 2013,
    unitsInDev: 140,
    mrtProximity: '700m to Pandan Reservoir MRT (future JRL)',
    historicalTrend: { year2020Psf: 430, year2022Psf: 510, year2024Psf: 580, currentPsf: 594, growth5YrPercent: 38.1 },
  },
  {
    id: 'tx-ocr-010',
    projectName: 'Trivelis DBSS (311C Clementi Ave 4)',
    propertyType: 'HDB 4-Room',
    marketSegment: 'OCR',
    district: 'D05',
    planningArea: 'Clementi',
    street: '311C Clementi Avenue 4',
    postalCode: '123311',
    lat: 1.3195,
    lng: 103.7668,
    lastPrice: 960000,
    lastSaleDate: '2025-01-17',
    tenure: '99-year leasehold from 2015',
    remainingLease: '89 years 7 months',
    floorSizeSqft: 883,
    floorSizeSqm: 82,
    psf: 1087,
    floorRange: '31 to 33',
    yearBuilt: 2015,
    unitsInDev: 888,
    mrtProximity: '480m to Clementi MRT (EW23)',
    historicalTrend: { year2020Psf: 790, year2022Psf: 940, year2024Psf: 1060, currentPsf: 1087, growth5YrPercent: 37.6 },
  },
  {
    id: 'tx-ocr-011',
    projectName: 'The Clement Canopy',
    propertyType: 'Condominium',
    marketSegment: 'OCR',
    district: 'D05',
    planningArea: 'Clementi',
    street: '16 Clementi Avenue 1',
    postalCode: '129959',
    lat: 1.3105,
    lng: 103.7712,
    lastPrice: 1780000,
    lastSaleDate: '2024-12-18',
    tenure: '99-year leasehold from 2015',
    remainingLease: '89 years 9 months',
    floorSizeSqft: 893,
    floorSizeSqm: 83,
    psf: 1993,
    floorRange: '26 to 30',
    yearBuilt: 2020,
    unitsInDev: 505,
    mrtProximity: '890m to Clementi MRT',
    historicalTrend: { year2020Psf: 1580, year2022Psf: 1790, year2024Psf: 1950, currentPsf: 1993, growth5YrPercent: 26.1 },
  },
  {
    id: 'tx-ocr-012',
    projectName: 'Woodlands Treegrove (888B Woodlands Dr 50)',
    propertyType: 'HDB 5-Room',
    marketSegment: 'OCR',
    district: 'D25',
    planningArea: 'Woodlands',
    street: '888B Woodlands Drive 50',
    postalCode: '731888',
    lat: 1.4372,
    lng: 103.7915,
    lastPrice: 685000,
    lastSaleDate: '2025-01-21',
    tenure: '99-year leasehold from 1998',
    remainingLease: '72 years 3 months',
    floorSizeSqft: 1313,
    floorSizeSqm: 122,
    psf: 522,
    floorRange: '10 to 12',
    yearBuilt: 1998,
    unitsInDev: 96,
    mrtProximity: '620m to Woodlands MRT (NS9/TE2)',
    historicalTrend: { year2020Psf: 360, year2022Psf: 430, year2024Psf: 505, currentPsf: 522, growth5YrPercent: 45.0 },
  },
  {
    id: 'tx-ocr-013',
    projectName: 'North Park Residences',
    propertyType: 'Condominium',
    marketSegment: 'OCR',
    district: 'D27',
    planningArea: 'Yishun',
    street: '21 Yishun Central 1',
    postalCode: '768798',
    lat: 1.4295,
    lng: 103.8359,
    lastPrice: 1530000,
    lastSaleDate: '2025-01-29',
    tenure: '99-year leasehold from 2015',
    remainingLease: '89 years 4 months',
    floorSizeSqft: 883,
    floorSizeSqm: 82,
    psf: 1733,
    floorRange: '08 to 11',
    yearBuilt: 2018,
    unitsInDev: 920,
    mrtProximity: 'Integrated directly above Yishun MRT (NS13)',
    historicalTrend: { year2020Psf: 1420, year2022Psf: 1590, year2024Psf: 1700, currentPsf: 1733, growth5YrPercent: 22.0 },
  },
  {
    id: 'tx-ocr-014',
    projectName: 'Bedok Residences',
    propertyType: 'Condominium',
    marketSegment: 'OCR',
    district: 'D16',
    planningArea: 'Bedok',
    street: '23 Bedok North Drive',
    postalCode: '465499',
    lat: 1.3242,
    lng: 103.9301,
    lastPrice: 1620000,
    lastSaleDate: '2025-01-24',
    tenure: '99-year leasehold from 2011',
    remainingLease: '85 years 9 months',
    floorSizeSqft: 980,
    floorSizeSqm: 91,
    psf: 1653,
    floorRange: '11 to 14',
    yearBuilt: 2015,
    unitsInDev: 583,
    mrtProximity: 'Integrated with Bedok MRT (EW5)',
    historicalTrend: { year2020Psf: 1380, year2022Psf: 1520, year2024Psf: 1630, currentPsf: 1653, growth5YrPercent: 19.8 },
  },
  {
    id: 'tx-ocr-015',
    projectName: 'Bedok South Horizon (18A Bedok South Rd)',
    propertyType: 'HDB 4-Room',
    marketSegment: 'OCR',
    district: 'D16',
    planningArea: 'Bedok',
    street: '18A Bedok South Road',
    postalCode: '461018',
    lat: 1.3208,
    lng: 103.9351,
    lastPrice: 838000,
    lastSaleDate: '2025-01-12',
    tenure: '99-year leasehold from 2020',
    remainingLease: '94 years 7 months',
    floorSizeSqft: 1001,
    floorSizeSqm: 93,
    psf: 837,
    floorRange: '16 to 18',
    yearBuilt: 2020,
    unitsInDev: 928,
    mrtProximity: '580m to Bedok South MRT (future TE30)',
    historicalTrend: { year2020Psf: 650, year2022Psf: 740, year2024Psf: 820, currentPsf: 837, growth5YrPercent: 28.8 },
  },
];

// Haversine distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function handleTransactions(req: Request, res: Response) {
  const {
    minPrice,
    maxPrice,
    minSizeSqft,
    maxSizeSqft,
    minPsf,
    maxPsf,
    propertyTypes, // comma-separated
    marketSegments, // comma-separated CCR,RCR,OCR
    tenureType, // 'all', 'freehold', 'leasehold99'
    planningArea,
    district,
    search,
    nearLat,
    nearLng,
    radiusKm,
  } = req.query;

  let results = [...SINGAPORE_TRANSACTIONS];

  // Price filter
  if (minPrice) {
    const minP = Number(minPrice);
    if (!isNaN(minP)) results = results.filter((t) => t.lastPrice >= minP);
  }
  if (maxPrice) {
    const maxP = Number(maxPrice);
    if (!isNaN(maxP)) results = results.filter((t) => t.lastPrice <= maxP);
  }

  // Size filter (sqft)
  if (minSizeSqft) {
    const minS = Number(minSizeSqft);
    if (!isNaN(minS)) results = results.filter((t) => t.floorSizeSqft >= minS);
  }
  if (maxSizeSqft) {
    const maxS = Number(maxSizeSqft);
    if (!isNaN(maxS)) results = results.filter((t) => t.floorSizeSqft <= maxS);
  }

  // PSF filter
  if (minPsf) {
    const minP = Number(minPsf);
    if (!isNaN(minP)) results = results.filter((t) => t.psf >= minP);
  }
  if (maxPsf) {
    const maxP = Number(maxPsf);
    if (!isNaN(maxP)) results = results.filter((t) => t.psf <= maxP);
  }

  // Property types filter
  if (propertyTypes && typeof propertyTypes === 'string') {
    const types = propertyTypes.split(',').map((t) => t.trim().toLowerCase());
    results = results.filter((t) => types.some((type) => t.propertyType.toLowerCase().includes(type)));
  }

  // Market segments (CCR, RCR, OCR)
  if (marketSegments && typeof marketSegments === 'string') {
    const segments = marketSegments.split(',').map((s) => s.trim().toUpperCase());
    results = results.filter((t) => segments.includes(t.marketSegment));
  }

  // Tenure type
  if (tenureType && typeof tenureType === 'string' && tenureType !== 'all') {
    if (tenureType === 'freehold') {
      results = results.filter((t) => t.tenure.toLowerCase().includes('freehold') || t.tenure.includes('999-year'));
    } else if (tenureType === 'leasehold99') {
      results = results.filter((t) => t.tenure.toLowerCase().includes('99-year'));
    }
  }

  // Planning Area
  if (planningArea && typeof planningArea === 'string') {
    const pa = planningArea.toLowerCase();
    results = results.filter((t) => t.planningArea.toLowerCase().includes(pa));
  }

  // District
  if (district && typeof district === 'string') {
    const dist = district.toUpperCase();
    results = results.filter((t) => t.district === dist);
  }

  // Text search
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (t) =>
        t.projectName.toLowerCase().includes(q) ||
        t.street.toLowerCase().includes(q) ||
        t.postalCode.includes(q) ||
        t.planningArea.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q)
    );
  }

  // Geolocation detector radius
  if (nearLat && nearLng) {
    const nLat = Number(nearLat);
    const nLng = Number(nearLng);
    const rKm = radiusKm ? Number(radiusKm) : 5.0; // default 5km
    if (!isNaN(nLat) && !isNaN(nLng) && !isNaN(rKm)) {
      results = results
        .map((t) => ({
          ...t,
          distanceFromUserKm: Number(getDistanceKm(nLat, nLng, t.lat, t.lng).toFixed(2)),
        }))
        .filter((t) => (t as any).distanceFromUserKm <= rKm)
        .sort((a: any, b: any) => a.distanceFromUserKm - b.distanceFromUserKm);
    }
  }

  // Compute market summary analytics
  const totalCount = results.length;
  let avgPrice = 0;
  let avgPsf = 0;
  let medianPsf = 0;
  let minP = 0;
  let maxP = 0;

  if (totalCount > 0) {
    const sumPrice = results.reduce((acc, r) => acc + r.lastPrice, 0);
    const sumPsf = results.reduce((acc, r) => acc + r.psf, 0);
    avgPrice = Math.round(sumPrice / totalCount);
    avgPsf = Math.round(sumPsf / totalCount);

    const sortedPsfs = [...results].map((r) => r.psf).sort((a, b) => a - b);
    medianPsf = sortedPsfs[Math.floor(sortedPsfs.length / 2)];
    minP = Math.min(...results.map((r) => r.lastPrice));
    maxP = Math.max(...results.map((r) => r.lastPrice));
  }

  return res.json({
    success: true,
    totalRecords: totalCount,
    analytics: {
      averagePrice: avgPrice,
      averagePsf: avgPsf,
      medianPsf,
      minPrice: minP,
      maxPrice: maxP,
      condoCount: results.filter((t) => t.propertyType.includes('Condominium')).length,
      hdbCount: results.filter((t) => t.propertyType.includes('HDB')).length,
    },
    data: results,
  });
}
