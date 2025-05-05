import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedListings } from '@/components/home/featured-listings';
import { HeroSection } from '@/components/home/hero-section';
import { BrowseByCategory } from '@/components/home/browse-by-category';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Featured Listings</h2>
        <FeaturedListings />
        
        <div className="mt-10 flex justify-center">
          <Link href="/marketplace">
            <Button size="lg" className="font-semibold">
              Browse All Vehicles
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-slate-50 py-16 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Browse By Category</h2>
          <BrowseByCategory />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight">Ready to sell your car?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Create a listing in minutes and reach thousands of potential buyers.
          </p>
          <Link href="/dashboard/create-listing">
            <Button size="lg" variant="secondary" className="font-semibold">
              Create Listing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}