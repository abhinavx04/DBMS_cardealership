'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { CarListingSummary } from '@/components/dashboard/car-listing-summary';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarListing } from '@/types/car-listing';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [listings, setListings] = useState<CarListing[]>([]);
  const [savedListings, setSavedListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    if (!user) {
      router.push('/auth/login');
      return;
    }

    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Fetch user's listings
        const { data: userListings, error: listingsError } = await supabase
          .from('car_listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (listingsError) throw listingsError;
        setListings(userListings || []);
        
        // Fetch saved listings
        const { data: saved, error: savedError } = await supabase
          .from('saved_listings')
          .select('listing_id')
          .eq('user_id', user.id)
          .limit(10);
          
        if (savedError) throw savedError;
        
        if (saved && saved.length > 0) {
          const listingIds = saved.map(item => item.listing_id);
          
          const { data: savedCars, error: savedCarsError } = await supabase
            .from('car_listings')
            .select('*')
            .in('id', listingIds)
            .limit(3);
            
          if (savedCarsError) throw savedCarsError;
          setSavedListings(savedCars || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, router]);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manage your car listings and saved vehicles</p>
      </div>
      
      <div className="mb-8">
        <DashboardStats />
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Listings</CardTitle>
              <CardDescription>Vehicles you're currently selling</CardDescription>
            </div>
            <Link href="/dashboard/create-listing">
              <Button>Create Listing</Button>
            </Link>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <CarListingSummary key={listing.id} listing={listing} />
                ))}
                
                <div className="pt-2 text-center">
                  <Link href="/dashboard/my-listings">
                    <Button variant="outline">View All My Listings</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  You don't have any listings yet
                </p>
                <Link href="/dashboard/create-listing">
                  <Button>Create Your First Listing</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Saved Vehicles</CardTitle>
              <CardDescription>Cars you've saved for later</CardDescription>
            </div>
            <Link href="/dashboard/wishlist">
              <Button variant="outline">View All</Button>
            </Link>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedListings.length > 0 ? (
              <div className="space-y-4">
                {savedListings.map((listing) => (
                  <CarListingSummary key={listing.id} listing={listing} showSaveButton={false} />
                ))}
                
                <div className="pt-2 text-center">
                  <Link href="/dashboard/wishlist">
                    <Button variant="outline">View All Saved Vehicles</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't saved any vehicles yet
                </p>
                <Link href="/marketplace">
                  <Button>Browse Vehicles</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}