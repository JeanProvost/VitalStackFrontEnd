import { api } from '@/api/client';
import type { AddToStackRequest, Supplement, UpdateSupplementRequest } from '@/types/api';

export const getSupplements = () => api.get<Supplement[]>('/api/supplements');

export const getSupplement = (id: string) => api.get<Supplement>(`/api/supplements/${id}`);

export const addToStack = (req: AddToStackRequest) => api.post<Supplement>('/api/stack', req);

export const updateSupplement = (id: string, req: UpdateSupplementRequest) =>
  api.put<Supplement>(`/api/supplements/${id}`, req);

export const removeSupplement = (id: string) => api.delete<void>(`/api/supplements/${id}`);
