'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-20 text-white">
      <div className="absolute inset-0 z-0">
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40" 
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg')" }}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find Your Perfect Drive
          </h1>
          <p className="mb-8 text-lg sm:text-xl">
            Browse thousands of quality vehicles from trusted sellers. Your next car is just a click away.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Vehicles
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sell Your Car
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}