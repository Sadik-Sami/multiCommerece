'use client';

import { useMemo } from 'react';

import { publicAxios } from '@/lib/axios';

export function usePublicAxios() {
	return useMemo(() => publicAxios, []);
}
