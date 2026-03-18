"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerSchema,
  type RegisterFormData,
} from "@/src/schemas/auth.schema";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { AuthShell } from "@/src/app/auth/components/AuthShell";
import { PublicOnly } from "@/src/app/auth/components/AuthGuard";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data);
      router.push("/home");
    } catch {
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnly>
      <AuthShell title="Cadastrar" subtitle="Crie sua conta no sistema">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-2">
              Nome completo:
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Insira seu nome..."
              {...register("nome")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
            />
            {errors.nome && (
              <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium mb-2">
              CPF (apenas números):
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
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium mb-2"
            >
              Telefone (opcional):
            </label>
            <input
              id="telefone"
              type="text"
              placeholder="(99) 99999-9999"
              maxLength={11}
              {...register("telefone")}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/\D/g, "");
              }}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
            />
            {errors.telefone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.telefone.message}
              </p>
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
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>

          <div className="text-center text-xs">
            <Link
              href="/auth/login"
              className="text-white/80 hover:text-white transition"
            >
              Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </AuthShell>
    </PublicOnly>
  );
}
