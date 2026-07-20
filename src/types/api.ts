/** Shared DTOs mirroring the VitalStack .NET API contracts. */

export interface Ingredient {
  name: string;
  amount: number;
  unit: string; // mg, mcg, IU, g...
  dailyValuePct?: number;
}

/** Product returned by GET /api/products/barcode/{gtin14}. */
export interface Product {
  gtin14: string;
  name: string;
  brand: string;
  form: string; // capsule, tablet, powder, softgel...
  servingSize?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
}

/** A supplement in the user's stack (GET /api/supplements). */
export interface Supplement {
  id: string;
  productId: string;
  gtin14: string;
  name: string;
  brand: string;
  dosage: string; // e.g. "2 capsules"
  schedule: string; // e.g. "Daily, morning"
  imageUrl?: string;
  addedAt: string; // ISO 8601
}

/** POST /api/stack — add a scanned product to the user's stack. */
export interface AddToStackRequest {
  gtin14: string;
  dosage?: string;
  schedule?: string;
}

/** PUT /api/supplements/{id} — edit an existing stack entry. */
export interface UpdateSupplementRequest {
  dosage: string;
  schedule: string;
}
