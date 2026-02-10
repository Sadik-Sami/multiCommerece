import type { CSSProperties, ReactNode } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true,
		},
	});

	if (!session?.user) {
		redirect('/login');
	}

	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as CSSProperties
			}>
			<AppSidebar
				variant='inset'
				user={{
					name: session.user.name ?? 'User',
					email: session.user.email ?? '',
					image: session.user.image ?? undefined,
				}}
			/>
			<SidebarInset className='overflow-auto'>{children}</SidebarInset>
		</SidebarProvider>
	);
}
