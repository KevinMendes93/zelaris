"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/src/schemas/auth.schema";
import { AuthShell } from "@/src/app/auth/components/AuthShell";
import { PublicOnly } from "@/src/app/auth/components/AuthGuard";
import { useState, Suspense } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { authService } from "@/src/services/auth.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      showToast({ type: "error", message: "Token inválido" });
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.resetPassword(token, data.senha);
      showToast({
        type: "success",
        message: "Senha alterada com sucesso!",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao redefinir senha";
      showToast({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthShell title="Token inválido">
        <div className="space-y-4">
          <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 text-sm">
            <p className="text-white">
              O link de recuperação é inválido ou expirou.
            </p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="block w-full bg-[#DB9437] hover:bg-[#c7812e] text-white font-semibold py-3 rounded-lg transition text-center"
          >
            Solicitar novo link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Redefinir senha" subtitle="Digite sua nova senha">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="senha" className="block text-sm font-medium mb-2">
            Nova senha:
          </label>
          <input
            id="senha"
            type="password"
            placeholder="••••••••••"
            {...register("senha")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
          />
          {errors.senha && (
            <p className="text-red-400 text-xs mt-1">{errors.senha.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#DB9437] hover:bg-[#c7812e] disabled:bg-[#DB9437]/50 text-white font-semibold py-3 rounded-lg transition"
        >
          {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
        </button>

        <div className="text-center text-xs">
          <Link
            href="/auth/login"
            className="text-white/80 hover:text-white transition"
          >
            Voltar para login
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <PublicOnly>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#14232B] flex items-center justify-center">
            <div className="text-white text-lg">Carregando...</div>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </PublicOnly>
  );
}
