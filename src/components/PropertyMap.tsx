import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PropertyTransaction, DetectedLocation, RouteResult } from '../types';

interface PropertyMapProps {
  transactions: PropertyTransaction[];
  selectedProperty: PropertyTransaction | null;
  onSelectProperty: (property: PropertyTransaction | null) => void;
  userLocation: DetectedLocation | null;
  radiusKm: number;
  activeRoute: RouteResult | null;
  mapBasemap: 'onemap_light' | 'dark' | 'streets';
  onMapClick?: (lat: number, lng: number) => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  transactions,
  selectedProperty,
  onSelectProperty,
  userLocation,
  radiusKm,
  activeRoute,
  mapBasemap,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Singapore center coordinates
    const map = L.map(mapContainerRef.current, {
      center: [1.3521, 103.8198],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Base Layer
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';
    let maxZoom = 19;

    if (mapBasemap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapBasemap === 'onemap_light') {
      // Singapore SLA OneMap public tile endpoint (with Carto fallback)
      tileUrl = 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';
      subdomains = '';
      maxZoom = 19;
    }

    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap SLA</a> | &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom,
      subdomains,
    }).addTo(map);

    baseTileLayerRef.current = tileLayer;

    // Layer groups for markers
    markersLayerRef.current = L.layerGroup().addTo(map);
    userMarkerRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';
    let maxZoom = 19;

    if (mapBasemap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapBasemap === 'onemap_light') {
      tileUrl = 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';
      subdomains = '';
      maxZoom = 19;
    }

    const newLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap SLA</a> | &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom,
      subdomains,
    }).addTo(mapInstanceRef.current);

    baseTileLayerRef.current = newLayer;
  }, [mapBasemap]);

  // Update User Location Marker & Detection Radius Circle
  useEffect(() => {
    if (!mapInstanceRef.current || !userMarkerRef.current) return;
    userMarkerRef.current.clearLayers();

    if (userLocation) {
      const { lat, lng } = userLocation;

      // Geolocation Pulse Beacon Icon
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-emerald-400 opacity-60"></span>
            <span class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg">
              <span class="h-2 w-2 rounded-full bg-white"></span>
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: userIcon });
      marker.bindPopup(`
        <div class="text-xs p-1">
          <p class="font-bold text-emerald-600 uppercase tracking-wider text-[10px]">Detected Geolocation</p>
          <p class="font-medium text-slate-800">${userLocation.buildingName || 'Your Location'}</p>
          <p class="text-slate-500">${userLocation.address || 'Singapore'}</p>
          <p class="mt-1 text-[10px] text-slate-400">${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
        </div>
      `);
      userMarkerRef.current.addLayer(marker);

      // Detection radius circle
      if (radiusKm > 0) {
        const circle = L.circle([lat, lng], {
          radius: radiusKm * 1000,
          color: '#10b981',
          weight: 1.5,
          opacity: 0.7,
          dashArray: '4, 6',
          fillColor: '#10b981',
          fillOpacity: 0.05,
        });
        userMarkerRef.current.addLayer(circle);
      }
    }
  }, [userLocation, radiusKm]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (activeRoute && activeRoute.route_geometry.length > 0) {
      const polyline = L.polyline(activeRoute.route_geometry, {
        color: '#06b6d4', // cyan-500
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: activeRoute.route_summary.mode === 'walk' ? '1, 8' : undefined,
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;

      // Fit map bounds to encompass the route
      mapInstanceRef.current.fitBounds(polyline.getBounds(), {
        padding: [60, 60],
        maxZoom: 15,
      });
    }
  }, [activeRoute]);

  // Update Property Transaction Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    transactions.forEach((tx) => {
      const isCondo = tx.propertyType.includes('Condominium');
      const isSelected = selectedProperty?.id === tx.id;

      // Format price label for marker
      const priceText =
        tx.lastPrice >= 1000000
          ? `$${(tx.lastPrice / 1000000).toFixed(2)}M`
          : `$${Math.round(tx.lastPrice / 1000)}k`;

      const markerHtml = `
        <div class="group cursor-pointer transition-transform duration-200 hover:scale-110 ${
          isSelected ? 'scale-115 z-50 ring-2 ring-amber-400 rounded-lg' : ''
        }">
          <div class="flex items-center gap-1 rounded-md px-2 py-1 shadow-md text-xs font-semibold backdrop-blur-sm ${
            isCondo
              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/40'
              : 'bg-indigo-950/90 text-indigo-200 border border-indigo-500/40'
          }">
            <span class="inline-block h-1.5 w-1.5 rounded-full ${
              isCondo ? 'bg-emerald-400' : 'bg-indigo-400'
            }"></span>
            <span class="tabular-nums tracking-tight">${priceText}</span>
          </div>
          <div class="mx-auto h-1.5 w-1.5 rotate-45 transform ${
            isCondo ? 'bg-emerald-600' : 'bg-indigo-600'
          } -mt-0.5"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-property-marker',
        html: markerHtml,
        iconSize: [60, 26],
        iconAnchor: [30, 26],
      });

      const marker = L.marker([tx.lat, tx.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectProperty(tx);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [transactions, selectedProperty, onSelectProperty]);

  // Center on selected property
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedProperty.lat, selectedProperty.lng], 15, {
        duration: 0.8,
      });
    }
  }, [selectedProperty]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
    </div>
  );
};
