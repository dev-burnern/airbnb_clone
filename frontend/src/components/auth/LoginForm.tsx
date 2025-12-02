'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LoginData {
    email: string;
    password: string;
}

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API endpoint
            const response = await axios.post('http://localhost:3001/auth/login', data);
            console.log('Login success:', response.data);
            // Handle successful login (e.g., save token, redirect)
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                        {...register('email', { required: true })}
                    />
                    {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                        {...register('password', { required: true })}
                    />
                    {errors.password && <span className="text-red-500 text-xs">Password is required</span>}
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
    );
}
