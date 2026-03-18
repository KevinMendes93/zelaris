"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/src/schemas/auth.schema";
import { AuthShell } from "@/src/app/auth/components/AuthShell";
import { PublicOnly } from "@/src/app/auth/components/AuthGuard";
import { useState } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { authService } from "@/src/services/auth.service";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      await authService.forgotPassword(data.email);
      setSuccess(true);
      showToast({
        type: "success",
        message: "Se o email existir, um link de recuperação será enviado",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao enviar email";
      showToast({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnly>
      <AuthShell
        title="Esqueci minha senha"
        subtitle="Digite seu email para recuperar a senha"
      >
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 text-sm">
              <p className="text-white">
                Se o email estiver cadastrado, você receberá um link para
                redefinir sua senha.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="block w-full bg-[#DB9437] hover:bg-[#c7812e] text-white font-semibold py-3 rounded-lg transition text-center"
            >
              Voltar para login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#DB9437] hover:bg-[#c7812e] disabled:bg-[#DB9437]/50 text-white font-semibold py-3 rounded-lg transition"
            >
              {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
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
        )}
      </AuthShell>
    </PublicOnly>
  );
}
