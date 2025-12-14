import DiscoverDetail from '../../../components/DiscoverDetail';
import { Suspense } from 'react';

export default function DiscoverDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <DiscoverDetail />
    </Suspense>
  );
}

export async function generateMetadata({ params }) {
  // You can fetch item data here for SEO
  return {
    title: 'Discover Russia - Premium Experiences',
    description: 'Explore premium Russian experiences, hotels, restaurants, and attractions',
  };
}