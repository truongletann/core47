import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, useAuth } from '@/lib/auth/AuthContext';

function errorMessage(code: string): string {
  switch (code) {
    case 'INVALID_CREDENTIALS':
      return 'Sai email/username hoặc mật khẩu.';
    case 'ACCOUNT_DISABLED':
      return 'Tài khoản đã bị vô hiệu hoá.';
    case 'TOO_MANY_ATTEMPTS':
      return 'Thử lại quá nhiều lần, vui lòng chờ một lát.';
    default:
      return 'Đăng nhập thất bại, vui lòng thử lại.';
  }
}

export default function LoginScreen() {
  const { user, login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in (e.g. navigated here manually) — bounce home instead
  // of showing the form again.
  if (user) return <Redirect href="/" />;

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(identifier.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? errorMessage(err.code) : 'Không kết nối được máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Core47</Text>
      <Text style={styles.subtitle}>Daily Command Center</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email hoặc username"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          disabled={isSubmitting || !identifier || !password}
          onPress={handleSubmit}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  title: { fontSize: 40, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 8 },
  form: { marginTop: 24, gap: 16 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8888',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: { color: '#E5484D', fontSize: 14 },
  button: {
    backgroundColor: '#208AEF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
