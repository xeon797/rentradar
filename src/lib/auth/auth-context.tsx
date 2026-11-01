"use client";

import * as React from "react";
import { UserRole, CivicUserProfile } from "@/types/rentradar";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const DEMO_PERSONAS: Record<UserRole, CivicUserProfile> = {
  TENANT: {
    id: "demo-tenant-01",
    email: "tenant.demo@rentradar.bd",
    fullName: "Tanjim Ahmed",
    fullNameBn: "তানজিম আহমেদ",
    role: "TENANT",
    city: "Sylhet",
    phoneVerified: true,
    utilityBillVerified: false,
    authMode: "DEMO_PERSONA",
    badgeCode: "RR-TEN-204",
  },
  LANDLORD: {
    id: "demo-landlord-01",
    email: "landlord.verified@rentradar.bd",
    fullName: "Engr. Mahmudul Hasan",
    fullNameBn: "ইঞ্জি. মাহমুদুল হাসান",
    role: "LANDLORD",
    city: "Dhaka",
    phoneVerified: true,
    utilityBillVerified: true,
    authMode: "DEMO_PERSONA",
    badgeCode: "RR-LND-041",
  },
  AUDITOR: {
    id: "demo-auditor-01",
    email: "auditor.board@rentradar.bd",
    fullName: "Farhana Yasmin (Auditor)",
    fullNameBn: "ফারহানা ইয়াসমিন",
    role: "AUDITOR",
    city: "Dhaka",
    phoneVerified: true,
    utilityBillVerified: true,
    authMode: "DEMO_PERSONA",
    badgeCode: "RR-AUD-007",
  },
};

interface CivicAuthContextType {
  user: CivicUserProfile;
  isSupabaseLive: boolean;
  isLoading: boolean;
  switchDemoPersona: (role: UserRole) => void;
  signInWithEmail: (email: string, password?: string) => Promise<{ ok: boolean; message: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
  savedDocketIds: string[];
  toggleSavedDocket: (docketId: string) => void;
  isDocketSaved: (docketId: string) => boolean;
}

const CivicAuthContext = React.createContext<CivicAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PERSONA_KEY = "rentradar_active_persona";
const LOCAL_STORAGE_SAVED_DOCKETS_KEY = "rentradar_saved_dockets";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activePersonaRole, setActivePersonaRole] = React.useState<UserRole>("TENANT");
  const [supabaseUser, setSupabaseUser] = React.useState<CivicUserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [savedDocketIds, setSavedDocketIds] = React.useState<string[]>([]);
  const isSupabaseLive = isSupabaseConfigured();

  // Load saved state from localStorage & check Supabase Auth session on mount
  React.useEffect(() => {
    // 1. Load active demo persona preference
    try {
      const storedPersona = localStorage.getItem(LOCAL_STORAGE_PERSONA_KEY) as UserRole | null;
      if (storedPersona && DEMO_PERSONAS[storedPersona]) {
        setActivePersonaRole(storedPersona);
      }
    } catch {
      // Ignore localStorage errors
    }

    // 2. Load saved docket bookmarks
    try {
      const storedDockets = localStorage.getItem(LOCAL_STORAGE_SAVED_DOCKETS_KEY);
      if (storedDockets) {
        setSavedDocketIds(JSON.parse(storedDockets));
      }
    } catch {
      // Ignore localStorage errors
    }

    // 3. Supabase Auth listener if configured
    if (isSupabaseLive) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            mapSupabaseSession(session.user);
          }
          setIsLoading(false);
        });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            mapSupabaseSession(session.user);
          } else {
            setSupabaseUser(null);
          }
          setIsLoading(false);
        });

        return () => subscription.unsubscribe();
      }
    }

    setIsLoading(false);
  }, [isSupabaseLive]);

  function mapSupabaseSession(userObj: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    phone_confirmed_at?: string;
  }) {
    const role: UserRole = (userObj.user_metadata?.role as UserRole) || "LANDLORD";
    const mapped: CivicUserProfile = {
      id: userObj.id,
      email: userObj.email || "cloud.user@rentradar.bd",
      fullName: (userObj.user_metadata?.full_name as string) || userObj.email?.split("@")[0] || "Authenticated User",
      fullNameBn: (userObj.user_metadata?.full_name_bn as string) || "যাচাইকৃত ব্যবহারকারী",
      role,
      city: (userObj.user_metadata?.city as CivicUserProfile["city"]) || "Dhaka",
      phoneVerified: Boolean(userObj.phone_confirmed_at || userObj.user_metadata?.phone_verified),
      utilityBillVerified: Boolean(
        userObj.user_metadata?.utility_verified ?? (role === "LANDLORD" || role === "AUDITOR")
      ),
      authMode: "SUPABASE_SESSION",
      badgeCode: `RR-${role.slice(0, 3)}-${userObj.id.slice(0, 4).toUpperCase()}`,
    };
    setSupabaseUser(mapped);
  }

  // Switch demo persona (1-Click instant execution)
  const switchDemoPersona = React.useCallback((role: UserRole) => {
    setActivePersonaRole(role);
    setSupabaseUser(null); // Clear cloud user state to prioritize switched demo persona
    try {
      localStorage.setItem(LOCAL_STORAGE_PERSONA_KEY, role);
      // Also sync role cookie for server-side / middleware awareness
      document.cookie = `rentradar_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // Ignore cookie/storage errors
    }
  }, []);

  // Live Supabase Sign In with Password or Magic Link
  const signInWithEmail = React.useCallback(
    async (email: string, password?: string): Promise<{ ok: boolean; message: string }> => {
      if (!isSupabaseLive) {
        // Fallback for offline buildathon testing
        switchDemoPersona("LANDLORD");
        return {
          ok: true,
          message: "Demo Mode Active: Switched to Verified Landlord persona (Add Supabase keys in .env.local for Cloud Auth).",
        };
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return { ok: false, message: "Supabase client not initialized." };
      }

      try {
        if (password) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return { ok: false, message: error.message };
          return { ok: true, message: "Signed in successfully with Supabase." };
        } else {
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${origin}/auth/callback?next=/verify` },
          });
          if (error) return { ok: false, message: error.message };
          return { ok: true, message: "Magic link sent to your email. Check your inbox!" };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Authentication failed.";
        return { ok: false, message: msg };
      }
    },
    [isSupabaseLive, switchDemoPersona]
  );

  // Live Supabase Sign Up
  const signUpWithEmail = React.useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: UserRole
    ): Promise<{ ok: boolean; message: string }> => {
      if (!isSupabaseLive) {
        switchDemoPersona(role);
        return {
          ok: true,
          message: `Demo Mode Active: Switched to ${role} persona.`,
        };
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return { ok: false, message: "Supabase client unavailable." };
      }

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
          },
        });
        if (error) return { ok: false, message: error.message };
        return { ok: true, message: "Account created! Please check your email to verify." };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Account registration failed.";
        return { ok: false, message: msg };
      }
    },
    [isSupabaseLive, switchDemoPersona]
  );

  // Sign out
  const signOut = React.useCallback(async () => {
    if (isSupabaseLive) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setSupabaseUser(null);
    switchDemoPersona("TENANT");
  }, [isSupabaseLive, switchDemoPersona]);

  // Saved docket bookmarks
  const toggleSavedDocket = React.useCallback((docketId: string) => {
    setSavedDocketIds((prev) => {
      const exists = prev.includes(docketId);
      const next = exists ? prev.filter((id) => id !== docketId) : [...prev, docketId];
      try {
        localStorage.setItem(LOCAL_STORAGE_SAVED_DOCKETS_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const isDocketSaved = React.useCallback(
    (docketId: string) => savedDocketIds.includes(docketId),
    [savedDocketIds]
  );

  // Active user profile: Supabase user if logged in, otherwise the selected demo persona
  const activeUser: CivicUserProfile = supabaseUser || DEMO_PERSONAS[activePersonaRole];

  return (
    <CivicAuthContext.Provider
      value={{
        user: activeUser,
        isSupabaseLive,
        isLoading,
        switchDemoPersona,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        savedDocketIds,
        toggleSavedDocket,
        isDocketSaved,
      }}
    >
      {children}
    </CivicAuthContext.Provider>
  );
}

export function useCivicAuth(): CivicAuthContextType {
  const context = React.useContext(CivicAuthContext);
  if (!context) {
    throw new Error("useCivicAuth must be used within an AuthProvider");
  }
  return context;
}
