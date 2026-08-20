import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { getThemeColors } from '@/constants/theme';
import { SupplementCard } from '@/features/supplements/SupplementCard';
import { useSupplements } from '@/features/supplements/queries';

function EmptyStack() {
  const palette = getThemeColors(useColorScheme());

  return (
    <View className="flex-1 items-center justify-center gap-four px-three pb-six">
      <Image
        accessibilityLabel="Barcode"
        source={require('../../../assets/images/Register/barcode.png')}
        style={{ width: 54, height: 64 }}
        contentFit="cover"
        contentPosition="left"
      />

      <View className="items-center gap-two">
        <Text className="text-center text-xl font-bold text-text dark:text-dark-text">
          Nothing in your stack yet
        </Text>
        <Text className="text-center text-base text-text-muted dark:text-dark-text-muted">
          Point your camera at any supplement bottle. We’ll read the label and set up your schedule.
        </Text>
      </View>

      <View className="w-full gap-two px-three">
        <Link href="/(tabs)/scan" asChild>
          <Pressable
            accessibilityRole="button"
            className="h-12 flex-row items-center justify-center gap-two rounded-xl bg-primary px-four active:opacity-80"
          >
            <Ionicons name="scan-outline" color={palette.primaryForeground} size={24} />
            <Text className="text-base font-semibold text-primary-dark">
              Scan your first supplement
            </Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)" asChild>
          <Pressable
            accessibilityRole="button"
            className="h-12 items-center justify-center active:opacity-60"
          >
            <Text className="text-base font-semibold text-text-muted dark:text-dark-text-muted">
              Add manually
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && 'status' in error && error.status === 404;
}

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

  if (isError && isNotFoundError(error)) {
    return <EmptyStack />;
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
      contentContainerClassName={data?.length ? 'gap-three py-four' : 'grow'}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={palette.primaryForeground}
          colors={[palette.primaryForeground]}
        />
      }
      ListEmptyComponent={<EmptyStack />}
    />
  );
}
