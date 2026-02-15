import Link from 'next/link';
import { BadgeCheck, Building2, ClipboardList, Handshake, Store, Truck } from 'lucide-react';

import VendorSignupForm from '@/components/vendor-signup-form';

const highlights = [
	{
		icon: Store,
		title: 'Launch Your Storefront',
		description: 'Get a dedicated vendor storefront with profile verification and catalog-ready onboarding.',
	},
	{
		icon: Truck,
		title: 'Manage Orders Smoothly',
		description: 'Track order flow and coordinate fulfillment with a vendor-first dashboard experience.',
	},
	{
		icon: BadgeCheck,
		title: 'Trusted Review Process',
		description: 'Applications are reviewed securely so buyers can trust every verified vendor profile.',
	},
];

const steps = [
	{
		icon: ClipboardList,
		title: 'Submit Application',
		body: 'Tell us about your business, products, and intended categories.',
	},
	{
		icon: Handshake,
		title: 'Review & Verification',
		body: 'We verify business details, compliance, and catalog readiness.',
	},
	{
		icon: Building2,
		title: 'Storefront Setup',
		body: 'Activate your storefront and start listing with support guidance.',
	},
];

const requirements = [
	'Valid business contact email and phone number',
	'Short, clear description of your products and customers',
	'At least one intended selling category',
	'Agreement to vendor onboarding and compliance terms',
];

const faq = [
	{
		q: 'How long does approval take?',
		a: 'Most applications are reviewed within 3-5 business days. We’ll email you with next steps.',
	},
	{
		q: 'Do I need a registered business to apply?',
		a: 'We accept individual vendors and registered companies. Use the business type selector in the form.',
	},
	{
		q: 'What happens after approval?',
		a: 'You’ll receive access to your vendor dashboard to complete catalog and storefront setup.',
	},
];

export default function VendorSignupPage() {
	return (
		<div className='relative overflow-hidden bg-background'>
			<div className='absolute inset-x-0 top-0 h-96 bg-linear-to-br from-primary/10 via-transparent to-secondary/20' />

			<div className='relative mx-auto w-full max-w-330 px-4 pb-20 pt-10 md:pt-14'>
				<div className='mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/70 px-5 py-4 backdrop-blur'>
					<div>
						<h1 className='text-base font-semibold text-foreground'>Become A Vendor</h1>
						<p className='text-sm text-muted-foreground'>Submit your vendor application and start selling with confidence.</p>
					</div>
					<p className='text-sm text-muted-foreground'>
						<Link href='/' className='transition-colors hover:text-primary'>
							Home
						</Link>{' '}
						&gt; <span className='text-primary'>Vendors</span>
					</p>
				</div>

				<div className='grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
					<section className='rounded-xl border border-border bg-card shadow-sm'>
						<div className='grid gap-6 p-6 md:p-8'>
							<div>
								<div className='inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground'>
									<BadgeCheck className='size-3.5' />
									Vendor Onboarding
								</div>
								<h2 className='mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
									Grow your business on MultiCommerce
								</h2>
								<p className='mt-3 max-w-[60ch] text-sm leading-6 text-muted-foreground'>
									Complete this application to tell us about your business. We review submissions quickly and prioritize
									vendors with complete details.
								</p>
							</div>

							<div className='grid gap-4 sm:grid-cols-2'>
								{highlights.map((item) => (
									<div key={item.title} className='rounded-lg border border-border bg-muted/30 p-4 sm:p-5'>
										<div className='mb-3 inline-flex rounded-md bg-primary/10 p-2 text-primary'>
											<item.icon className='size-4' />
										</div>
										<h3 className='text-sm font-semibold text-foreground'>{item.title}</h3>
										<p className='mt-2 text-xs leading-5 text-muted-foreground'>{item.description}</p>
									</div>
								))}
							</div>

							<div className='rounded-lg border border-border bg-background/60 p-4 sm:p-5'>
								<h3 className='text-sm font-semibold text-foreground'>What you’ll need</h3>
								<ul className='mt-3 grid gap-2 text-sm text-muted-foreground'>
									{requirements.map((item) => (
										<li key={item} className='flex items-start gap-2'>
											<span className='mt-1 size-1.5 rounded-full bg-primary' />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							<div className='grid gap-4 md:grid-cols-3'>
								{steps.map((step, index) => (
									<div key={step.title} className='rounded-lg border border-border bg-muted/20 p-4'>
										<div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											<span className='flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
												{index + 1}
											</span>
											{step.title}
										</div>
										<p className='mt-3 text-xs leading-5 text-muted-foreground'>{step.body}</p>
									</div>
								))}
							</div>

							<div className='grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:p-5'>
								<h3 className='text-sm font-semibold text-foreground'>Frequently asked</h3>
								{faq.map((item) => (
									<div key={item.q}>
										<p className='text-sm font-medium text-foreground'>{item.q}</p>
										<p className='mt-1 text-xs leading-5 text-muted-foreground'>{item.a}</p>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className='rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8'>
						<h3 className='text-xl font-semibold text-foreground'>Vendor Application Form</h3>
						<p className='mt-2 text-sm text-muted-foreground'>All fields marked with * are required for application review.</p>
						<div className='mt-6'>
							<VendorSignupForm />
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
