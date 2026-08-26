/** Shared DTOs mirroring the VitalStack .NET API contracts. */

export interface Ingredient {
  name: string;
  amount: number;
  unit: string; // mg, mcg, IU, g...
  dailyValuePct?: number;
}

/** Product returned by GET /api/products/barcode/{gtin14}. */
export interface Product {
  id: number;
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

export type ScheduleTimeBlock = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

/** POST /api/stack — add one catalog product to the authenticated user's stack. */
export type AddToStackRequest = {
  supplementProductId: number;
  servingMultiplier?: number;
  intendedTime?: ScheduleTimeBlock | null;
  contextualInstruction?: string | null;
};

export type AddToStackResponse = {
  userId: string;
  supplementProductId: number | null;
  supplementProduct: unknown | null;
  customName: string | null;
  cusomization: {
    form: string | null;
    dosage: string | null;
    brand: string | null;
    timeOfDayTarget: string | null;
  };
  intendedTime: ScheduleTimeBlock;
  contextualInstruction: string | null;
  servingMultiplier: number;
  isActive: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type SupplementAutocompleteSuggestion = {
  id: number;
  productName: string;
  brandName: string | null;
  thumbnailUrl: string | null;
  labelPdfUrl: string | null;
};

export type IngredientSummary = {
  name: string;
  dosageAmount: number;
  dosageUnit: string;
};

export type SupplementSearchResult = {
  id: number;
  productName: string;
  brandName: string | null;
  form: string;
  thumbnailUrl: string | null;
  labelPdfUrl: string | null;
  ingredients: IngredientSummary[];
};

/** PUT /api/supplements/{id} — edit an existing stack entry. */
export interface UpdateSupplementRequest {
  dosage: string;
  schedule: string;
}
