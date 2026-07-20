/// <reference types="jest" />
import { fireEvent, render } from '@testing-library/react-native';

import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders its label', async () => {
    const { getByText } = await render(<Button label="Add to stack" onPress={() => {}} />);
    expect(getByText('Add to stack')).toBeTruthy();
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Button label="Tap me" onPress={onPress} />);
    fireEvent.press(getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner instead of the label while loading', async () => {
    const { queryByText } = await render(<Button label="Loading" loading onPress={() => {}} />);
    expect(queryByText('Loading')).toBeNull();
  });
});
