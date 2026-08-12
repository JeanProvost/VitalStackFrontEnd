import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const showToast = useUIStore((state) => state.showToast);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/signup');
    }
  }

  async function onSubmit() {
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // Root guard redirects to (tabs) on success.
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Sign in failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function onSocialLogin(provider: 'Apple' | 'Google') {
    showToast(`${provider} login is not available yet`, 'info');
  }

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']} className="pb-four pt-three">
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onBack}
        className="h-12 w-12 items-center justify-center self-start rounded-full border border-border bg-surface active:opacity-70"
      >
        <Ionicons name="chevron-back" color={Colors.light.text} size={24} />
      </Pressable>

      <View className="pt-five">
        <View className="flex-row items-center gap-three">
          <Image
            source={require('../../../assets/images/Logo/icon.png')}
            contentFit="contain"
            style={{ width: 48, height: 48 }}
          />
          <Text className="text-2xl font-bold text-text">VitalStack</Text>
        </View>

        <View className="gap-five pt-three">
          <View className="gap-two">
            <Text className="text-3xl font-bold text-text">Welcome back</Text>
            <Text className="text-base text-text-muted">
              Log in to pick up your stack where you left off.
            </Text>
          </View>

          <View className="gap-three">
            <Input
              label="EMAIL"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
              placeholder="maya@fern.co"
              className="h-14 rounded-2xl px-four text-lg"
            />

            <View className="gap-two">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-text-muted">PASSWORD</Text>
                <Link
                  href="/(auth)/forgot-password"
                  className="text-sm font-semibold text-text underline"
                >
                  Forgot?
                </Link>
              </View>
              <View className="h-14 flex-row items-center rounded-2xl border border-text bg-surface px-four">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={onSubmit}
                  autoComplete="current-password"
                  secureTextEntry={!passwordVisible}
                  returnKeyType="done"
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.light.textMuted}
                  selectionColor={Colors.light.primary}
                  className="h-full flex-1 text-lg text-text"
                />
                <Pressable
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  className="items-center justify-center pl-three active:opacity-60"
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    color={Colors.light.textMuted}
                    size={24}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ busy: submitting, disabled: submitting }}
              disabled={submitting}
              onPress={onSubmit}
              className="h-14 flex-row items-center justify-center rounded-2xl bg-primary px-four active:opacity-80 disabled:opacity-50"
            >
              {submitting ? (
                <ActivityIndicator color={Colors.light.primaryForeground} />
              ) : (
                <Text className="text-lg font-semibold text-primary-dark">Log in</Text>
              )}
            </Pressable>

            <View className="flex-row items-center gap-three py-two">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-base text-text-muted">or</Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => onSocialLogin('Apple')}
              className="h-14 flex-row items-center justify-center gap-three rounded-2xl border border-border bg-surface px-four active:opacity-80"
            >
              <FontAwesome name="apple" color={Colors.light.text} size={24} />
              <Text className="text-lg font-semibold text-text">Continue with Apple</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => onSocialLogin('Google')}
              className="h-14 flex-row items-center justify-center gap-three rounded-2xl border border-border bg-surface px-four active:opacity-80"
            >
              <FontAwesome name="google" color={Colors.light.text} size={22} />
              <Text className="text-lg font-semibold text-text">Continue with Google</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="mt-auto flex-row justify-center gap-one pt-five">
        <Text className="text-sm text-text-muted">New to VitalStack?</Text>
        <Link href="/(auth)/signup" className="text-sm font-semibold text-text underline">
          Create an account
        </Link>
      </View>
    </Screen>
  );
}
