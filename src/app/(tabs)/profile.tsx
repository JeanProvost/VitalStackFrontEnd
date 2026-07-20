import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { useAuthStore } from '@/stores/auth';

export default function ProfileScreen() {
  const username = useAuthStore((s) => s.tokens?.username);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <Screen className="gap-four">
      <Text className="pt-four text-2xl font-bold text-fg dark:text-fg-dark">Profile</Text>

      <Card className="gap-one">
        <Text className="text-sm text-muted dark:text-muted-dark">Signed in as</Text>
        <Text className="text-base font-semibold text-fg dark:text-fg-dark">
          {username ?? 'Unknown'}
        </Text>
      </Card>

      <View className="mt-auto pb-four">
        <Button label="Sign out" variant="danger" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}
