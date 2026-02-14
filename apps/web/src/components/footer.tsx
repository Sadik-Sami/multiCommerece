import Link from 'next/link';

import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ShoppingBag, Twitter } from 'lucide-react';

const footerColumns = {
  category: ['Dried Fruit', 'Cookies', 'Foods', 'Fresh Fruit', 'Tuber Root', 'Vegetables'],
  company: ['About us', 'Delivery', 'Legal Notice', 'Terms & conditions', 'Secure payment', 'Contact us'],
  account: ['Sign In', 'View Cart', 'Return Policy', 'Become a Vendor', 'Affiliate Program', 'Payments'],
};

const payments = ['VISA', 'Mastercard', 'PayPal', 'Skrill', 'Maestro', 'Electron'];

export default function Footer() {
  return (
    <footer className='mt-auto border-t border-[#eeeeee] bg-white'>
      <div className='mx-auto grid w-full max-w-[1600px] gap-10 px-4 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]'>
        <div>
          <Link href='/' className='inline-flex items-center gap-2 text-[#4b5966]'>
            <span className='inline-flex size-8 items-center justify-center rounded-md bg-[#5caf90] text-white'>
              <ShoppingBag className='size-5' />
            </span>
            <span className='text-5xl font-bold leading-none'>Grabit</span>
          </Link>
          <p className='mt-6 max-w-[360px] text-[15px] leading-7 text-[#777777]'>
            Grabit is the biggest market of grocery products. Get your daily needs from our store.
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <button className='rounded bg-[#4b5966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.5px] text-white'>
              Get it on Google Play
            </button>
            <button className='rounded bg-[#4b5966] px-4 py-2 text-xs font-semibold uppercase tracking-[0.5px] text-white'>
              Download on App Store
            </button>
          </div>
        </div>

        <div>
          <h3 className='border-b border-[#eeeeee] pb-3 text-[24px] font-medium text-[#4b5966]'>Category</h3>
          <ul className='mt-4 space-y-3 text-[15px] text-[#777777]'>
            {footerColumns.category.map((item) => (
              <li key={item}>
                <Link href='#' className='hover:text-[#5caf90]'>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='border-b border-[#eeeeee] pb-3 text-[24px] font-medium text-[#4b5966]'>Company</h3>
          <ul className='mt-4 space-y-3 text-[15px] text-[#777777]'>
            {footerColumns.company.map((item) => (
              <li key={item}>
                <Link href='#' className='hover:text-[#5caf90]'>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='border-b border-[#eeeeee] pb-3 text-[24px] font-medium text-[#4b5966]'>Account</h3>
          <ul className='mt-4 space-y-3 text-[15px] text-[#777777]'>
            {footerColumns.account.map((item) => (
              <li key={item}>
                <Link href='#' className='hover:text-[#5caf90]'>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='border-b border-[#eeeeee] pb-3 text-[24px] font-medium text-[#4b5966]'>Contact</h3>
          <ul className='mt-4 space-y-4 text-[15px] text-[#777777]'>
            <li className='flex items-start gap-2'>
              <MapPin className='mt-1 size-4 text-[#5caf90]' />
              <span>2548 Broaddus Maple Court, Madisonville KY 4783, USA.</span>
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='size-4 text-[#5caf90]' />
              <a href='tel:+009876543210' className='hover:text-[#5caf90]'>
                +00 9876543210
              </a>
            </li>
            <li className='flex items-center gap-2'>
              <Mail className='size-4 text-[#5caf90]' />
              <a href='mailto:example@email.com' className='hover:text-[#5caf90]'>
                example@email.com
              </a>
            </li>
          </ul>
          <div className='mt-6 flex items-center gap-2'>
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
              <a
                key={index}
                href='#'
                className='inline-flex size-8 items-center justify-center rounded bg-[#4b5966] text-white'>
                <Icon className='size-4' />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className='border-t border-[#eeeeee] bg-[#f8f8fb]'>
        <div className='mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-4 px-4 py-4 text-[14px] text-[#777777] lg:flex-row lg:items-center'>
          <p>
            Copyright &copy; <span className='text-[#5caf90]'>Grabit</span> all rights reserved. Powered by Grabit.
          </p>
          <div className='flex flex-wrap gap-2'>
            {payments.map((payment) => (
              <span key={payment} className='rounded border border-[#dee2e6] bg-white px-2 py-1 text-[11px] font-semibold'>
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
