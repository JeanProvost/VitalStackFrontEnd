/// <reference types="jest" />
import { useQuery } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { Dashboard } from '@/features/dashboard/Dashboard';

const mockMutate = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: jest.fn() }));

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/api/supplements', () => ({
  autocompleteSupplements: jest.fn(),
  searchSupplements: jest.fn(),
}));

jest.mock('@/features/scan/queries', () => ({
  useAddToStack: () => ({ isPending: false, mutate: mockMutate }),
}));

jest.mock('@/features/supplements/queries', () => ({
  useSupplements: () => ({ data: [], isLoading: false }),
}));

describe('Dashboard search results', () => {
  it('sends the catalog product ID to the add-to-stack mutation', async () => {
    jest.mocked(useQuery).mockReset();
    jest.mocked(useQuery).mockImplementation((options) => {
      const [queryType] = (options as { queryKey: readonly unknown[] }).queryKey;
      if (queryType === 'supplement-autocomplete') {
        return { data: [], isError: false, isFetching: false } as never;
      }

      return {
        data: [
          {
            id: 123,
            productName: 'Magnesium Citrate',
            brandName: 'Example Brand',
            form: 'Capsule',
            thumbnailUrl: null,
            labelPdfUrl: null,
            ingredients: [],
          },
          {
            id: 456,
            productName: 'Magnesium Glycinate',
            brandName: null,
            form: 'Tablet',
            thumbnailUrl: 'https://api.example.com/thumbnails/456.jpg',
            labelPdfUrl: 'https://api.example.com/labels/456.pdf',
            ingredients: [],
          },
        ],
        isError: false,
        isLoading: false,
      } as never;
    });

    const { getByLabelText, getByText, queryByLabelText } = await render(<Dashboard />);
    await fireEvent.changeText(getByLabelText('Search supplements'), 'magnesium');
    await waitFor(() => expect(getByLabelText('Search supplements').props.value).toBe('magnesium'));
    await fireEvent.press(getByText('Search'));
    const addButton = await waitFor(() => getByLabelText('Add Magnesium Citrate to stack'));
    await fireEvent.press(addButton);

    expect(mockMutate).toHaveBeenCalledWith({ supplementProductId: 123 });
    expect(getByLabelText('Magnesium Citrate image unavailable')).toBeTruthy();
    expect(getByLabelText('Magnesium Glycinate label image')).toBeTruthy();

    await fireEvent.press(getByLabelText('View Magnesium Glycinate label'));
    expect(getByLabelText('Magnesium Glycinate enlarged label')).toBeTruthy();

    await fireEvent.press(getByLabelText('Close Magnesium Glycinate label preview'));
    await waitFor(() => expect(queryByLabelText('Magnesium Glycinate enlarged label')).toBeNull());

    await fireEvent.press(getByLabelText('View Magnesium Glycinate label'));
    await fireEvent.press(getByLabelText('Dismiss Magnesium Glycinate label preview'));
    await waitFor(() => expect(queryByLabelText('Magnesium Glycinate enlarged label')).toBeNull());
  });
});
