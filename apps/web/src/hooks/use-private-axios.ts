'use client';

import { useMemo } from 'react';

import { privateAxios } from '@/lib/axios';

export function usePrivateAxios() {
	return useMemo(() => privateAxios, []);
}
