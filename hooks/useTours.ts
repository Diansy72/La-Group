import { useState, useEffect, useMemo, useCallback } from 'react';
import { TourPackage } from '@/types';
import { getTourPackages } from '@/features/tourpackages/services/api';

export function useTours() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const refreshTours = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTourPackages();
      setTours(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTours();
  }, [refreshTours]);

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchDest = !selectedDestination || (t.destinationTags && t.destinationTags.includes(selectedDestination));
      return matchSearch && matchDest;
    });
  }, [tours, search, selectedDestination]);

  return {
    tours: filteredTours,
    allTours: tours,
    setTours,
    refreshTours,
    isLoading,
    error,
    search,
    setSearch,
    selectedDestination,
    setSelectedDestination
  };
}
