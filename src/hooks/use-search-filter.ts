"use client";

import { useMemo } from "react";

type SearchFilterOptions<T> = {
  getSearchText: (item: T) => string;
  items: T[];
  query: string;
};

export function useSearchFilter<T>({ getSearchText, items, query }: SearchFilterOptions<T>) {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => getSearchText(item).toLowerCase().includes(normalizedQuery));
  }, [getSearchText, items, query]);
}
