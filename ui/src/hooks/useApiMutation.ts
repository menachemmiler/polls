import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

type HttpMethod = "post" | "put" | "delete" | "patch";

type UseApiMutationOptions<TData, TVariables> = {
  url: string | ((variables: TVariables) => string);
  method?: HttpMethod;
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
  transformBody?: (variables: TVariables) => unknown;
};

export function useApiMutation<TData = unknown, TVariables = unknown>({
  url,
  method = "post",
  onSuccess,
  onError,
  transformBody,
}: UseApiMutationOptions<TData, TVariables>) {
  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;
      const body = transformBody ? transformBody(variables) : variables;
      const res = await axiosInstance[method]<TData>(resolvedUrl, body);
      return res.data;
    },
    onSuccess,
    onError,
  });
}
