import Link from 'next/link';

import SignInForm from '@/components/sign-in-form';

const heroImage =
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80';

export default function LoginPage() {
  return (
    <div className='bg-white'>
      <div className='mx-auto mt-8 w-full max-w-[1576px] rounded-b-[5px] border border-t-0 border-[#eeeeee] px-7 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-[15px] font-semibold text-[#4b5966]'>Login Page</h1>
          <p className='text-sm text-[#777777]'>
            <Link href='/' className='hover:text-[#5caf90]'>
              Home
            </Link>{' '}
            &gt; <span className='text-[#5caf90]'>Login Page</span>
          </p>
        </div>
      </div>

      <section className='mx-auto w-full max-w-[1600px] px-4 pb-20 pt-14'>
        <div className='mb-10 text-center'>
          <h2 className='text-[36px] font-bold text-[#4b5966]'>Login</h2>
          <p className='mx-auto mt-3 max-w-[360px] text-sm leading-6 text-[#777777]'>
            Get access to your Orders, Wishlist and Recommendations.
          </p>
        </div>

        <div className='mx-auto grid max-w-[1000px] gap-6 lg:grid-cols-2'>
          <div className='rounded-[5px] border border-[#eeeeee] bg-white p-8'>
            <SignInForm />
          </div>
          <div className='overflow-hidden rounded-[5px]'>
            <img src={heroImage} alt='Farmer carrying produce' className='h-full min-h-[352px] w-full object-cover' />
          </div>
        </div>
      </section>
    </div>
  );
}
