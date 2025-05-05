'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CarListingCard } from '@/components/cars/car-listing-card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { CarListing } from '@/types/car-listing';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CarListings() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  
  // Get filter values from URL
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minYear = searchParams.get('minYear');
  const maxYear = searchParams.get('maxYear');

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        
        // Start building the query
        let query = supabase
          .from('car_listings')
          .select('*', { count: 'exact' });
        
        // Apply filters
        if (brand) {
          query = query.eq('brand', brand);
        }
        
        if (category) {
          query = query.eq('category', category);
        }
        
        if (minPrice) {
          query = query.gte('price', parseInt(minPrice));
        }
        
        if (maxPrice) {
          query = query.lte('price', parseInt(maxPrice));
        }
        
        if (minYear) {
          query = query.gte('year', parseInt(minYear));
        }
        
        if (maxYear) {
          query = query.lte('year', parseInt(maxYear));
        }
        
        // Apply sorting
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'oldest') {
          query = query.order('created_at', { ascending: true });
        } else if (sortBy === 'price_low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price_high') {
          query = query.order('price', { ascending: false });
        } else if (sortBy === 'year_new') {
          query = query.order('year', { ascending: false });
        } else if (sortBy === 'year_old') {
          query = query.order('year', { ascending: true });
        }
        
        // Apply pagination
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Execute the query
        const { data, count, error } = await query
          .range(from, to);
          
        if (error) throw error;
        
        setListings(data || []);
        
        // Calculate total pages
        if (count !== null) {
          setTotalPages(Math.ceil(count / itemsPerPage));
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [brand, category, minPrice, maxPrice, minYear, maxYear, sortBy, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        
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
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-muted-foreground">
          {listings.length === 0 
            ? 'No vehicles found' 
            : `Showing ${listings.length} vehicles`}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="year_new">Year: New to Old</SelectItem>
              <SelectItem value="year_old">Year: Old to New</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="mb-4 text-xl font-semibold">No vehicles found</p>
          <p className="text-muted-foreground">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <CarListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}