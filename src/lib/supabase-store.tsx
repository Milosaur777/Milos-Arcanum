"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

const GUEST_KEY = "unhinged_guest";

interface GuestUser {
  id: string;
  email: string;
  user_metadata: { display_name: string };
  is_guest: true;
}

function getGuestUser(): GuestUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(GUEST_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

interface AuthState {
  user: User | GuestUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | GuestUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guest = getGuestUser();
    if (guest) {
      setUser(guest);
      setLoading(false);
      return;
    }

    import("@/lib/supabase")
      .then(({ createClient }) => {
        const supabase = createClient();
        return supabase.auth.getSession();
      })
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useSupabase() {
  const { createClient } = require("@/lib/supabase");
  return createClient();
}

export function requireAuth(user: User | GuestUser | null, loading: boolean) {
  return !user && !loading;
}

export function loginAsGuest(displayName: string) {
  const guestId = "guest-" + crypto.randomUUID().slice(0, 8);
  const guest: GuestUser = {
    id: guestId,
    email: `${displayName.toLowerCase().replace(/\s+/g, ".")}@guest.local`,
    user_metadata: { display_name: displayName },
    is_guest: true,
  };
  localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
  return guest;
}

export function logoutGuest() {
  localStorage.removeItem(GUEST_KEY);
}
