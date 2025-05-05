'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Sample data - in a real app, you'd fetch these from the database
const brands = [
  'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 
  'Audi', 'Tesla', 'Chevrolet', 'Nissan', 'Hyundai',
];

const categories = [
  'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 
  'Hatchback', 'Wagon', 'Van', 'Luxury', 'Electric',
];

// Create the form schema
const formSchema = z.object({
  brand: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minYear: z.coerce.number().min(1900).max(2030).optional(),
  maxYear: z.coerce.number().min(1900).max(2030).optional(),
});

type FilterFormValues = z.infer<typeof formSchema>;

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize form with values from URL
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: searchParams.get('brand') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      minYear: searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined,
      maxYear: searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined,
    },
  });

  function onSubmit(values: FilterFormValues) {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams();
    
    // Add the form values to the params
    if (values.brand) params.set('brand', values.brand);
    if (values.category) params.set('category', values.category);
    if (values.minPrice) params.set('minPrice', values.minPrice.toString());
    if (values.maxPrice) params.set('maxPrice', values.maxPrice.toString());
    if (values.minYear) params.set('minYear', values.minYear.toString());
    if (values.maxYear) params.set('maxYear', values.maxYear.toString());
    
    // Navigate to the new URL
    router.push(`/marketplace?${params.toString()}`);
  }

  function handleReset() {
    form.reset({
      brand: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
    });
    
    router.push('/marketplace');
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Filter Vehicles</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Any brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Any category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <FormLabel>Price Range</FormLabel>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Min"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span>-</span>
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Max"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <FormLabel>Year Range</FormLabel>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="minYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Min"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span>-</span>
              <FormField
                control={form.control}
                name="maxYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Max"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Apply Filters</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}