import { Accessor } from 'solid-js';
import { authStore, authActions } from '../store/DB_authStore';
import type { User, Session, AuthResponse, UserMetadata, ProfileUpdate } from '../../../types/auth';

interface UseAuthReturn {
  user: Accessor<User | null>;
  session: Accessor<Session | null>;
  isAuthenticated: Accessor<boolean>;
  isLoading: Accessor<boolean>;
  error: Accessor<string | null>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  signInWithOAuth: (provider: string) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updateProfile: (updates: ProfileUpdate) => Promise<AuthResponse>;
  clearError: () => void;
  skipAuth: () => void; // GUEST MODE: Skip auth for development
}

export function useAuth(): UseAuthReturn {
  return {
    user: () => authStore.user,
    session: () => authStore.session,
    isAuthenticated: () => authStore.isAuthenticated,
    isLoading: () => authStore.isLoading,
    error: () => authStore.error,
    signUp: authActions.signUp.bind(authActions),
    signIn: authActions.signIn.bind(authActions),
    signOut: authActions.signOut.bind(authActions),
    signInWithOAuth: authActions.signInWithOAuth.bind(authActions),
    resetPassword: authActions.resetPassword.bind(authActions),
    updateProfile: authActions.updateProfile.bind(authActions),
    clearError: authActions.clearError.bind(authActions),
    skipAuth: authActions.skipAuth.bind(authActions) // GUEST MODE
  };
}
