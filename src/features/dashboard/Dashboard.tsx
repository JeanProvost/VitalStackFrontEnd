import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
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
import type { SupplementAutocompleteSuggestion, SupplementSearchResult } from '@/types/api';

function useDebouncedValue(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
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
      className="border-b border-border px-three py-three last:border-b-0 dark:border-dark-border"
      onPress={onPress}
    >
      <Text className="text-base font-semibold text-text dark:text-dark-text">
        {suggestion.productName}
      </Text>
      {suggestion.brandName ? (
        <Text className="text-xs text-text-muted dark:text-dark-text-muted">
          {suggestion.brandName}
        </Text>
      ) : null}
    </Pressable>
  );
}

function SearchResult({ result }: { result: SupplementSearchResult }) {
  const palette = getThemeColors(useColorScheme());
  const addToStack = useAddToStack();

  return (
    <Card className="gap-two">
      <View className="flex-row items-start gap-three">
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
    queryKey: ['supplement-autocomplete', debouncedQuery],
    queryFn: () => autocompleteSupplements(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
  });

  const search = useQuery({
    queryKey: ['supplement-search', submittedQuery],
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
