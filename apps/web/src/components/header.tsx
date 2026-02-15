'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  ChevronDown,
  Grid2x2,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/vendors', label: 'Vendors/Shops' },
  { href: '/offers', label: 'Offers' },
];

function Brand() {
  return (
    <Link href='/' className='inline-flex items-center gap-2 text-foreground'>
      <span className='inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground'>
        <ShoppingBag className='size-5' />
      </span>
      <span className='text-4xl font-bold leading-none'>Grabit</span>
    </Link>
  );
}

function AccountLink({
  href,
  label,
  value,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: typeof User;
}) {
  return (
    <Link href={href} className='inline-flex items-center gap-2 text-foreground'>
      <Icon className='size-5 text-muted-foreground' />
      <span className='flex flex-col leading-none'>
        <span className='text-[11px] font-medium uppercase tracking-[0.2px] text-muted-foreground'>{label}</span>
        <span className='mt-1 text-xs font-semibold uppercase tracking-[0.2px] text-foreground'>{value}</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className='w-full border-y border-border bg-background'>
      <div className='border-b border-border bg-muted/40'>
        <div className='mx-auto hidden h-[42px] w-full max-w-[1600px] items-center justify-between px-4 text-[13px] text-muted-foreground lg:flex'>
          <div className='flex items-center gap-6'>
            <span className='inline-flex items-center gap-2'>
              <Phone className='size-3.5' /> +91 987 654 3210
            </span>
            <span className='inline-flex items-center gap-2'>
              <Phone className='size-3.5' /> +91 987 654 3210
            </span>
          </div>
          <p>World&apos;s Fastest Online Shopping Destination</p>
          <div className='flex items-center gap-5'>
            <Link href='/help' className='hover:text-foreground'>
              Help?
            </Link>
            <Link href='/tracking' className='hover:text-foreground'>
              Track Order?
            </Link>
            <button className='inline-flex items-center gap-1 hover:text-foreground' type='button'>
              English <ChevronDown className='size-3.5' />
            </button>
            <button className='inline-flex items-center gap-1 hover:text-foreground' type='button'>
              Dollar <ChevronDown className='size-3.5' />
            </button>
          </div>
        </div>
      </div>

      <div className='mx-auto w-full max-w-[1600px] px-4 py-5'>
        <div className='flex items-center gap-4 lg:hidden'>
          <Button
            variant='outline'
            size='icon'
            className='size-10 border-border'
            onClick={() => setIsMobileOpen(true)}
            aria-label='Open navigation'>
            <Menu className='size-5' />
          </Button>
          <Brand />
        </div>

        <div className='mt-4 flex items-center lg:mt-0'>
          <div className='hidden lg:block'>
            <Brand />
          </div>

          <div className='relative ml-0 w-full lg:ml-20 lg:max-w-[640px]'>
            <Input
              type='search'
              placeholder='Search Products...'
              className='h-[52px] rounded-md border-border pr-12 text-sm placeholder:text-muted-foreground'
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
              aria-label='Search'>
              <Search className='size-5' />
            </button>
          </div>

          <div className='ml-auto hidden items-center gap-8 lg:flex'>
            <AccountLink href='/login' label='Account' value='Login' icon={User} />
            <AccountLink href='/wishlist' label='Wishlist' value='3-items' icon={Heart} />
            <AccountLink href='/cart' label='Cart' value='3-items' icon={ShoppingCart} />
          </div>
        </div>
      </div>

      <div className='hidden border-y border-border lg:block'>
        <div className='mx-auto flex h-[62px] w-full max-w-[1600px] items-center px-4'>
          <button
            type='button'
            className='inline-flex h-[50px] items-center gap-3 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
            <Grid2x2 className='size-4.5' />
            All Categories
            <ChevronDown className='size-4' />
          </button>

          <nav className='mx-auto flex items-center gap-8'>
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                  item.label === 'Offers' && 'inline-flex items-center gap-1.5',
                )}>
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type='button'
            className='inline-flex h-[50px] items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
            <MapPin className='size-4' />
            New York
            <ChevronDown className='size-4' />
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <div className='fixed inset-0 z-50 bg-black/30 lg:hidden' role='dialog' aria-modal='true'>
          <aside className='h-full w-[86%] max-w-sm bg-background px-4 py-5'>
            <div className='mb-6 flex items-center justify-between'>
              <Brand />
              <Button variant='ghost' size='icon' onClick={() => setIsMobileOpen(false)} aria-label='Close navigation'>
                <X className='size-5' />
              </Button>
            </div>
            <nav className='space-y-2'>
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className='block rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground'>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
