'use client';

import { useEffect, useState } from 'react';
import { Car, Heart, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';

export function DashboardStats() {
  const user = useUser();
  const [stats, setStats] = useState({
    totalListings: 0,
    savedCars: 0,
    activeSales: 0,
    viewsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      try {
        // Get user's listings count
        const { count: listingsCount, error: listingsError } = await supabase
          .from('car_listings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        // Get saved listings count
        const { count: savedCount, error: savedError } = await supabase
          .from('saved_listings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        // In a real app, you might have separate tables for sales and views
        // Here we're using mock data for demonstration
        
        setStats({
          totalListings: listingsCount || 0,
          savedCars: savedCount || 0,
          activeSales: Math.floor(Math.random() * 5), // Mock data
          viewsToday: Math.floor(Math.random() * 50), // Mock data
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Listings"
        value={stats.totalListings}
        icon={<Car className="h-5 w-5" />}
        loading={loading}
      />
      <StatCard
        title="Saved Cars"
        value={stats.savedCars}
        icon={<Heart className="h-5 w-5" />}
        loading={loading}
      />
      <StatCard
        title="Pending Sales"
        value={stats.activeSales}
        icon={<DollarSign className="h-5 w-5" />}
        loading={loading}
      />
      <StatCard
        title="Views Today"
        value={stats.viewsToday}
        icon={<Eye className="h-5 w-5" />}
        loading={loading}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
}

function StatCard({ title, value, icon, loading = false }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">
            {loading ? '-' : value}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}