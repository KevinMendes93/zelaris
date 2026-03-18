"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/src/schemas/auth.schema";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { AuthShell } from "@/src/app/auth/components/AuthShell";
import { PublicOnly } from "@/src/app/auth/components/AuthGuard";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.cpf, data.senha);
      router.push("/home");
    } catch {

    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnly>
      <AuthShell title="Acessar">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium mb-2">
              CPF:
            </label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              maxLength={11}
              {...register("cpf")}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/\D/g, "");
              }}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
            />
            {errors.cpf && (
              <p className="text-red-400 text-xs mt-1">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium mb-2">
              Senha:
            </label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••••"
              {...register("senha")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
            />
            {errors.senha && (
              <p className="text-red-400 text-xs mt-1">
                {errors.senha.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#DB9437] hover:bg-[#c7812e] disabled:bg-[#DB9437]/50 text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Entrando..." : "Login"}
          </button>

          <div className="flex justify-between items-center text-xs">
            <Link
              href="/auth/register"
              className="text-white/80 hover:text-white transition"
            >
              Criar conta
            </Link>
            <Link
              href="/auth/forgot-password"
              className="text-[#DB9437] hover:text-[#c7812e] transition"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </AuthShell>
    </PublicOnly>
  );
}
