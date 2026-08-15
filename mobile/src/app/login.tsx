import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiFetch } from '@/lib/api/client';
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
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Already logged in (e.g. navigated here manually) — bounce home instead
  // of showing the form again.
  if (user) return <Redirect href="/" />;

  // Temporary — isolates whether ANY external fetch works from this device
  // (a totally unrelated host), or whether it's specific to core47.xyz.
  // Remove once diagnosed.
  async function handleTestExternal() {
    setDiagnostic(null);
    setIsTestingConnection(true);
    try {
      const res = await fetch('https://api.github.com');
      setDiagnostic(`OK: fetch tới api.github.com thành công (status ${res.status}).`);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setDiagnostic(`LỖI (api.github.com): ${detail}`);
    } finally {
      setIsTestingConnection(false);
    }
  }

  // Temporary — isolates whether GET requests from the app's own fetch
  // work at all, separate from the POST /login call that's currently
  // failing with "Network request failed". Remove once diagnosed.
  async function handleTestConnection() {
    setDiagnostic(null);
    setIsTestingConnection(true);
    try {
      await apiFetch('/api/mobile/auth/me');
      setDiagnostic('OK: GET /api/mobile/auth/me thành công (401 là bình thường vì chưa đăng nhập).');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setDiagnostic('OK: GET /api/mobile/auth/me thành công (401 UNAUTHORIZED, đúng như dự kiến).');
      } else {
        const detail = err instanceof Error ? err.message : String(err);
        setDiagnostic(`LỖI GET: ${detail}`);
      }
    } finally {
      setIsTestingConnection(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(identifier.trim(), password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(errorMessage(err.code));
      } else {
        // Temporary — surfaces the raw network error text while we're
        // diagnosing device connectivity; will go back to a plain Vietnamese
        // message once this is confirmed working.
        const detail = err instanceof Error ? err.message : String(err);
        setError(`Không kết nối được máy chủ: ${detail}`);
      }
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

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          disabled={isTestingConnection}
          onPress={handleTestConnection}>
          {isTestingConnection ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.secondaryButtonText}>Kiểm tra kết nối (GET)</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          disabled={isTestingConnection}
          onPress={handleTestExternal}>
          {isTestingConnection ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.secondaryButtonText}>Test api.github.com</Text>
          )}
        </Pressable>
        {diagnostic && <Text style={styles.diagnostic}>{diagnostic}</Text>}
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
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8888',
  },
  secondaryButtonText: { fontWeight: '600', fontSize: 13 },
  diagnostic: { fontSize: 13, color: '#3c87f7' },
});
