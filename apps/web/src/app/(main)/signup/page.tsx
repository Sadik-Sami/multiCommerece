import Link from 'next/link';

import SignUpForm from '@/components/sign-up-form';

const heroImage =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80';

export default function SignupPage() {
  return (
    <div className='bg-white'>
      <div className='mx-auto mt-8 w-full max-w-394 rounded-b-[5px] border border-t-0 border-[#eeeeee] px-7 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-[15px] font-semibold text-[#4b5966]'>Signup Page</h1>
          <p className='text-sm text-[#777777]'>
            <Link href='/' className='hover:text-[#5caf90]'>
              Home
            </Link>{' '}
            &gt; <span className='text-[#5caf90]'>Signup Page</span>
          </p>
        </div>
      </div>

      <section className='mx-auto w-full max-w-400 px-4 pb-20 pt-14'>
        <div className='mb-10 text-center'>
          <h2 className='text-[36px] font-bold text-[#4b5966]'>Create Account</h2>
          <p className='mx-auto mt-3 max-w-105 text-sm leading-6 text-[#777777]'>
            Sign up to manage your orders, wishlist and personalized shopping recommendations.
          </p>
        </div>

        <div className='mx-auto grid max-w-250 gap-6 lg:grid-cols-2'>
          <div className='rounded-[5px] border border-[#eeeeee] bg-white p-8'>
            <SignUpForm />
          </div>
          <div className='overflow-hidden rounded-[5px]'>
            <img src={heroImage} alt='Fresh vegetables in baskets' className='h-full min-h-88 w-full object-cover' />
          </div>
        </div>
      </section>
    </div>
  );
}
