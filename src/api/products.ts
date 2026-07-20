import { api } from '@/api/client';
import type { Product } from '@/types/api';

export const getProductByBarcode = (gtin14: string) =>
  api.get<Product>(`/api/products/barcode/${gtin14}`);
