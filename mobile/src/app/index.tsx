import { Redirect } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
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
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Chào {user.name ?? user.username ?? user.email}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {user.email}
        </ThemedText>

        <Pressable style={styles.button} onPress={() => logout()}>
          <ThemedText type="smallBold">Đăng xuất</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.two, padding: Spacing.four },
  title: { textAlign: 'center' },
  button: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8888',
  },
});
