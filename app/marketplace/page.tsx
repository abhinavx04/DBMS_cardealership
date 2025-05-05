import { CarListings } from '@/components/marketplace/car-listings';
import { FilterSidebar } from '@/components/marketplace/filter-sidebar';

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Browse All Vehicles</h1>
      
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-64">
          <FilterSidebar />
        </div>
        
        <div className="flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
}