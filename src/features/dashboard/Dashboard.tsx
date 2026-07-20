import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useSupplements } from '@/features/supplements/queries';

/** Home summary: stack size + a shortcut into scanning. */
export function Dashboard() {
  const router = useRouter();
  const { data, isLoading } = useSupplements();
  const count = data?.length ?? 0;

  return (
    <View className="flex-1 gap-four pt-four">
      <View className="gap-one">
        <Text className="text-3xl font-bold text-fg dark:text-fg-dark">VitalStack</Text>
        <Text className="text-base text-muted dark:text-muted-dark">
          Optimize your supplement routine.
        </Text>
      </View>

      <Card className="gap-two">
        <Text className="text-sm text-muted dark:text-muted-dark">Supplements in your stack</Text>
        <Text className="text-3xl font-bold text-fg dark:text-fg-dark">
          {isLoading ? '—' : count}
        </Text>
      </Card>

      <Button label="Scan a supplement" onPress={() => router.push('/(tabs)/scan')} />
    </View>
  );
}
