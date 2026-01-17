import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

interface UseApiQueryOptions<TData, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  showErrorToast?: boolean;
  errorMessage?: string;
}

/**
 * Custom useQuery wrapper with built-in error handling and toast notifications
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useApiQuery(
 *   ['dashboard-stats'],
 *   fetchDashboardStats,
 *   {
 *     refetchInterval: 30000,
 *     errorMessage: 'Failed to fetch dashboard stats'
 *   }
 * );
 * ```
 */
export function useApiQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: UseApiQueryOptions<TData, TError>
) {
  const {
    showErrorToast = true,
    errorMessage = "Failed to fetch data",
    ...queryOptions
  } = options || {};

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    retry: 2,
    staleTime: 10000, // Consider data fresh for 10 seconds
    ...queryOptions,
  });

  // Show error toast when query fails
  useEffect(() => {
    if (query.isError && showErrorToast) {
      toast.error(errorMessage);
    }
  }, [query.isError, showErrorToast, errorMessage]);

  return query;
}