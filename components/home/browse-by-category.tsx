import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    name: 'SUVs',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    url: '/marketplace?category=suv'
  },
  {
    name: 'Sedans',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    url: '/marketplace?category=sedan'
  },
  {
    name: 'Trucks',
    image: 'https://images.pexels.com/photos/2676501/pexels-photo-2676501.jpeg',
    url: '/marketplace?category=truck'
  },
  {
    name: 'Luxury',
    image: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg',
    url: '/marketplace?category=luxury'
  }
];

export function BrowseByCategory() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link key={category.name} href={category.url}>
          <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="relative h-48 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <CardContent className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">{category.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}