'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MapboxRouteProps {
  className?: string;
}

export const MapboxRoute: React.FC<MapboxRouteProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '', icon: '' });
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [routeOptimized, setRouteOptimized] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Mapbox CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    document.head.appendChild(link);

    // Load Mapbox JavaScript
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    
    script.onload = () => {
      // @ts-ignore - Mapbox is loaded globally
      const mapboxgl = window.mapboxgl;
      
      if (mapboxgl && mapRef.current) {
        // Set your Mapbox access token here (free tier available)
        // You can get one at https://account.mapbox.com/access-tokens/
        mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example'; // Replace with your token
        
        // Initialize map
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/dark-v11', // Dark theme
          center: [6.4764, 52.7225], // Vanhaaster Reclamebureau - Hoogeveen
          zoom: 10
        });
        setMapInstance(map);

        // Ensure dark mode is applied
        map.on('load', () => {
          map.addSource('mapbox-streets', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8'
          });
        });

        map.on('load', () => {
          // Add custom markers
          const locations = [
            {
              coordinates: [6.4764, 52.7225],
              title: 'Vanhaaster Reclamebureau - Hoogeveen',
              icon: 'V',
              isVanhaaster: true
            },
            {
              coordinates: [6.9069, 52.7792],
              title: 'Wildlands Adventure Zoo - Emmen',
              icon: 'W'
            },
            {
              coordinates: [6.5625, 52.9967],
              title: 'Assen Centrum',
              icon: 'A'
            },
            {
              coordinates: [6.5665, 53.2194],
              title: 'Educatieve bebording - Groningen',
              icon: 'E'
            }
          ];

          // Add markers
          locations.forEach(location => {
            // Create marker element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            
            // Special styling for Vanhaaster marker
            const markerStyle = location.isVanhaaster ? `
              <div style="
                width: 35px; 
                height: 35px; 
                background-color: #000000; 
                border: 3px solid #E2017A; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: #E2017A; 
                font-weight: bold; 
                font-size: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
              ">
                ${location.icon}
              </div>
            ` : `
              <div style="
                width: 30px; 
                height: 30px; 
                background-color: #E2017A; 
                border: 2px solid #000000; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-weight: bold; 
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
              ">
                ${location.icon}
              </div>
            `;
            
            el.innerHTML = markerStyle;

            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${location.title}</h3>`);

            // Add marker to map
            new mapboxgl.Marker(el)
              .setLngLat(location.coordinates)
              .setPopup(popup)
              .addTo(map);
          });

          // Add route line with Vanhaaster as start and end point
          const routeCoordinates = [
            [6.4764, 52.7225], // Vanhaaster Reclamebureau - Hoogeveen (START)
            [6.9069, 52.7792], // Emmen
            [6.5625, 52.9967], // Assen
            [6.5665, 53.2194], // Groningen
            [6.4764, 52.7225]  // Vanhaaster Reclamebureau - Hoogeveen (END)
          ];

          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#E2017A',
              'line-width': 4,
              'line-opacity': 0.8,
              'line-dasharray': [2, 2]
            }
          });

          setMapLoaded(true);
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleRouteOptimization = () => {
    if (mapInstance) {
      // Simulate route optimization with Vanhaaster as start/end
      const optimizedRoute = [
        [6.4764, 52.7225], // Vanhaaster Reclamebureau - Hoogeveen (START)
        [6.9069, 52.7792], // Emmen
        [6.5625, 52.9967], // Assen
        [6.5665, 53.2194], // Groningen
        [6.4764, 52.7225]  // Vanhaaster Reclamebureau - Hoogeveen (END)
      ];
      
      // Remove existing route
      if (mapInstance.getSource('route')) {
        mapInstance.removeLayer('route');
        mapInstance.removeSource('route');
      }
      
      // Add optimized route
      mapInstance.addSource('optimized-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: optimizedRoute
          }
        }
      });

      mapInstance.addLayer({
        id: 'optimized-route',
        type: 'line',
        source: 'optimized-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00FF00',
          'line-width': 6,
          'line-opacity': 0.9,
          'line-dasharray': [5, 10]
        }
      });
      
      setRouteOptimized(true);
      
      // Show success message
      setTimeout(() => {
        setRouteOptimized(false);
        // Restore original route
        mapInstance.removeLayer('optimized-route');
        mapInstance.removeSource('optimized-route');
      }, 5000);
    }
  };

  const handleAddNewLocation = () => {
    setShowNewLocationModal(true);
  };

  const handleSaveLocation = () => {
    if (newLocation.name && newLocation.lat && newLocation.lng && newLocation.icon) {
      const lat = parseFloat(newLocation.lat);
      const lng = parseFloat(newLocation.lng);
      
      if (mapInstance && !isNaN(lat) && !isNaN(lng)) {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div style="
            width: 30px; 
            height: 30px; 
            background-color: #E2017A; 
            border: 2px solid #000000; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold; 
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            ${newLocation.icon}
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${newLocation.name}</h3>`);

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapInstance);

        // Reset form
        setNewLocation({ name: '', lat: '', lng: '', icon: '' });
        setShowNewLocationModal(false);
        
        // Show success message
        alert(`Locatie "${newLocation.name}" succesvol toegevoegd!`);
      }
    } else {
      alert('Vul alle velden in om een locatie toe te voegen.');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#111111]/80 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E2017A] mx-auto mb-4"></div>
            <p className="text-[#E2017A] text-sm">Kaart laden...</p>
          </div>
        </div>
      )}

      {/* Route Legend */}
      <div className="absolute top-4 left-4 z-50 bg-[#111111]/90 rounded-lg shadow-lg border border-[#E2017A]/20 p-3">
        <div className="text-sm font-medium text-white mb-2">Route status</div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#E2017A] rounded-full mr-2"></div>
            <span className="text-xs text-[#E2017A]">Gepland</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#E2017A]/60 rounded-full mr-2"></div>
            <span className="text-xs text-[#E2017A]/60">In uitvoering</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#E2017A]/30 rounded-full mr-2"></div>
            <span className="text-xs text-[#E2017A]/30">Voltooid</span>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="absolute top-4 right-4 z-50 bg-black/90 rounded-lg shadow-lg border border-gray-700 p-3">
        <div className="text-sm font-medium text-[#E2017A] mb-2">Route Info</div>
        <div className="text-xs text-[#E2017A]">
          <div>Emmen → Assen → Groningen</div>
          <div className="mt-1">
            Afstand: ~127 km<br/>
            Tijd: ~6,5 uur
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="absolute bottom-4 left-4 z-50 bg-[#111111]/90 rounded-lg shadow-lg border border-[#E2017A]/20 p-3">
        <div className="text-sm font-medium text-white mb-2">Snelle acties</div>
        <div className="space-y-2">
          <button 
            onClick={handleRouteOptimization}
            className={`w-full px-3 py-1 rounded text-xs transition-colors ${
              routeOptimized 
                ? 'bg-green-500 text-white' 
                : 'bg-[#E2017A] hover:bg-[#E2017A]/80 text-white'
            }`}
          >
            {routeOptimized ? 'Route Geoptimaliseerd!' : 'Route optimaliseren'}
          </button>
          <button 
            onClick={handleAddNewLocation}
            className="w-full bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Nieuwe locatie
          </button>
        </div>
      </div>

      {/* Traffic Info */}
      <div className="absolute bottom-4 right-4 z-50 bg-[#111111]/90 rounded-lg shadow-lg border border-[#E2017A]/20 p-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#E2017A] rounded-full"></div>
          <span className="text-xs text-white">Verkeer: Normaal</span>
        </div>
        <div className="text-xs text-[#E2017A]/60 mt-1">+5 min reistijd</div>
      </div>

      {/* Route Details Table */}
      <div className="mt-6 bg-black/40 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-medium text-[#E2017A] mb-4">Route Details</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Locatie</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Coördinaten</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Afstand</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Reistijd</th>
                <th className="text-left py-2 px-3 text-[#E2017A] font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-b border-gray-700/50 hover:bg-black/20">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black border border-[#E2017A] rounded-full"></div>
                    <span className="font-medium">Vanhaaster Reclamebureau</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-300">52.7225, 6.4764</td>
                <td className="py-3 px-3 text-gray-300">-</td>
                <td className="py-3 px-3 text-gray-300">08:00</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Startpunt</span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/50 hover:bg-black/20">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#E2017A] rounded-full"></div>
                    <span className="font-medium">Emmen</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-300">52.7792, 6.9069</td>
                <td className="py-3 px-3 text-gray-300">~15 km</td>
                <td className="py-3 px-3 text-gray-300">09:00</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Bezocht</span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/50 hover:bg-black/20">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#E2017A] rounded-full"></div>
                    <span className="font-medium">Assen</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-300">52.9967, 6.5625</td>
                <td className="py-3 px-3 text-gray-300">~25 km</td>
                <td className="py-3 px-3 text-gray-300">10:30</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Onderweg</span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/50 hover:bg-black/20">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#E2017A] rounded-full"></div>
                    <span className="font-medium">Groningen</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-300">53.2194, 6.5665</td>
                <td className="py-3 px-3 text-gray-300">~45 km</td>
                <td className="py-3 px-3 text-gray-300">12:00</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Gepland</span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/50 hover:bg-black/20">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black border border-[#E2017A] rounded-full"></div>
                    <span className="font-medium">Vanhaaster Reclamebureau</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-300">52.7225, 6.4764</td>
                <td className="py-3 px-3 text-gray-300">~70 km</td>
                <td className="py-3 px-3 text-gray-300">17:00</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Eindpunt</span>
                </td>
              </tr>
            </tbody>
          </table>
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
    </div>

      {/* New Location Modal */}
      {showNewLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-black/95 border border-gray-700 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-white mb-4">Nieuwe Locatie Toevoegen</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E2017A] mb-2">
                  Locatie Naam
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  className="w-full bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Bijv. Keukenhof"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#E2017A] mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.lat}
                    onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                    className="w-full bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm"
                    placeholder="52.7792"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#E2017A] mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.lng}
                    onChange={(e) => setNewLocation({...newLocation, lng: e.target.value})}
                    className="w-full bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm"
                    placeholder="6.9069"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#E2017A] mb-2">
                  Icon Letter
                </label>
                <input
                  type="text"
                  maxLength={1}
                  value={newLocation.icon}
                  onChange={(e) => setNewLocation({...newLocation, icon: e.target.value.toUpperCase()})}
                  className="w-full bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm text-center text-lg font-bold"
                  placeholder="K"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveLocation}
                className="flex-1 bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Locatie Toevoegen
              </button>
              <button
                onClick={() => setShowNewLocationModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
