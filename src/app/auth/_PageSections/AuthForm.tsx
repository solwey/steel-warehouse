'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/ui/Input';

import { Icons } from '@/components/Icons';
import axios from 'axios';

import routes from '@/lib/config/routes';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/utils/analytics';
import {
  RegisterFormSchema,
  LoginFormSchema,
  LoginFormValues,
  RegisterFormValues
} from '@/lib/types/validations';
import { toast } from 'react-toastify';
import { setAuthenticated, setUser } from '@/lib/utils/auth';

interface AuthFormPropsI {
  submit_text: string;
  auth_flow: 'login' | 'register';
}

export default function AuthForm({ submit_text, auth_flow }: AuthFormPropsI) {
  const router = useRouter();

  const schema = auth_flow === 'register' ? RegisterFormSchema : LoginFormSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      auth_flow === 'register'
        ? { email: '', password: '', confirmPassword: '' }
        : { email: '', password: '' }
  });

  const {
    register,
    formState: { isSubmitting }
  } = form;

  const onSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    trackEvent({ eventName: auth_flow });

    if (auth_flow === 'register') {
      try {
        const res = await axios.post('/api/auth/register', {
          email: values.email,
          password: values.password
        });
        toast.success('Registration successful! Please log in.');
        router.push(routes.redirects.auth.toLogin);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Network or unexpected error', error);
        }
      }
    } else {
      try {
        const res = await axios.post('/api/auth/login', {
          email: values.email,
          password: values.password
        });
        setAuthenticated(true);
        console.log('Login response:', res.data);
        setUser(res.data.user);
        toast.success('Login successful');
        router.push(routes.redirects.user.toUserDashboard);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Network or unexpected error', error);
        }
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...register('email')}
                    type="text"
                    placeholder="Email"
                    className="bg-background-light dark:bg-background-dark"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                    className="bg-background-light dark:bg-background-dark"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {auth_flow === 'register' && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="Confirm Password"
                      className="bg-background-light dark:bg-background-dark"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <div>
            <Button disabled={isSubmitting} className="w-full">
              {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              <Icons.Mail className="mr-2 h-4 w-4" />
              {submit_text}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
