import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { confirmSignUp, signUp } from '@/auth/cognito';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/theme';
import { useUIStore } from '@/stores/ui';

type SignupStage = 'method' | 'password' | 'confirm';

type SignupButtonProps = {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  loading?: boolean;
  primary?: boolean;
};

function SignupButton({ label, onPress, icon, loading, primary = false }: SignupButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: !!loading, disabled: !!loading }}
      disabled={loading}
      onPress={onPress}
      className={
        primary
          ? 'h-14 flex-row items-center justify-center gap-three rounded-2xl bg-primary px-four active:opacity-80'
          : 'h-14 flex-row items-center justify-center gap-three rounded-2xl border border-border bg-surface px-four active:opacity-80'
      }
    >
      {loading ? (
        <ActivityIndicator color={Colors.light.primaryForeground} />
      ) : (
        <>
          {icon}
          <Text
            className={
              primary
                ? 'text-lg font-semibold text-primary-dark'
                : 'text-lg font-semibold text-text'
            }
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);
  const [stage, setStage] = useState<SignupStage>('method');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function onBack() {
    if (stage === 'confirm') {
      setStage('password');
    } else if (stage === 'password') {
      setStage('method');
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  }

  function onContinueWithEmail() {
    if (!email.trim()) {
      showToast('Enter your email address', 'error');
      return;
    }

    setStage('password');
  }

  function onSocialSignup(provider: 'Apple' | 'Google') {
    showToast(`${provider} sign up is not available yet`, 'info');
  }

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

      <View className="gap-five pt-five">
        <View className="gap-two">
          <Text className="text-3xl font-bold text-text">Create your account</Text>
          <Text className="text-base text-text-muted">
            {stage === 'method'
              ? 'Your stack syncs across devices and stays private.'
              : stage === 'password'
                ? `Choose a password for ${email.trim()}.`
                : `Enter the code sent to ${email.trim()}.`}
          </Text>
        </View>

        {stage === 'method' ? (
          <View className="gap-three">
            <Input
              label="EMAIL"
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={onContinueWithEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
              placeholder="maya@fern.co"
              className="h-14 rounded-2xl border-text px-four text-lg"
            />

            <SignupButton label="Continue with email" onPress={onContinueWithEmail} primary />

            <View className="flex-row items-center gap-three py-two">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-base text-text-muted">or</Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <SignupButton
              label="Continue with Apple"
              onPress={() => onSocialSignup('Apple')}
              icon={<FontAwesome name="apple" color={Colors.light.text} size={24} />}
            />
            <SignupButton
              label="Continue with Google"
              onPress={() => onSocialSignup('Google')}
              icon={<FontAwesome name="google" color={Colors.light.text} size={22} />}
            />
          </View>
        ) : stage === 'password' ? (
          <View className="gap-three">
            <Input
              label="PASSWORD"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={onSignUp}
              autoComplete="new-password"
              secureTextEntry
              returnKeyType="done"
              placeholder="At least 8 characters"
              className="h-14 rounded-2xl border-text px-four text-lg"
            />
            <SignupButton label="Create account" loading={submitting} onPress={onSignUp} primary />
          </View>
        ) : (
          <View className="gap-three">
            <Input
              label="CONFIRMATION CODE"
              value={code}
              onChangeText={setCode}
              onSubmitEditing={onConfirm}
              autoComplete="one-time-code"
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder="123456"
              className="h-14 rounded-2xl border-text px-four text-lg"
            />
            <SignupButton
              label="Confirm account"
              loading={submitting}
              onPress={onConfirm}
              primary
            />
          </View>
        )}
      </View>

      {stage === 'method' ? (
        <Text selectable className="mt-auto pt-five text-center text-sm text-text-muted">
          By continuing you agree to the <Text className="text-text underline">Terms</Text> and{' '}
          <Text className="text-text underline">Privacy Policy</Text>.
        </Text>
      ) : null}
    </Screen>
  );
}
