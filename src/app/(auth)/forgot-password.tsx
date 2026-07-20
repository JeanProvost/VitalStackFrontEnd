import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { confirmForgotPassword, forgotPassword } from '@/auth/cognito';
import { useUIStore } from '@/stores/ui';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onRequest() {
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setStage('reset');
      showToast('Check your email for a reset code', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not send code', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function onReset() {
    setSubmitting(true);
    try {
      await confirmForgotPassword(email.trim(), code.trim(), password);
      showToast('Password reset — please sign in', 'success');
      router.replace('/(auth)/login');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not reset password', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll className="justify-center gap-four">
      <View className="gap-one">
        <Text className="text-3xl font-bold text-fg dark:text-fg-dark">Reset password</Text>
        <Text className="text-base text-muted dark:text-muted-dark">
          {stage === 'request'
            ? 'Enter your email to get a reset code.'
            : `Enter the code sent to ${email} and a new password.`}
        </Text>
      </View>

      {stage === 'request' ? (
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
          <Button label="Send reset code" loading={submitting} onPress={onRequest} />
        </>
      ) : (
        <>
          <Input
            label="Reset code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            placeholder="123456"
          />
          <Input
            label="New password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="At least 8 characters"
          />
          <Button label="Reset password" loading={submitting} onPress={onReset} />
        </>
      )}

      <Link href="/(auth)/login" className="text-center text-sm text-brand">
        Back to sign in
      </Link>
    </Screen>
  );
}
