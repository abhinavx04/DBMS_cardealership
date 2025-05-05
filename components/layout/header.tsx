'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Car, Heart, LogIn, Menu, User as UserIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
  };

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        isTransparent 
          ? 'bg-transparent text-white' 
          : 'border-b bg-background text-foreground shadow-sm'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Car className="h-6 w-6" />
          <span>AutoMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="/marketplace" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/marketplace' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Marketplace
          </Link>
          <Link 
            href="/about" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/contact' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth/User Controls */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          
          {user ? (
            <>
              <Link href="/dashboard/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-listings">My Listings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wishlist">Saved Cars</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/marketplace" 
              className="text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="h-px bg-border" />
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/my-listings" 
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Car className="h-4 w-4" />
                  My Listings
                </Link>
                <Link 
                  href="/dashboard/wishlist" 
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  Saved Cars
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start p-0 text-sm font-medium"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full justify-start">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Button>
                </Link>
                <Link 
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full justify-start">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}