import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { SupplementCard } from '@/features/supplements/SupplementCard';
import { useSupplements } from '@/features/supplements/queries';

export function SupplementList() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useSupplements();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-three px-four">
        <Text className="text-center text-base text-muted dark:text-muted-dark">
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
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={
        <View className="items-center gap-two py-six">
          <Text className="text-lg font-semibold text-fg dark:text-fg-dark">
            Your stack is empty
          </Text>
          <Text className="text-center text-sm text-muted dark:text-muted-dark">
            Scan a supplement barcode to add your first one.
          </Text>
        </View>
      }
    />
  );
}
