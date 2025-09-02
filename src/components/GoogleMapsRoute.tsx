'use client';

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapsRouteProps {
  className?: string;
}

export const GoogleMapsRoute: React.FC<GoogleMapsRouteProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual API key
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current && google) {
          // Center on Netherlands (Emmen area)
          const center = { lat: 52.7792, lng: 6.9069 };
          
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#E2017A' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#000000' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#1a1a1a' }]
              }
            ]
          });

          mapInstanceRef.current = map;

          // Add markers for Vanhaaster locations
          const locations = [
            {
              position: { lat: 52.7225, lng: 6.4764 },
              title: 'Vanhaaster Reclamebureau - Hoogeveen',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="14" r="12" fill="#000000" stroke="#E2017A" stroke-width="3"/>
                    <text x="14" y="18" text-anchor="middle" fill="#E2017A" font-size="14" font-weight="bold">V</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(28, 28)
              }
            },
            {
              position: { lat: 52.7792, lng: 6.9069 },
              title: 'Wildlands Adventure Zoo - Emmen',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#E2017A" stroke="#000000" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">W</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24)
              }
            },
            {
              position: { lat: 52.9967, lng: 6.5625 },
              title: 'Assen Centrum',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#E2017A" stroke="#000000" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">A</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24)
              }
            },
            {
              position: { lat: 53.2194, lng: 6.5665 },
              title: 'Educatieve bebording - Groningen',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#E2017A" stroke="#000000" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">E</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24)
              }
            }
          ];

          // Add markers
          locations.forEach(location => {
            new google.maps.Marker({
              position: location.position,
              map,
              title: location.title,
              icon: location.icon
            });
          });

          // Add route from Emmen to Groningen
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#E2017A',
              strokeWeight: 4,
              strokeOpacity: 0.8
            }
          });

          const request = {
            origin: { lat: 52.7225, lng: 6.4764 }, // Vanhaaster Reclamebureau - Hoogeveen
            destination: { lat: 52.7225, lng: 6.4764 }, // Vanhaaster Reclamebureau - Hoogeveen (return)
            waypoints: [
              { location: { lat: 52.7792, lng: 6.9069 } }, // Emmen
              { location: { lat: 52.9967, lng: 6.5625 } }, // Assen
              { location: { lat: 53.2194, lng: 6.5665 } }  // Groningen
            ],
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
          };

          directionsService.route(request, (result, status) => {
            if (status === 'OK') {
              directionsRenderer.setDirections(result);
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
                        <div className="absolute top-4 left-4 z-10 bg-[#111111]/80 rounded-lg shadow-lg border border-[#E2017A]/20 p-2">
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => mapInstanceRef.current?.setZoom((mapInstanceRef.current.getZoom() || 10) + 1)}
            className="w-8 h-8 bg-[#E2017A] hover:bg-[#E2017A]/80 rounded flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button 
            onClick={() => mapInstanceRef.current?.setZoom((mapInstanceRef.current.getZoom() || 10) - 1)}
            className="w-8 h-8 bg-[#E2017A] hover:bg-[#E2017A]/80 rounded flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button 
            onClick={() => mapInstanceRef.current?.panTo({ lat: 52.7792, lng: 6.9069 })}
            className="w-8 h-8 bg-[#E2017A] hover:bg-[#E2017A]/80 rounded flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

                        {/* Route Legend */}
                  <div className="absolute top-4 right-4 z-10 bg-[#111111]/80 rounded-lg shadow-lg border border-[#E2017A]/20 p-3">
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

      {/* Google Maps */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

                        {/* Route Info Panel */}
                  <div className="absolute bottom-4 left-4 bg-[#111111]/80 rounded-lg shadow-lg border border-[#E2017A]/20 p-3 max-w-xs">
        <div className="text-sm font-medium text-white mb-2">Huidige route</div>
        <div className="space-y-1 text-xs text-[#E2017A]">
          <div>• Wildlands Adventure Zoo → 10:00</div>
          <div>• Educatieve bebording → 14:00</div>
          <div>• Assen Centrum → 16:00</div>
        </div>
        <div className="mt-2 pt-2 border-t border-[#E2017A]/20">
          <div className="flex justify-between text-xs">
            <span className="text-[#E2017A]/60">Totale tijd:</span>
            <span className="text-white">6,5 uur</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#E2017A]/60">Afstand:</span>
            <span className="text-white">127 km</span>
          </div>
        </div>
      </div>

                        {/* Traffic Info */}
                  <div className="absolute bottom-4 right-4 bg-[#111111]/80 rounded-lg shadow-lg border border-[#E2017A]/20 p-3">
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
                    <span className="font-medium">Wildlands Adventure Zoo</span>
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
                    <span className="font-medium">Assen Centrum</span>
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
                    <span className="font-medium">Educatieve bebording</span>
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
  );
};
