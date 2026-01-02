import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid credentials
const hasValidCredentials = 
  supabaseUrl && 
  supabaseUrl !== 'your-project-url.supabase.co' &&
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-anon-key-here';

// Export real client if credentials exist, otherwise mock
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockClient();

// Mock Supabase client for development without credentials
function createMockClient() {
  console.warn('⚠️ Using MOCK Supabase client - no real auth happening');
  
  return {
    auth: {
      getSession: async () => ({ 
        data: { session: null }, 
        error: null 
      }),
      
      signUp: async ({ email, password, options }) => {
        console.log('🔐 Mock Sign Up:', email);
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email,
          user_metadata: options?.data || {}
        };
        return {
          data: {
            user: mockUser,
            session: {
              access_token: 'mock-token',
              refresh_token: 'mock-refresh',
              user: mockUser
            }
          },
          error: null
        };
      },
      
      signInWithPassword: async ({ email, password }) => {
        console.log('🔐 Mock Sign In:', email);
        const mockUser = {
          id: 'mock-user-123',
          email,
          user_metadata: { username: email.split('@')[0] }
        };
        return {
          data: {
            user: mockUser,
            session: {
              access_token: 'mock-token',
              refresh_token: 'mock-refresh',
              user: mockUser
            }
          },
          error: null
        };
      },
      
      signOut: async () => {
        console.log('🚪 Mock Sign Out');
        return { error: null };
      },
      
      signInWithOAuth: async ({ provider }) => {
        console.log('🔐 Mock OAuth:', provider);
        return { data: {}, error: null };
      },
      
      resetPasswordForEmail: async (email) => {
        console.log('📧 Mock Password Reset:', email);
        return { error: null };
      },
      
      updateUser: async (updates) => {
        console.log('👤 Mock Update User:', updates);
        return {
          data: { user: { id: 'mock-user-123', ...updates } },
          error: null
        };
      },
      
      onAuthStateChange: (callback) => {
        console.log('👂 Mock Auth Listener Set Up');
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    }
  };
}
