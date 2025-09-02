'use client';

import React, { useEffect, useRef, useState } from 'react';

interface OpenStreetMapRouteProps {
  className?: string;
}

export const OpenStreetMapRoute: React.FC<OpenStreetMapRouteProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '', icon: '' });
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [routeOptimized, setRouteOptimized] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    const initMap = async () => {
      try {
        // Import Leaflet
        const L = await import('leaflet');
        
        // Import CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Initialize map - center on Vanhaaster office
        const map = L.map(mapRef.current).setView([52.7225, 6.4764], 10);
        setMapInstance(map);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);
        
        // Apply dark mode styling to the map
        map.getContainer().style.filter = 'invert(90%) hue-rotate(180deg) brightness(0.8)';

        // Add custom markers
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
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
            ">
              E
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const customIcon2 = L.divIcon({
          className: 'custom-marker',
          html: `
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
            ">
              A
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const customIcon3 = L.divIcon({
          className: 'custom-marker',
          html: `
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
            ">
              G
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        // Add Vanhaaster marker (start/end point)
        const vanhaasterIcon = L.divIcon({
          className: 'custom-marker',
          html: `
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
            ">
              V
            </div>
          `,
          iconSize: [35, 35],
          iconAnchor: [17, 17]
        });

        const vanhaasterMarker = L.marker([52.7225, 6.4764], { icon: vanhaasterIcon })
          .addTo(map)
          .bindPopup('Vanhaaster Reclamebureau<br>Industrieweg 96, 7903 AK Hoogeveen');

        // Add other markers
        const marker1 = L.marker([52.7792, 6.9069], { icon: customIcon })
          .addTo(map)
          .bindPopup('Emmen');

        const marker2 = L.marker([52.9967, 6.5625], { icon: customIcon2 })
          .addTo(map)
          .bindPopup('Assen');

        const marker3 = L.marker([53.2194, 6.5665], { icon: customIcon3 })
          .addTo(map)
          .bindPopup('Groningen');

        // Add route line with Vanhaaster as start and end point
        const routeLine = L.polyline([
          [52.7225, 6.4764], // Vanhaaster Reclamebureau - Hoogeveen (START)
          [52.7792, 6.9069], // Emmen
          [52.9967, 6.5625], // Assen
          [53.2194, 6.5665], // Groningen
          [52.7225, 6.4764]  // Vanhaaster Reclamebureau - Hoogeveen (END)
        ], {
          color: '#E2017A',
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        // Store routeLine reference for optimization
        map.routeLine = routeLine;

        // Add route info panel
        const routeInfo = L.control({ position: 'topright' });
        routeInfo.onAdd = function() {
          const div = L.DomUtil.create('div', 'route-info');
          div.innerHTML = `
            <div style="
              background: rgba(0, 0, 0, 0.9); 
              color: white; 
              padding: 10px; 
              border: 1px solid #666666; 
              font-size: 12px;
              min-width: 180px;
            ">
              <div style="color: #E2017A; font-weight: bold; margin-bottom: 5px;">Route Info</div>
              <div style="color: #E2017A;">Hoogeveen → Emmen → Assen → Groningen → Hoogeveen</div>
              <div style="margin-top: 5px; color: #E2017A;">
                <div>Afstand: ~140 km</div>
                <div>Reistijd: ~2,5 uur</div>
              </div>
            </div>
          `;
          return div;
        };
        routeInfo.addTo(map);

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading OpenStreetMap:', error);
      }
    };

    initMap();

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleRouteOptimization = async () => {
    if (mapInstance && mapInstance.routeLine) {
      try {
        // Import Leaflet
        const L = await import('leaflet');
        
        // Simulate route optimization with Vanhaaster as start/end
        const optimizedRoute = [
          [52.7225, 6.4764], // Vanhaaster Reclamebureau - Hoogeveen (START)
          [52.7792, 6.9069], // Emmen
          [52.9967, 6.5625], // Assen
          [53.2194, 6.5665], // Groningen
          [52.7225, 6.4764]  // Vanhaaster Reclamebureau - Hoogeveen (END)
        ];
        
        // Remove existing route
        if (mapInstance.hasLayer(mapInstance.routeLine)) {
          mapInstance.removeLayer(mapInstance.routeLine);
        }
        
        // Add optimized route with different styling
        const optimizedRouteLine = L.polyline(optimizedRoute, {
          color: '#00FF00', // Green for optimized
          weight: 6,
          opacity: 0.9,
          dashArray: '5, 10'
        }).addTo(mapInstance);
        
        // Fit map to show optimized route
        mapInstance.fitBounds(optimizedRouteLine.getBounds(), { padding: [20, 20] });
        
        setRouteOptimized(true);
        
        // Show success message
        setTimeout(() => {
          setRouteOptimized(false);
          // Restore original route
          mapInstance.removeLayer(optimizedRouteLine);
          mapInstance.routeLine.addTo(mapInstance);
        }, 5000);
      } catch (error) {
        console.error('Error optimizing route:', error);
        alert('Er is een fout opgetreden bij het optimaliseren van de route.');
      }
    }
  };

  const handleAddNewLocation = () => {
    setShowNewLocationModal(true);
  };

  const handleSaveLocation = async () => {
    if (newLocation.name && newLocation.lat && newLocation.lng && newLocation.icon) {
      const lat = parseFloat(newLocation.lat);
      const lng = parseFloat(newLocation.lng);
      
      if (mapInstance && !isNaN(lat) && !isNaN(lng)) {
        try {
          // Import Leaflet
          const L = await import('leaflet');
          
          // Create custom marker
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                width: 24px; 
                height: 24px; 
                background-color: #E2017A; 
                border: 2px solid #000000; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-weight: bold; 
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                ${newLocation.icon}
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          // Add marker to map
          const marker = L.marker([lat, lng], { icon: customIcon })
            .addTo(mapInstance)
            .bindPopup(newLocation.name);

          // Reset form
          setNewLocation({ name: '', lat: '', lng: '', icon: '' });
          setShowNewLocationModal(false);
          
          // Show success message
          alert(`Locatie "${newLocation.name}" succesvol toegevoegd!`);
        } catch (error) {
          console.error('Error adding location:', error);
          alert('Er is een fout opgetreden bij het toevoegen van de locatie.');
        }
      }
    } else {
      alert('Vul alle velden in om een locatie toe te voegen.');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Route Legend */}
      <div className="absolute top-4 left-4 z-50 bg-black/90 rounded-lg shadow-lg border border-gray-700 p-3">
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

      {/* Quick Actions */}
      <div className="absolute bottom-4 left-4 z-50 bg-black/90 rounded-lg shadow-lg border border-gray-700 p-3">
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
      <div className="absolute bottom-4 right-4 z-50 bg-black/90 rounded-lg shadow-lg border border-gray-700 p-3">
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
