import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {
  useRemoveSupplement,
  useSupplement,
  useUpdateSupplement,
} from '@/features/supplements/queries';

/** Detail + inline edit (dosage/schedule) for one stack entry. */
export function SupplementDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useSupplement(id);
  const update = useUpdateSupplement(id);
  const remove = useRemoveSupplement();

  const [dosage, setDosage] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-muted dark:text-muted-dark">Supplement not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-four pt-four">
      <View className="gap-two">
        <Text className="text-sm text-muted dark:text-muted-dark">{data.brand}</Text>
        <Text className="text-2xl font-bold text-fg dark:text-fg-dark">{data.name}</Text>
      </View>

      <Input
        label="Dosage"
        value={dosage ?? data.dosage}
        onChangeText={setDosage}
        placeholder="e.g. 2 capsules"
      />
      <Input
        label="Schedule"
        value={schedule ?? data.schedule}
        onChangeText={setSchedule}
        placeholder="e.g. Daily, morning"
      />

      <Button
        label="Save changes"
        loading={update.isPending}
        onPress={() =>
          update.mutate({ dosage: dosage ?? data.dosage, schedule: schedule ?? data.schedule })
        }
      />
      <Button
        label="Remove from stack"
        variant="danger"
        loading={remove.isPending}
        onPress={() => remove.mutate(data.id, { onSuccess: () => router.back() })}
      />
    </View>
  );
}
