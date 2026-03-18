"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import type { ApiResponse } from "@/src/models/api.model";

interface UseFormSubmitOptions {
  successMessage: string;
  errorMessage: string;
  redirectTo: string;
}

export function useFormSubmit({
  successMessage,
  errorMessage,
  redirectTo,
}: UseFormSubmitOptions) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: () => Promise<ApiResponse<any>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    afterSuccess?: (response: ApiResponse<any>) => Promise<void> | void,
  ) => {
    try {
      setIsSubmitting(true);
      const response = await action();

      if (response.success) {
        if (afterSuccess) await afterSuccess(response);
        showToast({ type: "success", message: successMessage });
        router.push(redirectTo);
      } else {
        showToast({
          type: "error",
          message: response.message || errorMessage,
        });
      }
    } catch (error) {
      console.error(error);
      showToast({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitHandler, isSubmitting };
}
