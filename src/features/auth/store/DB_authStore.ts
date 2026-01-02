import { createStore, produce } from "solid-js/store";
import { supabase } from "../utils/DB_supabaseClient";
import type { User, Session, AuthResponse, UserMetadata, ProfileUpdate } from "../../../types/auth";
import { profileActions } from "../../profile/store/profileStore";
import { DB_AuthSchemas, DB_SessionSchema } from "../../../types/DB_schemas";
import { DB } from "../../../utils/DB_operations";

/**
 * 🍄 DATABASE AUTH STORE
 * 
 * All authentication operations go through 🍄 tracer + 🌊 transporter.
 * Validates input with Zod, traces execution, blocks on errors.
 * 
 * Flow Tree:
 * 🍄 AUTH Operations
 *  ├─ signUp()        -> validate email/password -> 🌊 transport -> Supabase
 *  ├─ signIn()        -> validate -> 🌊 transport -> Supabase -> validate session
 *  ├─ signOut()       -> 🌊 transport -> Supabase
 *  ├─ signInWithOAuth() -> validate provider -> 🌊 transport -> Supabase
 *  ├─ resetPassword() -> 🌊 transport -> Supabase
 *  └─ skipAuth()      -> local state only (GUEST MODE)
 * 
 * 🍄 READ Operations
 *  └─ initialize()    -> 🌊 transport -> getSession
 * 
 * 🍄 WRITE Operations
 *  ├─ updateProfile() -> 🌊 transport -> Supabase
 *  └─ _syncProfile()  -> 🌊 transport -> profileStore
 */

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const [authStore, setStore] = createStore<AuthState>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
});

export const authActions = {
  // 🍄 READ - Initialize auth state
  async initialize(): Promise<void> {
    return await DB.READ(async () => {
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
        } else {
          setStore({
            user: null,
            session: null,
            isAuthenticated: false,
            error: null
          });
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setStore("error", error.message);
      } finally {
        setStore("isLoading", false);
      }
    });
  },

  // 🍄 AUTH - Sign up new user with validation
  async signUp(email: string, password: string, metadata: UserMetadata = {}): Promise<AuthResponse> {
    return await DB.AUTH(
      DB_AuthSchemas.signUp,
      { email, password, metadata },
      async (validated) => {
        try {
          setStore("isLoading", true);
          setStore("error", null);
          
          const { data, error } = await supabase.auth.signUp({
            email: validated.email,
            password: validated.password,
            options: {
              data: validated.metadata || {}
            }
          });
          
          if (error) throw error;
          
          if (data.user && data.session) {
            setStore({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
              error: null
            });
            
            await this._syncProfile(data.user);
          }
          
          return { success: true };
        } catch (error: any) {
          console.error('Sign up error:', error);
          setStore("error", error.message);
          return { success: false, error: error.message };
        } finally {
          setStore("isLoading", false);
        }
      }
    );
  },

  // 🍄 AUTH - Sign in existing user with validation
  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await DB.AUTH(
      DB_AuthSchemas.signIn,
      { email, password },
      async (validated) => {
        try {
          setStore("isLoading", true);
          setStore("error", null);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: validated.email,
            password: validated.password
          });
          
          if (error) throw error;
          
          if (data.session) {
            // 🍄 READ - Validate session data from Supabase
            const validatedSession = await DB.READ(() => 
              DB_SessionSchema.parse(data.session)
            );
            
            setStore({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
              error: null
            });
            
            await this._syncProfile(data.user);
          }
          
          return { success: true };
        } catch (error: any) {
          console.error('Sign in error:', error);
          setStore("error", error.message);
          return { success: false, error: error.message };
        } finally {
          setStore("isLoading", false);
        }
      }
    );
  },

  // 🍄 AUTH - Sign out current user
  // 🍄 AUTH - Sign out current user
  async signOut(): Promise<AuthResponse> {
    return await DB.READ(async () => {
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
        
        profileActions.updateProfile({
          id: "0",
          username: "proximityuser",
          name: "Proximity User",
          bio: "Living in the moment, connecting with nearby souls ✨",
          avatar: "https://i.pravatar.cc/300?img=68",
          email: "user@proximity.app"
        });
        
        return { success: true };
      } catch (error: any) {
        console.error("Sign out error:", error);
        setStore("error", error.message);
        return { success: false, error: error.message };
      } finally {
        setStore("isLoading", false);
      }
    });
  },

  // 🍄 AUTH - OAuth sign in with validation
  async signInWithOAuth(provider: string): Promise<AuthResponse> {
    return await DB.AUTH(
      DB_AuthSchemas.oauth,
      { provider, redirectTo: `${window.location.origin}/home` },
      async (validated) => {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: validated.provider as any,
            options: { redirectTo: validated.redirectTo }
          });
          
          if (error) throw error;
          return { success: true };
        } catch (error: any) {
          console.error('OAuth error:', error);
          setStore("error", error.message);
          return { success: false, error: error.message };
        }
      }
    );
  },

  // 🍄 AUTH - Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    return await DB.READ(async () => {
      try {
        setStore("isLoading", true);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (error) throw error;
        
        return { success: true };
      } catch (error: any) {
        console.error('Reset password error:', error);
        setStore("error", error.message);
        return { success: false, error: error.message };
      } finally {
        setStore("isLoading", false);
      }
    });
  },

  // 🍄 WRITE - Update user profile
  async updateProfile(updates: ProfileUpdate): Promise<AuthResponse> {
    return await DB.WRITE(async () => {
      try {
        setStore("isLoading", true);
        
        const { data, error } = await supabase.auth.updateUser({
          data: updates
        });
        
        if (error) throw error;
        
        if (data.user) {
          setStore("user", data.user);
          await this._syncProfile(data.user);
        }
        
        return { success: true };
      } catch (error: any) {
        console.error('Update profile error:', error);
        setStore("error", error.message);
        return { success: false, error: error.message };
      } finally {
        setStore("isLoading", false);
      }
    });
  },

  // 🍄 WRITE - Sync profile to profile store
  async _syncProfile(user: User): Promise<void> {
    return await DB.WRITE(async () => {
      profileActions.updateProfile({
        id: user.id,
        email: user.email || '',
        username: user.user_metadata?.username || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        bio: user.user_metadata?.bio || null,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
  },

  // GUEST MODE: Skip auth for development (no DB operations)
  // Setup auth state change listener
  setupAuthListener() {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth event:', event);
      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
        setStore({
          user: session.user,
          session: session,
          isAuthenticated: true,
          error: null
        });
      } else if (event === 'SIGNED_OUT') {
        setStore({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null
        });
      }
    });
  },


  skipAuth(): void {
    const guestUser: User = {
      id: `guest-dev-${Date.now()}`,
      email: 'guest@dev.local',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      user_metadata: {
        username: 'Guest User',
        avatar_url: null
      },
      app_metadata: {},
      updated_at: new Date().toISOString()
    };

    setStore({
      user: guestUser,
      session: null,
      isAuthenticated: true,
      error: null
    });

    profileActions.updateProfile({
      id: guestUser.id,
      email: guestUser.email || '',
      username: 'Guest User',
      avatar_url: null,
      bio: 'Development guest account',
      created_at: guestUser.created_at,
      updated_at: new Date().toISOString()
    });
  },

  clearError(): void {
    setStore("error", null);
  }
};

export { authStore };
