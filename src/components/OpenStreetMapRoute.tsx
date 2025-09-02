'use client';

import React, { useEffect, useRef, useState } from 'react';

interface OpenStreetMapRouteProps {
  className?: string;
}

interface RouteLocation {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  status: 'start' | 'visited' | 'in-progress' | 'planned' | 'end';
  time: string;
  distance: string;
}

export const OpenStreetMapRoute: React.FC<OpenStreetMapRouteProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const routeData: RouteLocation[] = [
    {
      id: '1',
      name: 'Vanhaaster Reclamebureau',
      address: 'Industrieweg 96, 7903 AK Hoogeveen',
      coordinates: [52.7225, 6.4764],
      status: 'start',
      time: '08:00',
      distance: '-'
    },
    {
      id: '2',
      name: 'Emmen',
      address: 'Hoofdstraat 123, 7811 EM Emmen',
      coordinates: [52.7792, 6.9069],
      status: 'visited',
      time: '09:00',
      distance: '~15 km'
    },
    {
      id: '3',
      name: 'Assen',
      address: 'Kerkstraat 45, 9401 JW Assen',
      coordinates: [52.9967, 6.5625],
      status: 'in-progress',
      time: '10:30',
      distance: '~25 km'
    },
    {
      id: '4',
      name: 'Groningen',
      address: 'Grote Markt 67, 9711 LV Groningen',
      coordinates: [53.2194, 6.5665],
      status: 'planned',
      time: '12:00',
      distance: '~45 km'
    },
    {
      id: '5',
      name: 'Vanhaaster Reclamebureau',
      address: 'Industrieweg 96, 7903 AK Hoogeveen',
      coordinates: [52.7225, 6.4764],
      status: 'end',
      time: '17:00',
      distance: '~70 km'
    }
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    setMapLoading(true);
    setMapError(null);

    const initMap = async () => {
      try {
        // First, ensure Leaflet CSS is loaded
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.crossOrigin = '';
          document.head.appendChild(link);
          
          // Wait for CSS to load
          await new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve; // Continue even if CSS fails
          });
        }

        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Clear any existing content
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Initialize map
        const map = L.map(mapRef.current!).setView([52.7225, 6.4764], 10);
        setMapInstance(map);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        // Apply dark mode styling
        map.getContainer().style.filter = 'invert(90%) hue-rotate(180deg) brightness(0.8)';

        // Create custom icons
        const createCustomIcon = (color: string, letter: string, size: number = 30) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                width: ${size}px; 
                height: ${size}px; 
                background-color: ${color}; 
                border: 2px solid #000000; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-weight: bold; 
                font-size: ${size * 0.4}px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                ${letter}
              </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          });
        };

        // Add markers for each location
        routeData.forEach((location, index) => {
          let icon;
          let color;

          switch (location.status) {
            case 'start':
            case 'end':
              icon = createCustomIcon('#000000', 'V', 35);
              color = '#E2017A';
              break;
            default:
              icon = createCustomIcon('#E2017A', String.fromCharCode(65 + index - 1), 30);
              color = '#E2017A';
          }

          L.marker(location.coordinates, { icon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <div style="font-weight: bold; color: ${color}; margin-bottom: 5px;">
                  ${location.name}
                </div>
                <div style="color: #666; font-size: 12px; margin-bottom: 5px;">
                  ${location.address}
                </div>
                <div style="color: #333; font-size: 11px;">
                  Tijd: ${location.time} | Afstand: ${location.distance}
                </div>
              </div>
            `);
        });

        // Draw route line
        const routeCoordinates = routeData.map(loc => loc.coordinates);
        const routeLine = L.polyline(routeCoordinates, {
          color: '#E2017A',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map);

        // Fit map to show entire route
        map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

        setMapLoading(false);
      } catch (error) {
        console.error('Error loading OpenStreetMap:', error);
        setMapError('Er is een fout opgetreden bij het laden van de kaart');
        setMapLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'start': return 'bg-blue-500/20 text-blue-400';
      case 'visited': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'planned': return 'bg-gray-500/20 text-gray-400';
      case 'end': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'start': return 'Startpunt';
      case 'visited': return 'Bezocht';
      case 'in-progress': return 'Onderweg';
      case 'planned': return 'Gepland';
      case 'end': return 'Eindpunt';
      default: return 'Onbekend';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Container */}
      <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Route Overzicht</h3>
          <div className="flex space-x-2">
            <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Route Optimaliseren
            </button>
            <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              + Nieuwe Locatie
            </button>
          </div>
        </div>

        {/* Map */}
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-gray-700 relative"
        >
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E2017A] mx-auto mb-4"></div>
                <div className="text-[#E2017A] text-lg font-medium mb-2">Kaart laden...</div>
                <div className="text-gray-400 text-sm">OpenStreetMap wordt geladen</div>
              </div>
            </div>
          )}
          
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-red-400 text-lg font-medium mb-2">Fout bij laden kaart</div>
                <div className="text-gray-400 text-sm mb-4">{mapError}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm"
                >
                  Opnieuw proberen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Route Summary */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-[#E2017A] font-medium">Totale Afstand</div>
              <div className="text-white">~140 km</div>
            </div>
            <div className="text-center">
              <div className="text-[#E2017A] font-medium">Totale Reistijd</div>
              <div className="text-white">~2,5 uur</div>
            </div>
            <div className="text-center">
              <div className="text-[#E2017A] font-medium">Locaties</div>
              <div className="text-white">5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Details Table */}
      <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-medium text-[#E2017A] mb-4">Route Details</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Locatie</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Adres</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Afstand</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Reistijd</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {routeData.map((location) => (
                <tr key={location.id} className="border-b border-gray-700/50 hover:bg-black/20">
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        location.status === 'start' || location.status === 'end' 
                          ? 'bg-black border border-[#E2017A]' 
                          : 'bg-[#E2017A]'
                      }`}></div>
                      <span className="font-medium">{location.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300">{location.address}</td>
                  <td className="py-3 px-3 text-gray-300">{location.distance}</td>
                  <td className="py-3 px-3 text-gray-300">{location.time}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(location.status)}`}>
                      {getStatusText(location.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
