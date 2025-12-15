import { createStore } from "solid-js/store";
import { supabase } from "../utils/supabaseClient";
import type { User, Session, AuthResponse, UserMetadata, ProfileUpdate } from "../../../types/auth";

interface AuthStore {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const [store, setStore] = createStore<AuthStore>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
});

export const authActions = {
  async initialize(): Promise<void> {
    try {
      setStore("isLoading", true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session) {
        setStore({
          user: session.user,
          session: session,
          isAuthenticated: true,
          error: null
        });
        await this._syncProfile(session.user);
      }
    } catch (error: any) {
      console.error('❌ Auth initialization error:', error);
      setStore("error", error.message);
    } finally {
      setStore("isLoading", false);
    }
  },

  async signUp(email: string, password: string, metadata: UserMetadata = {}): Promise<AuthResponse> {
    try {
      setStore("isLoading", true);
      setStore("error", null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (error) throw error;
      if (data.user) {
        setStore({
          user: data.user,
          session: data.session,
          isAuthenticated: true
        });
        console.log('✅ Sign up successful');
        return { success: true, user: data.user };
      }
      return { success: false, error: 'Unknown error' };
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      setStore("error", error.message);
      return { success: false, error: error.message };
    } finally {
      setStore("isLoading", false);
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      setStore("isLoading", true);
      setStore("error", null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      setStore({
        user: data.user,
        session: data.session,
        isAuthenticated: true
      });
      await this._syncProfile(data.user);
      console.log('✅ Sign in successful');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      setStore("error", error.message);
      return { success: false, error: error.message };
    } finally {
      setStore("isLoading", false);
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      setStore("isLoading", true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setStore({
        user: null,
        session: null,
        isAuthenticated: false,
        error: null
      });
      console.log('✅ Sign out successful');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      setStore("error", error.message);
      return { success: false, error: error.message };
    } finally {
      setStore("isLoading", false);
    }
  },

  async signInWithOAuth(provider: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: { redirectTo: `${window.location.origin}/home` }

      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error(`❌ ${provider} sign in error:`, error);
      setStore("error", error.message);
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      setStore("isLoading", true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      console.log('✅ Password reset email sent');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      setStore("error", error.message);
      return { success: false, error: error.message };
    } finally {
      setStore("isLoading", false);
    }
  },

  async updateProfile(updates: ProfileUpdate): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) throw error;
      setStore("user", data.user);
      console.log('✅ Profile updated');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: error.message };
    }
  },

  async _syncProfile(user: User): Promise<void> {
    const { profileActions } = await import('../../profile/store/profileStore');
    profileActions.updateProfile({
      name: user.user_metadata?.username || user.email?.split('@')[0],
      avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      email: user.email
    });
  },

setupAuthListener() {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth event:', event);

    // Treat INITIAL_SESSION like a normal session set
    if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
      setStore({
        user: session.user,
        session: session,
        isAuthenticated: true,
        error: null
      });
      this._syncProfile(session.user);
      return;
    }

    if (event === 'SIGNED_OUT') {
      setStore({
        user: null,
        session: null,
        isAuthenticated: false
      });
      return;
    }

    if ((event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session) {
      setStore({
        user: session.user,
        session: session,
        isAuthenticated: true
      });
      return;
    }
  });

  return authListener;
},


  clearError(): void {
    setStore("error", null);
  }
};

export const authStore = store;
