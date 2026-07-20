import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/Screen';
import { SupplementDetail } from '@/features/supplements/SupplementDetail';

export default function SupplementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen scroll>
      <SupplementDetail id={id} />
    </Screen>
  );
}
