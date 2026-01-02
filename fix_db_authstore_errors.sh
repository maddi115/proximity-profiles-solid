#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  FIXING 3 ERRORS IN DB_authStore.ts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Fix 1: Change setProfile → updateProfile (profileActions doesn't have setProfile)
echo "Fix 1: Changing profileActions.setProfile → profileActions.updateProfile"
sed -i 's/profileActions\.setProfile/profileActions.updateProfile/g' src/features/auth/store/DB_authStore.ts

# Fix 2: Fix signOut - use DB.READ instead of DB.AUTH (no validation needed)
echo "Fix 2: Fixing signOut to use DB.READ (no validation)"
sed -i '/async signOut/,/^  },$/c\
  // 🍄 AUTH - Sign out current user\
  async signOut(): Promise<AuthResponse> {\
    return await DB.READ(async () => {\
      try {\
        setStore("isLoading", true);\
        \
        const { error } = await supabase.auth.signOut();\
        \
        if (error) throw error;\
        \
        setStore({\
          user: null,\
          session: null,\
          isAuthenticated: false,\
          error: null\
        });\
        \
        profileActions.updateProfile({\
          id: "0",\
          username: "proximityuser",\
          name: "Proximity User",\
          bio: "Living in the moment, connecting with nearby souls ✨",\
          avatar: "https://i.pravatar.cc/300?img=68",\
          email: "user@proximity.app"\
        });\
        \
        return { success: true };\
      } catch (error: any) {\
        console.error("Sign out error:", error);\
        setStore("error", error.message);\
        return { success: false, error: error.message };\
      } finally {\
        setStore("isLoading", false);\
      }\
    });\
  },' src/features/auth/store/DB_authStore.ts

# Fix 3: Add setupAuthListener method
echo "Fix 3: Adding setupAuthListener method"

# Find the line number of skipAuth method and insert before it
LINE=$(grep -n "skipAuth():" src/features/auth/store/DB_authStore.ts | cut -d: -f1)

if [ -n "$LINE" ]; then
  # Insert setupAuthListener before skipAuth
  sed -i "${LINE}i\\
  // Setup auth state change listener\\
  setupAuthListener() {\\
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {\\
      console.log('🔐 Auth event:', event);\\
      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {\\
        setStore({\\
          user: session.user,\\
          session: session,\\
          isAuthenticated: true,\\
          error: null\\
        });\\
      } else if (event === 'SIGNED_OUT') {\\
        setStore({\\
          user: null,\\
          session: null,\\
          isAuthenticated: false,\\
          error: null\\
        });\\
      }\\
    });\\
  },\\
\\
" src/features/auth/store/DB_authStore.ts
fi

echo ""
echo "✅ All fixes applied"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
