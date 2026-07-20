import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import type { Supplement } from '@/types/api';

export function SupplementCard({ supplement }: { supplement: Supplement }) {
  return (
    <Link href={`/supplement/${supplement.id}`} asChild>
      <Pressable accessibilityRole="button">
        <Card className="flex-row items-center gap-three">
          {supplement.imageUrl ? (
            <Image
              source={{ uri: supplement.imageUrl }}
              style={{ width: 48, height: 48, borderRadius: 12 }}
              contentFit="cover"
            />
          ) : (
            <View className="h-12 w-12 rounded-xl bg-brand/15" />
          )}
          <View className="flex-1">
            <Text className="text-base font-semibold text-fg dark:text-fg-dark" numberOfLines={1}>
              {supplement.name}
            </Text>
            <Text className="text-sm text-muted dark:text-muted-dark" numberOfLines={1}>
              {supplement.brand} · {supplement.dosage}
            </Text>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
