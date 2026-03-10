import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  getReadableAuthError,
  getSessionUser,
  MemberRow,
  PublicUserRow,
  registerWithSupabase,
  RegisterPayload,
  signInWithSupabase,
  signOutSupabase,
} from "@/lib/supabase-auth";
import { supabase } from "@/lib/supabase";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  status: MemberRow["status"];
  name: string;
  surname: string;
  nome: string;
  cognome: string;
  fullName: string;
  profile: PublicUserRow;
  member: MemberRow;
};

type AuthContextType = {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthenticatedUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<{ message: string }, Error, RegisterPayload>;
};

type LoginData = {
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

function buildAuthenticatedUser(publicUser: PublicUserRow, member: MemberRow): AuthenticatedUser {
  return {
    id: publicUser.id,
    email: publicUser.email,
    role: publicUser.role,
    status: member.status,
    name: member.name,
    surname: member.surname,
    nome: member.name,
    cognome: member.surname,
    fullName: `${member.name} ${member.surname}`.trim(),
    profile: publicUser,
    member,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<AuthenticatedUser | null, Error>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const sessionProfile = await getSessionUser();
      if (!sessionProfile) return null;

      return buildAuthenticatedUser(sessionProfile.publicUser, sessionProfile.member);
    },
  });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const resolved = await signInWithSupabase(credentials.email, credentials.password);
      return buildAuthenticatedUser(resolved.publicUser, resolved.member);
    },
    onSuccess: (currentUser: AuthenticatedUser) => {
      queryClient.setQueryData(["auth-user"], currentUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      return registerWithSupabase(payload);
    },
    onSuccess: () => {},
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOutSupabase();
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout non riuscito",
        description: getReadableAuthError(error),
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
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
