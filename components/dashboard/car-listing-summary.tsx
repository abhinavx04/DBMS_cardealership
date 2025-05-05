'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { CarListing } from '@/types/car-listing';
import { SaveButton } from '@/components/cars/save-button';

interface CarListingSummaryProps {
  listing: CarListing;
  showActions?: boolean;
  showSaveButton?: boolean;
}

export function CarListingSummary({ 
  listing, 
  showActions = true,
  showSaveButton = true
}: CarListingSummaryProps) {
  const router = useRouter();
  const user = useUser();
  const { toast } = useToast();
  
  const isOwner = user && user.id === listing.user_id;
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('car_listings')
        .delete()
        .eq('id', listing.id);
        
      if (error) throw error;
      
      toast({
        title: 'Listing deleted',
        description: 'Your listing has been successfully deleted',
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting your listing. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        <Link href={`/marketplace/${listing.id}`}>
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={`${listing.brand} ${listing.model}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/marketplace/${listing.id}`} className="hover:underline">
              <h3 className="font-medium">
                {listing.brand} {listing.model}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{listing.year}</p>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(listing.price)}
              </Badge>
            </div>
          </div>
          
          {isOwner && showActions && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push(`/dashboard/edit-listing/${listing.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your listing. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          
          {showSaveButton && user && !isOwner && (
            <SaveButton listingId={listing.id} />
          )}
        </div>
      </div>
    </div>
  );
}