import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { SupplementList } from '@/features/supplements/SupplementList';

export default function StackScreen() {
  return (
    <Screen>
      <Text className="pt-four text-2xl font-bold text-fg dark:text-fg-dark">My stack</Text>
      <SupplementList />
    </Screen>
  );
}
