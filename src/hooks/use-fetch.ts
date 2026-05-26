"use client";

import { useCallback, useEffect, useState } from "react";

export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      const payload = (await response.json()) as T;
      if (!response.ok) throw new Error("Request failed");
      setData(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  }, [options, url]);

  useEffect(() => {
    const task = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(task);
  }, [load]);

  return { data, error, isLoading, refetch: load };
}
