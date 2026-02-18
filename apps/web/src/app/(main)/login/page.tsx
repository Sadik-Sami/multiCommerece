import Link from 'next/link';

import SignInForm from '@/components/sign-in-form';

const heroImage =
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80';

export default function LoginPage() {
  return (
    <div className='bg-background'>
      <div className='mx-auto mt-8 w-full max-w-394 rounded-b-md border border-t-0 border-border px-7 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-sm font-semibold text-foreground'>Login Page</h1>
          <p className='text-sm text-muted-foreground'>
            <Link href='/' className='hover:text-primary'>
              Home
            </Link>{' '}
            &gt; <span className='text-primary'>Login Page</span>
          </p>
        </div>
      </div>

      <section className='mx-auto w-full max-w-400 px-4 pb-20 pt-14'>
        <div className='mb-10 text-center'>
          <h2 className='text-3xl font-bold text-foreground md:text-4xl'>Login</h2>
          <p className='mx-auto mt-3 max-w-90 text-sm leading-6 text-muted-foreground'>
            Get access to your Orders, Wishlist and Recommendations.
          </p>
        </div>

        <div className='mx-auto grid max-w-250 gap-6 lg:grid-cols-2'>
          <div className='rounded-md border border-border bg-card p-8 shadow-sm'>
            <SignInForm />
          </div>
          <div className='overflow-hidden rounded-md border border-border'>
            <img src={heroImage} alt='Farmer carrying produce' className='h-full min-h-88 w-full object-cover' />
          </div>
        </div>
      </section>
    </div>
  );
}
