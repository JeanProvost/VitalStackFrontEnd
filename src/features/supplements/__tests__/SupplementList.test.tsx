/// <reference types="jest" />
import type { ReactNode } from 'react';
import { render } from '@testing-library/react-native';

import { SupplementList } from '@/features/supplements/SupplementList';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-image', () => ({ Image: () => null }));
jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@/features/supplements/queries', () => ({
  useSupplements: () => ({
    data: undefined,
    error: Object.assign(new Error('Not Found'), { status: 404 }),
    isError: true,
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
  }),
}));

describe('SupplementList', () => {
  it('renders the designed empty state when the stack request returns not found', async () => {
    const { getByText } = await render(<SupplementList />);

    expect(getByText('Nothing in your stack yet')).toBeTruthy();
    expect(getByText('Scan your first supplement')).toBeTruthy();
    expect(getByText('Add manually')).toBeTruthy();
  });
});
