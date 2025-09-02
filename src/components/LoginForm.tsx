'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('ron.stoel@vanhaaster.nl');
  const [password, setPassword] = useState('SdfnjSDF432!');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Attempting login with:', { email, password });
    const result = await login({ email, password });
    console.log('Login result:', result);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center">
            <img
              src="/Vanhaaster-logo-wit-formatted.png.webp"
              alt="Vanhaaster Logo"
              className="w-48 h-auto max-w-full"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Vanhaaster dashboard
          </h2>
          <h3 className="mt-2 text-center text-xl font-medium text-[#E2017A]">
            Log in op je account
          </h3>
          <p className="mt-2 text-center text-sm text-[#E2017A]/70">
            Ron Stoel credentials zijn automatisch ingevuld
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E2017A]/50 placeholder-[#E2017A]/50 text-white bg-[#111111] rounded-t-md focus:outline-none focus:ring-[#E2017A] focus:border-[#E2017A] focus:z-10 sm:text-sm"
                placeholder="E-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E2017A]/50 placeholder-[#E2017A]/50 text-white bg-[#111111] rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-[#E2017A] focus:z-10 sm:text-sm"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-[#E2017A]/20 p-4 border border-[#E2017A]/50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-[#E2017A]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#E2017A]">
                    {error === 'Invalid email or password' ? 'Ongeldig e-mailadres of wachtwoord' : error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#E2017A] hover:bg-[#E2017A]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E2017A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Inloggen...
                </div>
              ) : (
                'Inloggen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
