'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SaveButtonProps {
  listingId: string;
}

export function SaveButton({ listingId }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if the car is already saved
  useEffect(() => {
    async function checkSavedStatus() {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) return;
        
        const { data } = await supabase
          .from('saved_listings')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('listing_id', listingId)
          .single();
          
        setIsSaved(!!data);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    }
    
    checkSavedStatus();
  }, [listingId]);

  const toggleSave = async () => {
    try {
      setIsLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to save listings',
          variant: 'destructive',
        });
        return;
      }
      
      if (isSaved) {
        // Remove from saved
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.user.id)
          .eq('listing_id', listingId);
          
        setIsSaved(false);
        toast({
          title: 'Removed from saved',
          description: 'The listing has been removed from your saved items',
        });
      } else {
        // Add to saved
        await supabase
          .from('saved_listings')
          .insert({
            user_id: user.user.id,
            listing_id: listingId,
          });
          
        setIsSaved(true);
        toast({
          title: 'Saved!',
          description: 'The listing has been added to your saved items',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error saving this listing',
        variant: 'destructive',
      });
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-black/80 dark:hover:bg-black"
      onClick={toggleSave}
      disabled={isLoading}
    >
      <Heart 
        className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
      />
    </Button>
  );
}