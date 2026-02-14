import type { ReactNode } from 'react';

import Footer from '@/components/footer';
import Header from '@/components/header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
