import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { apiFetch, ApiError } from '@/lib/api/client';
import type { User } from './types';

// Keychain (iOS) / Keystore (Android) backed — never AsyncStorage, per
// CONVENTIONS.md's "no sensitive credentials in localStorage" rule
// (IMPLEMENTATION_PLAN.md §8).
const SESSION_KEY = 'core47_session_id';

interface AuthContextValue {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(SESSION_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiFetch<{ user: User }>('/api/mobile/auth/me', { sessionId: stored });
        setSessionId(stored);
        setUser(data.user);
      } catch {
        // Expired/disabled/invalid — drop the stale token instead of
        // retrying forever.
        await SecureStore.deleteItemAsync(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      sessionId,
      isLoading,
      async login(identifier: string, password: string) {
        const data = await apiFetch<{ user: User; sessionId: string }>('/api/mobile/auth/login', {
          method: 'POST',
          body: {
            identifier,
            password,
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
            deviceName: Device.deviceName ?? undefined,
          },
        });
        await SecureStore.setItemAsync(SESSION_KEY, data.sessionId);
        setSessionId(data.sessionId);
        setUser(data.user);
      },
      async logout() {
        if (sessionId) {
          try {
            await apiFetch('/api/mobile/auth/logout', { method: 'POST', sessionId });
          } catch {
            // Best-effort — still clear local state even if the network
            // call fails, so the user isn't stuck "logged in" offline.
          }
        }
        await SecureStore.deleteItemAsync(SESSION_KEY);
        setSessionId(null);
        setUser(null);
      },
    }),
    [user, sessionId, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used inside <AuthProvider>');
  return ctx;
}

export { ApiError };
