import type { Metadata } from 'next';

import { Google_Sans_Flex } from 'next/font/google';

import '../index.css';
import Providers from '@/components/providers';

const googleSansFlex = Google_Sans_Flex({
	variable: '--font-google-sans-flex',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'multiCommerece',
	description: 'multiCommerece',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body suppressHydrationWarning className={`${googleSansFlex.className} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
