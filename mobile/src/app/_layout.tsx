import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';

// Each route decides for itself whether it needs a logged-in user (see
// index.tsx / login.tsx) — no gate/redirect here that a public route like
// /login would have to fight against.
function AppShell() {
  const { isLoading } = useAuth();
  if (isLoading) return null;
  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
