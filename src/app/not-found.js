'use client';

import { useRouter } from 'next/navigation';
import { PackageOpen, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <PackageOpen size={120} className="text-blue-500" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center">
              404
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you&apos;re looking for seems to have been misplaced in our inventory system.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none transition-colors"
          >
            <Home size={18} />
            Return to Home
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-gray-500">
        Error Code: 404 | Page Not Found
      </div>
    </div>
  );
} 