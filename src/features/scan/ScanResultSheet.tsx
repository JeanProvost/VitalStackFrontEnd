import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useAddToStack, useProductByBarcode } from '@/features/scan/queries';

interface ScanResultSheetProps {
  gtin14: string | null;
  onClose: () => void;
}

/**
 * Bottom sheet showing the product looked up from a scanned barcode.
 * ponytail: built on the native Modal instead of pulling in @gorhom/bottom-sheet — one screen
 * doesn't justify the dependency. Swap in a gesture sheet if the UX needs drag-to-dismiss.
 */
export function ScanResultSheet({ gtin14, onClose }: ScanResultSheetProps) {
  const { data: product, isLoading, isError } = useProductByBarcode(gtin14);
  const addToStack = useAddToStack();

  return (
    <Modal visible={gtin14 != null} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="gap-four rounded-t-3xl bg-bg p-four pb-six dark:bg-bg-dark"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="h-1 w-12 self-center rounded-full bg-muted/40" />

          {isLoading ? (
            <View className="items-center py-six">
              <ActivityIndicator />
            </View>
          ) : isError || !product ? (
            <View className="gap-two py-four">
              <Text className="text-lg font-semibold text-fg dark:text-fg-dark">
                Product not found
              </Text>
              <Text className="text-sm text-muted dark:text-muted-dark">
                No match for barcode {gtin14}.
              </Text>
            </View>
          ) : (
            <View className="gap-two">
              <Text className="text-sm text-muted dark:text-muted-dark">{product.brand}</Text>
              <Text className="text-xl font-bold text-fg dark:text-fg-dark">{product.name}</Text>
              <Text className="text-sm text-muted dark:text-muted-dark">
                {product.form}
                {product.servingSize ? ` · ${product.servingSize}` : ''}
              </Text>
              <Button
                label="Add to my stack"
                loading={addToStack.isPending}
                onPress={() =>
                  addToStack.mutate({ gtin14: product.gtin14 }, { onSuccess: onClose })
                }
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
