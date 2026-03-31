/**
 * Hook for applying exception filtering by type
 */
import { useMemo, useState } from 'react';

export function useFilters(initial = 'All') {
  const [filter, setFilter] = useState(initial);
  const filteredFn = useMemo(() => {
    return (exceptions) => {
      if (filter === 'All') return exceptions;
      return exceptions.filter((item) => item.gap_type === filter);
    };
  }, [filter]);

  return { filter, setFilter, filteredFn };
}
