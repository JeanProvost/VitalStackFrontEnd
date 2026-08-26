import { api } from '@/api/client';
import { addToStack, autocompleteSupplements, searchSupplements } from '@/api/supplements';
import type {
  AddToStackRequest,
  AddToStackResponse,
  SupplementAutocompleteSuggestion,
  SupplementSearchResult,
} from '@/types/api';

jest.mock('@/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('supplement search', () => {
  it('trims and encodes autocomplete queries', async () => {
    const suggestions: SupplementAutocompleteSuggestion[] = [
      { id: 123, productName: 'Magnesium Citrate', brandName: 'Example Brand' },
    ];
    jest.mocked(api.get).mockResolvedValue(suggestions);

    await expect(autocompleteSupplements('  magnesium citrate  ')).resolves.toEqual(suggestions);
    expect(api.get).toHaveBeenCalledWith('/api/supplements/autocomplete?query=magnesium+citrate');
  });

  it('uses the full search route for submitted queries', async () => {
    const results: SupplementSearchResult[] = [];
    jest.mocked(api.get).mockResolvedValue(results);

    await expect(searchSupplements('vitamin d')).resolves.toEqual(results);
    expect(api.get).toHaveBeenCalledWith('/api/supplements/search?query=vitamin+d');
  });
});

describe('addToStack', () => {
  it('posts the catalog product fields and returns the created stack entry', async () => {
    const request: AddToStackRequest = {
      supplementProductId: 1,
      servingMultiplier: 1,
      intendedTime: 'Morning',
      contextualInstruction: null,
    };
    const response: AddToStackResponse = {
      userId: 'user-1',
      supplementProductId: 1,
      supplementProduct: null,
      customName: null,
      cusomization: {
        form: null,
        dosage: null,
        brand: null,
        timeOfDayTarget: null,
      },
      intendedTime: 'Morning',
      contextualInstruction: null,
      servingMultiplier: 1,
      isActive: true,
      id: '92273866-2c83-4180-8dc9-1d80a62ad5d3',
      createdAt: '2026-08-17T12:00:00Z',
      updatedAt: '2026-08-17T12:00:00Z',
    };
    jest.mocked(api.post).mockResolvedValue(response);

    await expect(addToStack(request)).resolves.toEqual(response);
    expect(api.post).toHaveBeenCalledWith('/api/stack', request);
  });
});
