'use client';

import React, { useRef, useState } from 'react';

interface GoogleMapsRouteProps {
  className?: string;
}

export const GoogleMapsRoute: React.FC<GoogleMapsRouteProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Container */}
      <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Google Maps Route</h3>
          <div className="flex space-x-2">
            <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Route Optimaliseren
            </button>
            <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              + Nieuwe Locatie
            </button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div 
          ref={mapRef} 
          className="w-full h-96 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-[#E2017A] text-lg font-medium mb-2">Google Maps Route</div>
            <div className="text-gray-400 text-sm">Route optimalisatie met Google Maps</div>
            <div className="text-gray-500 text-xs mt-2">Hoogeveen → Emmen → Assen → Groningen</div>
          </div>
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
