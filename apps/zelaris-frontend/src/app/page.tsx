"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#14232B] flex items-center justify-center">
      <div className="text-white text-lg">Carregando...</div>
    </div>
  );
}
