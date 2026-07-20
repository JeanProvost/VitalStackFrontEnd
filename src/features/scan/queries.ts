import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProductByBarcode } from '@/api/products';
import { addToStack } from '@/api/supplements';
import { useUIStore } from '@/stores/ui';
import type { AddToStackRequest } from '@/types/api';

export function useProductByBarcode(gtin14: string | null) {
  return useQuery({
    queryKey: ['product', gtin14],
    queryFn: () => getProductByBarcode(gtin14!),
    enabled: !!gtin14,
  });
}

export function useAddToStack() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  return useMutation({
    mutationFn: (req: AddToStackRequest) => addToStack(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements'] });
      showToast('Added to your stack', 'success');
    },
    onError: (err) => showToast(err instanceof Error ? err.message : 'Could not add', 'error'),
  });
}
