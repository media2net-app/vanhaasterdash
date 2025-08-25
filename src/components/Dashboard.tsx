'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Vanhaaster Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welkom, <span className="font-semibold">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Gebruikersinformatie</dt>
                      <dd className="text-lg font-medium text-gray-900">{user?.name}</dd>
                      <dd className="text-sm text-gray-500">{user?.email}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                                              <dt className="text-sm font-medium text-gray-500 truncate">Totaal Weergaven</dt>
                      <dd className="text-lg font-medium text-gray-900">2,847</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                                              <dt className="text-sm font-medium text-gray-500 truncate">Laatste Activiteit</dt>
                                              <dd className="text-lg font-medium text-gray-900">2 min geleden</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Welkom bij je Dashboard
                </h3>
                                  <div className="text-sm text-gray-500 space-y-2">
                    <p>Dit is een eenvoudig dashboard gebouwd met Next.js en React.</p>
                    <p>Inbegrepen functies:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Gebruikersauthenticatie met context</li>
                      <li>Responsive design met Tailwind CSS</li>
                      <li>TypeScript voor type veiligheid</li>
                      <li>Moderne UI componenten</li>
                      <li>Sessie persistentie</li>
                    </ul>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
