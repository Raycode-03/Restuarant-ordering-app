"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export function useApiMutation<TData = unknown, TVariables = void, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
  } & Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  const { successMessage = "Success!", errorMessage = "Something went wrong", ...mutationOptions } = options || {};

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn,
    ...mutationOptions,
  });

  // Create a wrapped mutate function
  const mutateWithToast = async (variables: TVariables) => {
    try {
      const result = await mutation.mutateAsync(variables);
      toast.success(successMessage);
      return result;
    } catch (error) {
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    ...mutation,
    mutateWithToast, 
  };
}
