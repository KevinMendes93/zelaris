"use client";

import React, { createContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/src/services/auth.service";
import { useToast } from "@/src/app/components/ui/ToastProvider";

import type { AuthContextType, RegisterData } from "@/src/models/auth.model";
import type { User } from "@/src/models/user.model";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  const reloadUser = useCallback(async () => {
    const response = await authService.getCurrentUser();
    if (response.success && response.data) {
      setUser(response.data);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        await reloadUser();
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void checkAuth();

    return () => {
      active = false;
    };
  }, [reloadUser]);

  const login = async (cpf: string, senha: string) => {
    const response = await authService.login({ cpf, senha });

    if (!response.success) {
      if (mounted) {
        toast.showToast({
          type: "error",
          message: response.message,
        });
      }
      throw new Error(response.message);
    }

    await reloadUser();
    if (mounted) {
      toast.showToast({
        type: "success",
        message: response.message || "Login realizado com sucesso!",
      });
    }
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);

    if (!response.success) {
      if (mounted) {
        toast.showToast({
          type: "error",
          message: response.message,
        });
      }
      throw new Error(response.message);
    }

    await reloadUser();
    if (mounted) {
      toast.showToast({
        type: "success",
        message: response.message || "Cadastro realizado com sucesso!",
      });
    }
  };

  const logout = async () => {
    const response = await authService.logout();

    setUser(null);

    if (mounted) {
      toast.showToast({
        type: response.success ? "success" : "error",
        message:
          response.message ||
          (response.success
            ? "Logout realizado com sucesso!"
            : "Erro ao fazer logout"),
      });
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
