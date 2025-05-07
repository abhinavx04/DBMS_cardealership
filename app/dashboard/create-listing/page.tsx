'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const formSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce
    .number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  mileage: z.coerce.number().min(0, 'Mileage cannot be negative').optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type CreateListingFormValues = z.infer<typeof formSchema>;

const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const transmissionTypes = ['Automatic', 'Manual'];
const categories = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Van', 'Luxury'];

export default function CreateListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<CreateListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      description: '',
      images: [],
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to upload images',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Verify auth status
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        throw new Error('Authentication required');
      }

      setUploadingImages(true);
      const files = Array.from(e.target.files);
      const newImageUrls: string[] = [];

      for (const file of files) {
        // Add file size check
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('File size too large. Maximum size is 5MB.');
        }

        // Add file type check
        if (!file.type.startsWith('image/')) {
          throw new Error('Invalid file type. Only images are allowed.');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload the file
        const { error: uploadError, data } = await supabase.storage
          .from('car-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type // Explicitly set content type
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        if (!data?.path) {
          throw new Error('Upload failed - no path returned');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(data.path);

        newImageUrls.push(publicUrl);
      }

      setImageUrls([...imageUrls, ...newImageUrls]);
      form.setValue('images', [...imageUrls, ...newImageUrls]);
      
      toast({
        title: 'Images uploaded successfully',
        description: `${files.length} image(s) have been uploaded`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error uploading images',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploadingImages(false);
    }
  }

  async function onSubmit(values: CreateListingFormValues) {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a listing',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // First check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one
      if (!existingProfile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          });

        if (createProfileError) {
          throw createProfileError;
        }
      }

      // Now create the car listing
      const { error: listingError } = await supabase
        .from('car_listings')
        .insert({
          ...values,
          user_id: user.id,
        });

      if (listingError) {
        console.error('Listing error:', listingError);
        throw listingError;
      }

      toast({
        title: 'Listing created successfully',
        description: 'Your car listing has been published',
      });

      router.push('/marketplace');
      router.refresh();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: 'Error creating listing',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Create New Listing</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Camry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Silver" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="fuel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transmissionTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Los Angeles, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your vehicle..." 
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload one or more images of your vehicle
                  </FormDescription>
                  <FormMessage />
                  {imageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-[4/3]">
                          <img
                            src={url}
                            alt={`Vehicle image ${index + 1}`}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || uploadingImages}
            >
              {isLoading ? 'Creating listing...' : 'Create Listing'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}