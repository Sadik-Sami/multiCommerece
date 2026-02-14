'use client';

import Link from 'next/link';

import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';

import { authClient } from '@/lib/auth-client';

import Loader from './loader';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function SignInForm() {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push('/dashboard');
            toast.success('Sign in successful');
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='space-y-5'>
      <form.Field name='email'>
        {(field) => (
          <div className='space-y-2'>
            <Label htmlFor={field.name} className='text-[15px] font-medium text-[#4b5966]'>
              Email Address*
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type='email'
              placeholder='Enter your email address'
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className='h-12 rounded-[5px] border-[#dee2e6] text-[14px]'
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className='text-sm text-red-500'>
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name='password'>
        {(field) => (
          <div className='space-y-2'>
            <Label htmlFor={field.name} className='text-[15px] font-medium text-[#4b5966]'>
              Password*
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type='password'
              placeholder='Enter your password'
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className='h-12 rounded-[5px] border-[#dee2e6] text-[14px]'
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className='text-sm text-red-500'>
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <div className='text-right text-sm text-[#777777]'>Forgot Password?</div>

      <div className='flex items-center justify-between'>
        <Link href='/signup' className='text-[14px] text-[#4b5966] hover:text-[#5caf90]'>
          Create Account?
        </Link>
        <form.Subscribe>
          {(state) => (
            <Button
              type='submit'
              className='h-[37px] rounded-[5px] bg-[#4b5966] px-5 text-[14px] font-semibold text-white hover:bg-[#5c6874]'
              disabled={!state.canSubmit || state.isSubmitting}>
              {state.isSubmitting ? 'Submitting...' : 'Login'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
