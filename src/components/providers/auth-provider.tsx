"use client";

import { useEffect } from "react";
import {
  AuthProvider as AuthContextProvider,
  useAuth,
} from "@/app/context/auth-context";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuth();

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user ?? null);
      } catch (error) {
        console.error("Failed to load authenticated user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </AuthContextProvider>
  );
}
