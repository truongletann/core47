import { Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';

// Placeholder Home — the real Daily Command Center (market snapshot,
// today's priority, briefing, focus/goals summary) lands in its own
// milestone (IMPLEMENTATION_PLAN.md §9, milestone 4). This milestone only
// proves the auth loop end-to-end: logged-in state persists across app
// restarts, and logout actually clears it.
export default function HomeScreen() {
  const { user, logout } = useAuth();

  if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Chào {user.name ?? user.username ?? user.email}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666' },
  button: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8888',
  },
  buttonText: { fontWeight: '700' },
});
