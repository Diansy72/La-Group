"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import VehicleDetailClient from "@/features/vehicles-pricelist/VehicleDetailClient";
import { Vehicle } from "@/types";
import { getVehicleById } from "@/features/vehicles-pricelist/services/api";

export default function DetailPricelist() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getVehicleById(id as string)
      .then((data) => {
        setVehicle(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching vehicle:", err);
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading...
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        Vehicle not found or failed to load.
      </div>
    );
  }

  return <VehicleDetailClient vehicle={vehicle} />;
}