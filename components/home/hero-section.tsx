'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroimg2.jpg" // Add a dark background luxury car image to your public folder
          alt="Luxury car background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={100}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex h-screen flex-col">
        {/* Left side content */}
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-6"
            >
              <motion.h1 
                className="text-5xl font-bold text-white md:text-7xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Find Your
                <br />
                Perfect Drive
              </motion.h1>

              <motion.p
                className="max-w-md text-lg text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Discover a wide selection of premium vehicles. From luxury cars to 
                practical family vehicles, find your dream car with us.
              </motion.p>

              {/* Contact and CTA section */}
              <motion.div
                className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2 text-white">
                  <Phone className="h-5 w-5" />
                  <span>+01 800 25923857</span>
                </div>
                <Link href="/about">
                  <Button 
                    className="w-fit bg-amber-500 px-8 text-black hover:bg-amber-400"
                  >
                    SEE MORE
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column - Premium tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden items-end justify-end lg:flex"
            >
              <div className="text-right">
                <span className="text-lg font-semibold text-amber-500">
                  Premium moments.
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-2">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`h-2 w-2 rounded-full ${
                dot === 1 ? 'bg-amber-500' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}