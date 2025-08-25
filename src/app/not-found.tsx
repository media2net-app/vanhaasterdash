import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-lg text-gray-300 mb-8">Pagina niet gevonden</p>
        <Link
          href="/"
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Terug naar Dashboard
        </Link>
      </div>
    </div>
  );
}
