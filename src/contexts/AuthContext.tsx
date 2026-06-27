"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Role = "admin" | "club_owner";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
  club?: string;
}

interface MockAccount extends AuthUser {
  password: string;
}

// Mock accounts until a real API is wired up. `login` is async and
// returns a result object so swapping the body for a real API call
// later doesn't change any caller.
const MOCK_ACCOUNTS: MockAccount[] = [
  {
    name: "Platform Admin",
    email: "admin@teaitup.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "Sarah Owens",
    email: "owner@royalridges.com",
    password: "Owner@123",
    role: "club_owner",
    club: "The Royal Ridges Estate",
  },
];

const STORAGE_KEY = "tea-it-up-dashboard-user";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    const account = MOCK_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase()
    );

    if (!account || account.password !== password) {
      return { success: false, message: "Invalid email or password." };
    }

    const authUser: AuthUser = {
      name: account.name,
      email: account.email,
      role: account.role,
      club: account.club,
    };

    setUser(authUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
