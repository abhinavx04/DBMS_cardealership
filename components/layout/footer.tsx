import Link from 'next/link';
import { Car, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Car className="h-6 w-6" />
              <span>AutoMarket</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Find your perfect car on AutoMarket - the premier online marketplace for buying and selling vehicles.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-muted-foreground transition-colors hover:text-primary">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Car Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace?category=suv" className="text-muted-foreground transition-colors hover:text-primary">
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=sedan" className="text-muted-foreground transition-colors hover:text-primary">
                  Sedans
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=truck" className="text-muted-foreground transition-colors hover:text-primary">
                  Trucks
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=luxury" className="text-muted-foreground transition-colors hover:text-primary">
                  Luxury Cars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AutoMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}