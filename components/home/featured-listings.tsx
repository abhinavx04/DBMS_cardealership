'use client';

import { useEffect, useState } from 'react';
import { CarListingCard } from '@/components/cars/car-listing-card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { CarListing } from '@/types/car-listing';

export function FeaturedListings() {
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedListings() {
      try {
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .limit(6)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedListings();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="mb-2 h-6 w-2/3" />
              <Skeleton className="mb-4 h-4 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <CarListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}