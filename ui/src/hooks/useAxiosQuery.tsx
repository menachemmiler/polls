import { useQuery, type QueryKey } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "../axios";

type UseApiQueryOptions = {
  queryKey: QueryKey;
  url: string;
  axiosOptions?: AxiosRequestConfig;
  enabled?: boolean;
  staleTime?: number;
};

export function useApiQuery<T>({
  queryKey,
  url,
  axiosOptions = {},
  enabled = true,
  staleTime = 1000 * 60,
}: UseApiQueryOptions) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<T>(url, axiosOptions);
      return data;
    },
    enabled,
    staleTime,
  });
}
