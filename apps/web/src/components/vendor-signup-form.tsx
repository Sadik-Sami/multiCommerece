'use client';

import axios from 'axios';
import { PlusIcon, XIcon } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { usePrivateAxios } from '@/hooks/use-private-axios';
import type { ApiResponse } from '@/lib/axios';

import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from './ui/field';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const businessTypeOptions = ['INDIVIDUAL', 'COMPANY'] as const;

const categoryItemSchema = z.object({
	value: z
		.string()
		.trim()
		.min(2, 'Category name must be at least 2 characters.')
		.max(64, 'Category name must be at most 64 characters.'),
});

const vendorSignupSchema = z.object({
	businessName: z
		.string()
		.trim()
		.min(2, 'Business name must be at least 2 characters.')
		.max(120, 'Business name is too long.'),
	businessType: z.enum(businessTypeOptions),
	description: z
		.string()
		.trim()
		.min(20, 'Description should be at least 20 characters.')
		.max(1200, 'Description is too long.'),
	contactEmail: z.string().email('Enter a valid contact email.'),
	contactPhone: z
		.string()
		.trim()
		.min(7, 'Enter a valid phone number.')
		.max(20, 'Phone number is too long.')
		.regex(/^[0-9+()\-\s]+$/, 'Phone number contains invalid characters.'),
	intendedCategories: z
		.array(categoryItemSchema)
		.min(1, 'Add at least one category.')
		.max(8, 'You can add up to 8 categories.'),
	termsAccepted: z.boolean().refine((value) => value, {
		message: 'You must accept the terms to continue.',
	}),
});

type VendorSignupFormValues = z.infer<typeof vendorSignupSchema>;

const vendorApplicationResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
		error: z.string().optional(),
	})
	.passthrough();

const defaultValues: VendorSignupFormValues = {
	businessName: '',
	businessType: 'INDIVIDUAL',
	description: '',
	contactEmail: '',
	contactPhone: '',
	intendedCategories: [{ value: '' }],
	termsAccepted: false,
};

function getErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as { message?: string; error?: string } | undefined;
		return data?.message || data?.error || error.message || 'Failed to submit vendor application.';
	}

	return 'Failed to submit vendor application.';
}

export default function VendorSignupForm() {
	const privateAxios = usePrivateAxios();

	const form = useForm<VendorSignupFormValues>({
		resolver: zodResolver(vendorSignupSchema),
		defaultValues,
		mode: 'onBlur',
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting, isValid, errors },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'intendedCategories',
	});

	const onSubmit = async (values: VendorSignupFormValues) => {
		const payload = {
			businessName: values.businessName.trim(),
			businessType: values.businessType,
			description: values.description.trim(),
			contactEmail: values.contactEmail.trim(),
			contactPhone: values.contactPhone.trim(),
			intendedCategories: values.intendedCategories.map((item) => item.value.trim()),
			termsAccepted: values.termsAccepted,
		};

		try {
		const response = await privateAxios.post<ApiResponse>('/vendors/applications', payload);
			const parsed = vendorApplicationResponseSchema.safeParse(response.data);
			if (!parsed.success) {
				toast.error('Vendor application submitted, but the response was invalid.');
				return;
			}
			if (parsed.data.success === false) {
				toast.error(parsed.data.error || parsed.data.message || 'Failed to submit vendor application.');
				return;
			}
			if (response.status >= 200 && response.status < 300) {
				toast.success(parsed.data.message || 'Application submitted. Our team will review it shortly.');
				reset(defaultValues);
				return;
			}
			toast.error(parsed.data.error || parsed.data.message || 'Failed to submit vendor application.');
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<form noValidate onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='grid gap-5 md:grid-cols-2'>
				<Controller
					name='businessName'
					control={control}
					render={({ field, fieldState }) => (
						<Field className='md:col-span-2' data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='vendor-business-name'>Business Name</FieldLabel>
							<Input
								{...field}
								id='vendor-business-name'
								autoComplete='organization'
								placeholder='Acme Retail House'
								aria-invalid={fieldState.invalid}
							/>
							<FieldDescription>This name helps our review team identify your application.</FieldDescription>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name='businessType'
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='vendor-business-type'>Business Type</FieldLabel>
							<Select
								name={field.name}
								items={businessTypeOptions.map((value) => ({ label: value, value }))}
								value={field.value}
								onValueChange={field.onChange}>
							<SelectTrigger
								id='vendor-business-type'
								className='w-full rounded-md bg-background text-sm'
								aria-invalid={fieldState.invalid}>
								<SelectValue placeholder='Select business type' />
							</SelectTrigger>
							<SelectContent className='rounded-md border bg-popover text-popover-foreground shadow-md'>
									<SelectGroup>
										{businessTypeOptions.map((option) => (
											<SelectItem key={option} value={option}>
												{option}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name='contactPhone'
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='vendor-contact-phone'>Contact Phone</FieldLabel>
							<Input
								{...field}
								id='vendor-contact-phone'
								autoComplete='tel'
								placeholder='+1 555 123 9876'
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name='contactEmail'
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='vendor-contact-email'>Contact Email</FieldLabel>
							<Input
								{...field}
								id='vendor-contact-email'
								type='email'
								autoComplete='email'
								placeholder='owner@acme.com'
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</div>

			<Controller
				name='description'
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='vendor-description'>Business Description</FieldLabel>
						<Textarea
							{...field}
							id='vendor-description'
							aria-invalid={fieldState.invalid}
							placeholder='Describe your products, unique value proposition, and customer focus.'
							className='min-h-35 resize-y'
						/>
						<FieldDescription>Include what you sell and how you serve your customers.</FieldDescription>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<FieldSet className='rounded-lg border bg-background/60 p-4 sm:p-5'>
				<FieldLegend className='mb-1'>Intended Categories</FieldLegend>
				<FieldDescription>Add the categories you plan to sell in. You can add up to 8.</FieldDescription>
				<FieldGroup className='mt-3 gap-3'>
					{fields.map((categoryField, index) => (
						<Controller
							key={categoryField.id}
							name={`intendedCategories.${index}.value`}
							control={control}
							render={({ field, fieldState }) => (
								<Field orientation='horizontal' data-invalid={fieldState.invalid}>
									<FieldContent className='flex-1'>
										<FieldLabel htmlFor={`vendor-category-${index}`} className='sr-only'>
											Category {index + 1}
										</FieldLabel>
										<Input
											{...field}
											id={`vendor-category-${index}`}
											placeholder={`Category ${index + 1} (e.g. Groceries)`}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</FieldContent>
									<Button
										type='button'
										variant='outline'
										size='icon'
										aria-label={`Remove category ${index + 1}`}
										onClick={() => remove(index)}
										disabled={fields.length === 1}>
										<XIcon className='size-4' />
									</Button>
								</Field>
							)}
						/>
					))}
				</FieldGroup>
				<div className='mt-3 flex flex-wrap items-center gap-2'>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => append({ value: '' })}
						disabled={fields.length >= 8}>
						<PlusIcon className='size-4' />
						Add Category
					</Button>
					<p className='text-muted-foreground text-xs'>{fields.length}/8 categories added</p>
				</div>
				{errors.intendedCategories?.message ?
					<FieldError className='mt-2' errors={[errors.intendedCategories]} />
				:	null}
			</FieldSet>

			<Controller
				name='termsAccepted'
				control={control}
				render={({ field, fieldState }) => (
					<Field
						orientation='horizontal'
						data-invalid={fieldState.invalid}
						className='rounded-lg border bg-background/60 p-4 sm:p-5'>
						<Checkbox
							id='vendor-terms'
							name={field.name}
							checked={field.value}
							onCheckedChange={(checked) => field.onChange(Boolean(checked))}
							aria-invalid={fieldState.invalid}
						/>
						<FieldContent>
							<FieldLabel htmlFor='vendor-terms'>
								I accept the vendor onboarding terms and compliance policy.
							</FieldLabel>
							<FieldDescription>
								By submitting, you confirm your business information is accurate and agree to our review process.
							</FieldDescription>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</FieldContent>
					</Field>
				)}
			/>

			<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
				<Button type='button' variant='outline' onClick={() => reset(defaultValues)} disabled={isSubmitting}>
					Reset
				</Button>
				<Button type='submit' disabled={isSubmitting || !isValid}>
					{isSubmitting ? 'Submitting...' : 'Submit Vendor Application'}
				</Button>
			</div>
		</form>
	);
}
