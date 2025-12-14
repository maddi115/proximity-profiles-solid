import { authStore, authActions } from '../store/authStore';

export function useAuth() {
  return {
    // State
    user: () => authStore.user,
    session: () => authStore.session,
    isAuthenticated: () => authStore.isAuthenticated,
    isLoading: () => authStore.isLoading,
    error: () => authStore.error,

    // Actions
    signUp: authActions.signUp.bind(authActions),
    signIn: authActions.signIn.bind(authActions),
    signOut: authActions.signOut.bind(authActions),
    signInWithOAuth: authActions.signInWithOAuth.bind(authActions),
    resetPassword: authActions.resetPassword.bind(authActions),
    updateProfile: authActions.updateProfile.bind(authActions),
    clearError: authActions.clearError.bind(authActions)
  };
}
