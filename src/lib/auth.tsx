import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GOOGLE_CLIENT_ID, ALLOWED_USERS } from "@/lib/constants";
import { getGoogleAccountsId } from "@/lib/google-auth";
import type { AuthUser } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeJwt(token: string): Record<string, string> {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setUserFromCredential = useCallback((credential: string) => {
    try {
      const decoded = decodeJwt(credential);
      const email = decoded.email;
      const branch = ALLOWED_USERS[email];

      if (!branch) {
        setError("Access denied. Your email is not authorized.");
        return;
      }

      const authUser: AuthUser = {
        email,
        name: decoded.name || email.split("@")[0],
        picture: decoded.picture || "",
        branch,
      };

      localStorage.setItem("userEmail", email);
      localStorage.setItem("googleToken", credential);
      localStorage.setItem("branch", branch);
      localStorage.setItem("userName", authUser.name);
      localStorage.setItem("userPicture", authUser.picture);

      setUser(authUser);
      setError(null);
    } catch {
      setError("Failed to process login. Please try again.");
    }
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("googleToken");
    const branch = localStorage.getItem("branch");

    if (email && token && branch) {
      setUser({
        email,
        name: localStorage.getItem("userName") || email.split("@")[0],
        picture: localStorage.getItem("userPicture") || "",
        branch,
      });
    }
    setIsLoading(false);
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    const initGoogle = () => {
      const gsi = getGoogleAccountsId();
      if (gsi) {
        gsi.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            setUserFromCredential(response.credential);
          },
        });
      }
    };

    if (getGoogleAccountsId()) {
      initGoogle();
    } else {
      const checkInterval = setInterval(() => {
        if (getGoogleAccountsId()) {
          initGoogle();
          clearInterval(checkInterval);
        }
      }, 200);

      return () => clearInterval(checkInterval);
    }
  }, [setUserFromCredential]);

  const logout = useCallback(() => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("googleToken");
    localStorage.removeItem("branch");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPicture");
    setUser(null);
    setError(null);
    const gsi = getGoogleAccountsId();
    if (gsi) {
      gsi.disableAutoSelect();
    }
  }, []);

  const loginAsDemo = useCallback(() => {
    const demoUser: AuthUser = {
      email: "workingforthebigg@gmail.com",
      name: "Demo User",
      picture: "",
      branch: "test",
    };
    localStorage.setItem("userEmail", demoUser.email);
    localStorage.setItem("branch", demoUser.branch);
    localStorage.setItem("userName", demoUser.name);
    setUser(demoUser);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
