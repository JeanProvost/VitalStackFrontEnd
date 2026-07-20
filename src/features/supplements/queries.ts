import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getSupplement,
  getSupplements,
  removeSupplement,
  updateSupplement,
} from '@/api/supplements';
import { useUIStore } from '@/stores/ui';
import type { UpdateSupplementRequest } from '@/types/api';

const KEY = ['supplements'] as const;

export function useSupplements() {
  return useQuery({ queryKey: KEY, queryFn: getSupplements });
}

export function useSupplement(id: string) {
  return useQuery({ queryKey: ['supplement', id], queryFn: () => getSupplement(id), enabled: !!id });
}

export function useUpdateSupplement(id: string) {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  return useMutation({
    mutationFn: (req: UpdateSupplementRequest) => updateSupplement(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ['supplement', id] });
      showToast('Saved', 'success');
    },
    onError: (err) => showToast(err instanceof Error ? err.message : 'Could not save', 'error'),
  });
}

export function useRemoveSupplement() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);
  return useMutation({
    mutationFn: (id: string) => removeSupplement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      showToast('Removed from your stack', 'success');
    },
    onError: (err) => showToast(err instanceof Error ? err.message : 'Could not remove', 'error'),
  });
}
