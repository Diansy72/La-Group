import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vehicle } from '@/types';
import { getVehicles } from '@/features/vehicles-pricelist/services/api';

interface UseVehiclesProps {
  initialTab?: string;
}

export function useVehicles({ initialTab = "all" }: UseVehiclesProps = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const refreshVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  const filteredVehicles = useMemo(() => {
    const filtered = vehicles.filter((v) => {
      const matchTab =
        activeTab === "all" ||
        v.type === activeTab ||
        (activeTab === "car" && v.type === "minibus");

      const matchSearch = v.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedFilters.length === 0 ||
        selectedFilters.includes(v.selfDrive ? "Self Drive" : "With Driver") ||
        (v.rentalDuration && selectedFilters.includes(v.rentalDuration)) ||
        (v.seatCapacity && selectedFilters.includes(`${v.seatCapacity} Seat`));

      return matchTab && matchSearch && matchCategory;
    });

    // Group vehicles by name (case-insensitive, trimmed) to avoid duplicate cards
    const grouped = filtered.reduce<Record<string, Vehicle>>((acc, vehicle) => {
      const key = vehicle.name.trim().toLowerCase();

      if (!acc[key]) {
        acc[key] = {
          ...vehicle,
          availableUnits: vehicle.status === "available" ? 1 : 0,
        };
      } else {
        if (vehicle.status === "available") {
          acc[key].availableUnits = (acc[key].availableUnits || 0) + 1;
        }
        // If the current primary has no image but this one does, use this one's image
        if (!acc[key].imageUrl && vehicle.imageUrl) {
          acc[key].imageUrl = vehicle.imageUrl;
        }
      }

      return acc;
    }, {});

    return Object.values(grouped);
  }, [vehicles, activeTab, search, selectedFilters]);

  const toggleFilter = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev, item]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    setVehicles,
    refreshVehicles,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    selectedFilters,
    toggleFilter,
    clearFilters
  };
}
