import { api } from '@/api/client';
import type {
  AddToStackRequest,
  AddToStackResponse,
  Supplement,
  SupplementAutocompleteSuggestion,
  SupplementSearchResult,
  UpdateSupplementRequest,
} from '@/types/api';

export const getSupplements = () => api.get<Supplement[]>('/api/supplements');

export const getSupplement = (id: string) => api.get<Supplement>(`/api/supplements/${id}`);

function queryPath(route: 'autocomplete' | 'search', query: string): string {
  const params = new URLSearchParams({ query: query.trim() });
  return `/api/supplements/${route}?${params.toString()}`;
}

export const autocompleteSupplements = (query: string) =>
  api.get<SupplementAutocompleteSuggestion[]>(queryPath('autocomplete', query));

export const searchSupplements = (query: string) =>
  api.get<SupplementSearchResult[]>(queryPath('search', query));

export const addToStack = (req: AddToStackRequest) =>
  api.post<AddToStackResponse>('/api/stack', req);

export const updateSupplement = (id: string, req: UpdateSupplementRequest) =>
  api.put<Supplement>(`/api/supplements/${id}`, req);

export const removeSupplement = (id: string) => api.delete<void>(`/api/supplements/${id}`);
