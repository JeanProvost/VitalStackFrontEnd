import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { autocompleteSupplements, searchSupplements } from '@/api/supplements';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { getThemeColors } from '@/constants/theme';
import { useAddToStack } from '@/features/scan/queries';
import { useSupplements } from '@/features/supplements/queries';
import { cn } from '@/lib/utils';
import type { SupplementAutocompleteSuggestion, SupplementSearchResult } from '@/types/api';

function useDebouncedValue(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function ProductThumbnail({
  productName,
  thumbnailUrl,
  compact = false,
}: {
  productName: string;
  thumbnailUrl: string | null;
  compact?: boolean;
}) {
  const palette = getThemeColors(useColorScheme());

  return (
    <View
      accessibilityLabel={
        thumbnailUrl ? `${productName} label image` : `${productName} image unavailable`
      }
      accessibilityRole="image"
      className={cn(
        'items-center justify-center overflow-hidden rounded-lg bg-bg dark:bg-dark-bg',
        compact ? 'h-12 w-10' : 'h-24 w-20',
      )}
    >
      <Ionicons name="image-outline" color={palette.textMuted} size={compact ? 18 : 24} />
      {thumbnailUrl ? (
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ position: 'absolute', inset: 0 }}
          contentFit="contain"
          transition={200}
        />
      ) : null}
    </View>
  );
}

function SearchSuggestion({
  suggestion,
  onPress,
}: {
  suggestion: SupplementAutocompleteSuggestion;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center gap-three border-b border-border px-three py-three last:border-b-0 dark:border-dark-border"
      onPress={onPress}
    >
      <ProductThumbnail
        compact
        productName={suggestion.productName}
        thumbnailUrl={suggestion.thumbnailUrl}
      />
      <View className="flex-1 gap-one">
        <Text className="text-base font-semibold text-text dark:text-dark-text">
          {suggestion.productName}
        </Text>
        {suggestion.brandName ? (
          <Text className="text-xs text-text-muted dark:text-dark-text-muted">
            {suggestion.brandName}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function LabelPreview({
  productName,
  thumbnailUrl,
  visible,
  onClose,
}: {
  productName: string;
  thumbnailUrl: string;
  visible: boolean;
  onClose: () => void;
}) {
  const palette = getThemeColors(useColorScheme());

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel={`Dismiss ${productName} label preview`}
        accessibilityRole="button"
        className="flex-1 items-center justify-center bg-text/80 px-three py-six"
        onPress={onClose}
      >
        <Pressable
          accessibilityViewIsModal
          className="h-5/6 w-full max-w-3xl overflow-hidden rounded-2xl bg-surface p-two dark:bg-dark-surface"
          onPress={(event) => event.stopPropagation()}
        >
          <Image
            accessibilityLabel={`${productName} enlarged label`}
            source={{ uri: thumbnailUrl }}
            style={{ flex: 1, width: '100%' }}
            contentFit="contain"
            transition={200}
          />
          <Pressable
            accessibilityLabel={`Close ${productName} label preview`}
            accessibilityRole="button"
            className="absolute right-three top-three h-12 w-12 items-center justify-center rounded-full bg-text/80 active:opacity-70"
            onPress={onClose}
          >
            <Ionicons name="close" color={palette.surface} size={24} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SearchResult({ result }: { result: SupplementSearchResult }) {
  const palette = getThemeColors(useColorScheme());
  const addToStack = useAddToStack();
  const [isLabelPreviewVisible, setIsLabelPreviewVisible] = useState(false);
  const thumbnailUrl = result.thumbnailUrl;

  return (
    <>
      <Card className="gap-three">
        <View className="flex-row items-start gap-three">
          <ProductThumbnail productName={result.productName} thumbnailUrl={thumbnailUrl} />
          <View className="flex-1 gap-two">
            <View className="flex-row items-start gap-two">
              <View className="flex-1 gap-one">
                <Text className="text-lg font-semibold text-text dark:text-dark-text">
                  {result.productName}
                </Text>
                <Text className="text-xs text-text-muted dark:text-dark-text-muted">
                  {[result.brandName, result.form].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Pressable
                accessibilityLabel={`Add ${result.productName} to stack`}
                accessibilityRole="button"
                accessibilityState={{ disabled: addToStack.isPending, busy: addToStack.isPending }}
                className="h-12 w-12 items-center justify-center rounded-full bg-tertiary active:opacity-80"
                disabled={addToStack.isPending}
                onPress={() => addToStack.mutate({ supplementProductId: result.id })}
              >
                {addToStack.isPending ? (
                  <ActivityIndicator color={palette.tertiaryForeground} />
                ) : (
                  <Ionicons name="add" color={palette.tertiaryForeground} size={24} />
                )}
              </Pressable>
            </View>
            {thumbnailUrl ? (
              <Pressable
                accessibilityLabel={`View ${result.productName} label`}
                accessibilityRole="button"
                className="flex-row items-center gap-one self-start py-one active:opacity-60"
                onPress={() => setIsLabelPreviewVisible(true)}
              >
                <Ionicons name="expand-outline" color={palette.info} size={18} />
                <Text className="text-xs font-semibold text-info">View label</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
        {result.ingredients.length > 0 ? (
          <View className="gap-one">
            {result.ingredients.map((ingredient) => (
              <Text
                key={`${ingredient.name}-${ingredient.dosageAmount}-${ingredient.dosageUnit}`}
                className="text-base text-text-muted dark:text-dark-text-muted"
              >
                {ingredient.name}: {ingredient.dosageAmount} {ingredient.dosageUnit}
              </Text>
            ))}
          </View>
        ) : (
          <Text className="text-base text-text-muted dark:text-dark-text-muted">
            No active ingredients listed.
          </Text>
        )}
      </Card>
      {thumbnailUrl ? (
        <LabelPreview
          productName={result.productName}
          thumbnailUrl={thumbnailUrl}
          visible={isLabelPreviewVisible}
          onClose={() => setIsLabelPreviewVisible(false)}
        />
      ) : null}
    </>
  );
}

/** Home summary: stack size + a shortcut into scanning. */
export function Dashboard() {
  const router = useRouter();
  const palette = getThemeColors(useColorScheme());
  const { data, isLoading } = useSupplements();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, 300);
  const count = data?.length ?? 0;

  const autocomplete = useQuery({
    queryKey: ['supplement-autocomplete', 'label-assets-v1', debouncedQuery],
    queryFn: () => autocompleteSupplements(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
  });

  const search = useQuery({
    queryKey: ['supplement-search', 'label-assets-v1', submittedQuery],
    queryFn: () => searchSupplements(submittedQuery),
    enabled: submittedQuery.length > 0,
  });

  const suggestionsAreCurrent =
    showSuggestions && trimmedQuery.length >= 3 && debouncedQuery === trimmedQuery;

  const submitSearch = (nextQuery = trimmedQuery) => {
    const normalizedQuery = nextQuery.trim();
    if (!normalizedQuery) return;

    setQuery(normalizedQuery);
    setSubmittedQuery(normalizedQuery);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-four pb-six pt-four"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-one">
        <Text className="text-3xl font-bold text-text dark:text-dark-text">VitalStack</Text>
        <Text className="text-base text-text-muted dark:text-dark-text-muted">
          Optimize your supplement routine.
        </Text>
      </View>

      <Card className="gap-two">
        <Text className="text-sm text-text-muted dark:text-dark-text-muted">
          Supplements in your stack
        </Text>
        <Text className="text-3xl font-bold text-text dark:text-dark-text">
          {isLoading ? '—' : count}
        </Text>
      </Card>

      <Button label="Scan a supplement" onPress={() => router.push('/(tabs)/scan')} />

      <View className="gap-three">
        <Text className="text-lg font-semibold text-text dark:text-dark-text">
          Find a supplement
        </Text>
        <Input
          accessibilityLabel="Search supplements"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Product, ingredient, or brand"
          returnKeyType="search"
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onSubmitEditing={() => submitSearch()}
        />

        {suggestionsAreCurrent && autocomplete.isFetching ? (
          <ActivityIndicator color={palette.textMuted} />
        ) : null}

        {suggestionsAreCurrent && autocomplete.isError ? (
          <Text className="text-base text-error">
            {autocomplete.error instanceof Error
              ? autocomplete.error.message
              : 'Could not load suggestions.'}
          </Text>
        ) : null}

        {suggestionsAreCurrent && autocomplete.data?.length ? (
          <View className="overflow-hidden rounded-xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface">
            {autocomplete.data.map((suggestion) => (
              <SearchSuggestion
                key={suggestion.id}
                suggestion={suggestion}
                onPress={() => submitSearch(suggestion.productName)}
              />
            ))}
          </View>
        ) : null}

        <Button
          label="Search"
          variant="secondary"
          disabled={!trimmedQuery}
          onPress={() => submitSearch()}
        />
      </View>

      {submittedQuery ? (
        <View className="gap-three">
          <Text className="text-lg font-semibold text-text dark:text-dark-text">
            Results for “{submittedQuery}”
          </Text>

          {search.isLoading ? <ActivityIndicator color={palette.textMuted} /> : null}

          {search.isError ? (
            <View className="items-center gap-three py-four">
              <Text className="text-center text-base text-error">
                {search.error instanceof Error
                  ? search.error.message
                  : 'Could not search supplements.'}
              </Text>
              <Button label="Try again" variant="secondary" onPress={() => search.refetch()} />
            </View>
          ) : null}

          {search.data?.length === 0 ? (
            <Text className="text-center text-base text-text-muted dark:text-dark-text-muted">
              No supplements found.
            </Text>
          ) : null}

          {search.data?.map((result) => (
            <SearchResult key={result.id} result={result} />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}
