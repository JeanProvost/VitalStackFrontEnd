import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { getThemeColors } from '@/constants/theme';
import { SupplementCard } from '@/features/supplements/SupplementCard';
import { useSupplements } from '@/features/supplements/queries';

export function SupplementList() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useSupplements();
  const palette = getThemeColors(useColorScheme());

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={palette.textMuted} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-three px-four">
        <Text className="text-center text-base text-text-muted dark:text-dark-text-muted">
          {error instanceof Error ? error.message : 'Something went wrong.'}
        </Text>
        <Button label="Try again" variant="secondary" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SupplementCard supplement={item} />}
      contentContainerClassName="gap-three py-four"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={palette.primaryForeground}
          colors={[palette.primaryForeground]}
        />
      }
      ListEmptyComponent={
        <View className="items-center gap-two py-six">
          <Text className="text-lg font-semibold text-text dark:text-dark-text">
            Your stack is empty
          </Text>
          <Text className="text-center text-sm text-text-muted dark:text-dark-text-muted">
            Scan a supplement barcode to add your first one.
          </Text>
        </View>
      }
    />
  );
}
