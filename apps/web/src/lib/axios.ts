import { env } from '@multiCommerece/env/web';
import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const baseConfig = {
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
	},
};

export const publicAxios = axios.create(baseConfig);

export const privateAxios = axios.create({
	...baseConfig,
	withCredentials: true,
});

export type ApiResponse<T = unknown> = {
	success?: boolean;
	message?: string;
	error?: string;
	data?: T;
	errors?: { message: string }[];
};

export const responseBody = <T>(response: AxiosResponse<T>) => response.data;
export const errorResponse = <T = unknown>(error: AxiosError<ApiResponse<T>>) => error.response?.data;
