import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@supabase/auth-helpers-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CarListing } from '@/types/car-listing';
import { SaveButton } from './save-button';

interface CarListingCardProps {
  listing: CarListing;
}

export function CarListingCard({ listing }: CarListingCardProps) {
  const user = useUser();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Link href={`/marketplace/${listing.id}`}>
          <div className="h-full w-full">
            {listing.images && listing.images.length > 0 ? (
              <Image
                src={listing.images[0]}
                alt={`${listing.brand} ${listing.model}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
        </Link>
        {user && (
          <div className="absolute right-2 top-2">
            <SaveButton listingId={listing.id} />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-semibold">
              {listing.brand} {listing.model}
            </h3>
            <p className="text-sm text-muted-foreground">{listing.year}</p>
          </div>
          <Badge variant="secondary">{listing.category || 'Sedan'}</Badge>
        </div>
        
        <p className="mt-2 text-xl font-bold text-primary">
          {formatCurrency(listing.price)}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Link href={`/marketplace/${listing.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}