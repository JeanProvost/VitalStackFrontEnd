import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const showToast = useUIStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <Screen scroll className="justify-center gap-four">
      <View className="gap-one">
        <Text className="text-3xl font-bold text-fg dark:text-fg-dark">Welcome back</Text>
        <Text className="text-base text-muted dark:text-muted-dark">Sign in to your stack.</Text>
      </View>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      <Button label="Sign in" loading={submitting} onPress={onSubmit} />

      <View className="flex-row justify-between">
        <Link href="/(auth)/forgot-password" className="text-sm text-brand">
          Forgot password?
        </Link>
        <Link href="/(auth)/signup" className="text-sm text-brand">
          Create account
        </Link>
      </View>
    </Screen>
  );
}
