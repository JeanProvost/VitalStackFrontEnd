import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { confirmSignUp, signUp } from '@/auth/cognito';
import { useUIStore } from '@/stores/ui';

export default function SignupScreen() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const [stage, setStage] = useState<'details' | 'confirm'>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSignUp() {
    setSubmitting(true);
    try {
      await signUp(email.trim(), password);
      setStage('confirm');
      showToast('We sent you a confirmation code', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Sign up failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onConfirm() {
    setSubmitting(true);
    try {
      await confirmSignUp(email.trim(), code.trim());
      showToast('Account confirmed — please sign in', 'success');
      router.replace('/(auth)/login');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Confirmation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll className="justify-center gap-four">
      <View className="gap-one">
        <Text className="text-3xl font-bold text-fg dark:text-fg-dark">Create account</Text>
        <Text className="text-base text-muted dark:text-muted-dark">
          {stage === 'details' ? 'Start optimizing your stack.' : `Enter the code sent to ${email}.`}
        </Text>
      </View>

      {stage === 'details' ? (
        <>
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
            placeholder="At least 8 characters"
          />
          <Button label="Sign up" loading={submitting} onPress={onSignUp} />
          <Link href="/(auth)/login" className="text-center text-sm text-brand">
            Already have an account? Sign in
          </Link>
        </>
      ) : (
        <>
          <Input
            label="Confirmation code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            placeholder="123456"
          />
          <Button label="Confirm account" loading={submitting} onPress={onConfirm} />
        </>
      )}
    </Screen>
  );
}
