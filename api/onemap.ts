import { Request, Response } from 'express';

// In-memory token storage (can be configured via environment or session)
let runtimeOneMapToken: string | null = null;

/**
 * Retrieve the active OneMap SLA token
 * Prioritizes runtime-configured token, then environment variable ONEMAP_TOKEN
 */
export function getOneMapToken(): string | null {
  return runtimeOneMapToken || process.env.ONEMAP_TOKEN?.trim() || null;
}

export function setRuntimeOneMapToken(token: string | null) {
  runtimeOneMapToken = token ? token.trim() : null;
}

// Built-in Singapore gazetteer for fallback when token is not yet entered
const SG_FALLBACK_PLACES = [
  { searchVal: 'raffles place', name: 'Raffles Place MRT (EW14/NS26)', lat: 1.283933, lng: 103.851463, postal: '048616', address: 'Raffles Place, Financial District' },
  { searchVal: 'marina bay', name: 'Marina Bay Sands / Marina One', lat: 1.278385, lng: 103.853245, postal: '018936', address: '9 Straits View, Marina One' },
  { searchVal: 'bishan', name: 'Bishan Town Centre / Junction 8', lat: 1.350833, lng: 103.848889, postal: '579837', address: '9 Bishan Place, Bishan' },
  { searchVal: 'queenstown', name: 'Queenstown MRT / Dawson', lat: 1.294444, lng: 103.806111, postal: '149043', address: 'Commonwealth Ave, Queenstown' },
  { searchVal: 'tampines', name: 'Tampines Regional Hub', lat: 1.353333, lng: 103.945278, postal: '529538', address: '1 Tampines Walk, Tampines' },
  { searchVal: 'orchard', name: 'Orchard Road / ION Orchard', lat: 1.304000, lng: 103.832000, postal: '238801', address: '2 Orchard Turn, Orchard' },
  { searchVal: 'jurong east', name: 'Jurong East Gateway / Westgate', lat: 1.333156, lng: 103.742287, postal: '608532', address: '3 Gateway Drive, Jurong East' },
  { searchVal: 'toa payoh', name: 'Toa Payoh Central / Hub', lat: 1.332306, lng: 103.847556, postal: '319191', address: '480 Lor 6 Toa Payoh' },
  { searchVal: 'punggol', name: 'Punggol Waterway Point', lat: 1.406733, lng: 103.902266, postal: '828761', address: '83 Punggol Central' },
  { searchVal: 'woodlands', name: 'Woodlands Civic Centre / MRT', lat: 1.436065, lng: 103.786526, postal: '738099', address: '900 South Woodlands Drive' },
  { searchVal: 'clementi', name: 'Clementi Mall / Interchange', lat: 1.315197, lng: 103.765083, postal: '129588', address: '3155 Commonwealth Ave West' },
  { searchVal: 'ang mo kio', name: 'Ang Mo Kio Hub / Central', lat: 1.369933, lng: 103.848450, postal: '569933', address: '53 Ang Mo Kio Ave 3' },
  { searchVal: 'bedok', name: 'Bedok Mall / Central', lat: 1.324028, lng: 103.929722, postal: '467360', address: '311 New Upper Changi Rd' },
];

/**
 * Handle Search / Geocoding
 * GET /api/onemap/search?searchVal=...&pageNum=1
 */
export async function handleSearch(req: Request, res: Response) {
  const searchVal = String(req.query.searchVal || '').trim();
  const pageNum = req.query.pageNum || '1';

  if (!searchVal) {
    return res.status(400).json({ error: 'Parameter searchVal is required' });
  }

  const token = getOneMapToken() || (req.headers['authorization']?.replace(/^Bearer\s+/i, ''));

  if (token) {
    try {
      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
        searchVal
      )}&returnGeom=Y&getAddrDetails=Y&pageNum=${pageNum}`;

      // OneMap allows raw token or Bearer token
      const authHeader = token.startsWith('Bearer ') ? token : token;

      const apiRes = await fetch(url, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.json({
          source: 'sla_onemap_live',
          ...data,
        });
      } else {
        console.warn(`SLA OneMap search returned status ${apiRes.status}`);
      }
    } catch (err) {
      console.error('Error fetching from SLA OneMap search:', err);
    }
  }

  // Graceful fallback for Singapore search
  const lowerQuery = searchVal.toLowerCase();
  const matched = SG_FALLBACK_PLACES.filter(
    (p) =>
      p.searchVal.includes(lowerQuery) ||
      p.name.toLowerCase().includes(lowerQuery) ||
      p.postal.includes(lowerQuery)
  );

  const results = (matched.length > 0 ? matched : SG_FALLBACK_PLACES.slice(0, 3)).map((p) => ({
    SEARCHVAL: p.name,
    BLK_NO: '',
    ROAD_NAME: p.address,
    BUILDING: p.name,
    ADDRESS: p.address,
    POSTAL: p.postal,
    X: '0',
    Y: '0',
    LATITUDE: p.lat.toString(),
    LONGITUDE: p.lng.toString(),
  }));

  return res.json({
    source: token ? 'fallback_onemap_unavailable' : 'fallback_no_token',
    found: results.length,
    totalNumPages: 1,
    pageNum: Number(pageNum),
    results,
    note: token
      ? 'Live SLA request returned empty or non-200. Showing matched Singapore coordinates.'
      : 'Add ONEMAP_TOKEN in .env or via the SLA Settings panel for live SLA OneMap authentication.',
  });
}

/**
 * Handle Reverse Geocode
 * GET /api/onemap/revgeocode?location=1.3,103.8&buffer=40&addressType=All
 */
export async function handleRevGeocode(req: Request, res: Response) {
  const location = String(req.query.location || req.query.lat && req.query.lng ? `${req.query.lat},${req.query.lng}` : '').trim();
  const buffer = String(req.query.buffer || '40');
  const addressType = String(req.query.addressType || 'All');

  if (!location) {
    return res.status(400).json({ error: 'Parameter location (lat,lng) is required' });
  }

  const token = getOneMapToken() || (req.headers['authorization']?.replace(/^Bearer\s+/i, ''));

  if (token) {
    try {
      const url = `https://www.onemap.gov.sg/api/public/revgeocode?location=${encodeURIComponent(
        location
      )}&buffer=${encodeURIComponent(buffer)}&addressType=${encodeURIComponent(addressType)}`;

      const authHeader = token.startsWith('Bearer ') ? token : token;

      const apiRes = await fetch(url, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.json({
          source: 'sla_onemap_live',
          ...data,
        });
      }
    } catch (err) {
      console.error('Error fetching from SLA OneMap revgeocode:', err);
    }
  }

  // Graceful fallback: find closest Singapore reference point
  const [latStr, lngStr] = location.split(',');
  const lat = parseFloat(latStr) || 1.3521;
  const lng = parseFloat(lngStr) || 103.8198;

  let closest = SG_FALLBACK_PLACES[0];
  let minDist = Infinity;
  for (const place of SG_FALLBACK_PLACES) {
    const d = Math.hypot(place.lat - lat, place.lng - lng);
    if (d < minDist) {
      minDist = d;
      closest = place;
    }
  }

  return res.json({
    source: token ? 'fallback_onemap_unavailable' : 'fallback_no_token',
    GeocodeInfo: [
      {
        BUILDINGNAME: closest.name,
        BLOCK: '',
        ROAD: closest.address,
        POSTALCODE: closest.postal,
        LATITUDE: lat.toString(),
        LONGITUDE: lng.toString(),
      },
    ],
    note: token
      ? 'Live reverse geocode unreached'
      : 'Add ONEMAP_TOKEN in .env or via the SLA Settings panel for live SLA reverse geocoding.',
  });
}

/**
 * Handle Routing
 * GET /api/onemap/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk
 */
export async function handleRouting(req: Request, res: Response) {
  const start = String(req.query.start || '').trim();
  const end = String(req.query.end || '').trim();
  const routeType = String(req.query.routeType || 'walk').toLowerCase();

  if (!start || !end) {
    return res.status(400).json({ error: 'Parameters start and end (lat,lng) are required' });
  }

  const token = getOneMapToken() || (req.headers['authorization']?.replace(/^Bearer\s+/i, ''));

  if (token) {
    try {
      const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;

      const authHeader = token.startsWith('Bearer ') ? token : token;

      const apiRes = await fetch(url, {
        headers: {
          Authorization: authHeader,
        },
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.json({
          source: 'sla_onemap_live',
          ...data,
        });
      }
    } catch (err) {
      console.error('Error fetching SLA OneMap routing:', err);
    }
  }

  // Graceful fallback route geometry and metrics
  const [sLat, sLng] = start.split(',').map(Number);
  const [eLat, eLng] = end.split(',').map(Number);

  // Approximate distance in meters (haversine)
  const R = 6371000;
  const dLat = ((eLat - sLat) * Math.PI) / 180;
  const dLng = ((eLng - sLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((sLat * Math.PI) / 180) *
      Math.cos((eLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = Math.round(R * c);

  // Speed estimates: walk 4.5km/h, cycle 14km/h, drive 32km/h, pt 22km/h
  const speedsKmh: Record<string, number> = {
    walk: 4.5,
    cycle: 14,
    drive: 32,
    pt: 22,
  };
  const speed = speedsKmh[routeType] || 4.5;
  const totalTimeSeconds = Math.round((distanceMeters / (speed * 1000 / 3600)));

  return res.json({
    source: token ? 'fallback_onemap_unavailable' : 'fallback_no_token',
    route_summary: {
      total_time: totalTimeSeconds,
      total_distance: distanceMeters,
      start_point: start,
      end_point: end,
      mode: routeType,
    },
    route_geometry: [
      [sLat, sLng],
      [(sLat + eLat) / 2 + 0.0005, (sLng + eLng) / 2 - 0.0003],
      [eLat, eLng],
    ],
    directions: [
      `Depart origin point via nearest pedestrian access.`,
      `Head towards destination along connected park connector / covered walkway. (${distanceMeters}m)`,
      `Arrive at destination in approx ${Math.ceil(totalTimeSeconds / 60)} minutes.`,
    ],
  });
}

/**
 * Handle Token Configuration & Verification
 * POST /api/onemap/token
 * Body: { token: "..." }
 */
export async function handleTokenMint(req: Request, res: Response) {
  const { token } = req.body || {};

  if (!token || typeof token !== 'string' || !token.trim()) {
    // If querying current status
    const currentToken = getOneMapToken();
    if (currentToken) {
      return res.json({
        success: true,
        message: 'Active OneMap token is configured',
        hasToken: true,
        tokenPreview: `${currentToken.slice(0, 8)}...${currentToken.slice(-6)}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Please provide a valid OneMap token in the "token" field.',
      hasToken: false,
    });
  }

  const cleanToken = token.trim();
  setRuntimeOneMapToken(cleanToken);

  // Validate token with a quick search test to OneMap
  try {
    const testRes = await fetch(
      'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=N&getAddrDetails=N&pageNum=1',
      {
        headers: {
          Authorization: cleanToken,
        },
      }
    );

    if (testRes.ok) {
      return res.json({
        success: true,
        message: 'OneMap token verified and active for live SLA queries!',
        hasToken: true,
        tokenPreview: `${cleanToken.slice(0, 8)}...${cleanToken.slice(-6)}`,
      });
    } else {
      return res.json({
        success: true,
        message: `Token saved, but OneMap returned status ${testRes.status}. Ensure the token is valid and unexpired.`,
        hasToken: true,
        tokenPreview: `${cleanToken.slice(0, 8)}...${cleanToken.slice(-6)}`,
      });
    }
  } catch (err: any) {
    return res.json({
      success: true,
      message: 'Token saved for session.',
      hasToken: true,
      tokenPreview: `${cleanToken.slice(0, 8)}...${cleanToken.slice(-6)}`,
    });
  }
}

// Re-export Data.gov.sg HDB datastore search and metadata for unified OneMap & Government Data service
export { handleHdbResale as handleHdbDatastoreSearch, handleHdbMetadata as handleHdbDatasetMetadata } from './hdb.ts';

