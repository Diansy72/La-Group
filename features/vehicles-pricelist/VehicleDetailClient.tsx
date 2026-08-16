"use client";

import { useState, useMemo, useEffect } from "react";
import { Vehicle, RentalPackage } from "@/types";
import DetailHeroSection from "./DetailHeroSection";
import DetailSpecSection from "./DetailSpecSection";
import DetailFacilitiesSection from "./DetailFacilitiesSection";
import DetailInfoSection from "./DetailInfoSection";

type Props = {
  vehicle: Vehicle;
};

export default function VehicleDetailClient({ vehicle }: Props) {
  // If it's not a car or doesn't have packages, render standard legacy behavior
  const isCar = vehicle.type === "car";
  const hasPackages = vehicle.packages && vehicle.packages.length > 0;

  // Filter packages that have a valid price > 0
  const activePackages = useMemo(() => {
    if (!vehicle.packages) return [];
    return vehicle.packages.filter((pkg) => pkg.price > 0);
  }, [vehicle.packages]);

  // Determine initial state from the first active package, or default values
  const defaultPackage = activePackages[0];

  const [selectedDuration, setSelectedDuration] = useState<"full_day" | "half_day">("full_day");
  const [selectedDriver, setSelectedDriver] = useState<"self_drive" | "with_driver">("self_drive");
  const [selectedFuel, setSelectedFuel] = useState<"with_fuel" | "without_fuel">("without_fuel");

  // Sync state with default package once loaded
  useEffect(() => {
    if (defaultPackage) {
      setSelectedDuration(defaultPackage.duration as "full_day" | "half_day");
      setSelectedDriver(defaultPackage.driverType as "self_drive" | "with_driver");
      setSelectedFuel(defaultPackage.fuelOption as "with_fuel" | "without_fuel");
    }
  }, [defaultPackage]);

  // Find the currently selected package matching the active states
  const selectedPackage = useMemo(() => {
    if (!hasPackages || activePackages.length === 0) return null;
    
    // Try to find exact match
    const match = activePackages.find(
      (pkg) =>
        pkg.duration === selectedDuration &&
        pkg.driverType === selectedDriver &&
        pkg.fuelOption === selectedFuel
    );
    
    if (match) return match;

    // If no exact match, find the first package matching the changed selection
    // For example, if we changed driverType, find one matching that driverType
    return activePackages[0] || null;
  }, [activePackages, selectedDuration, selectedDriver, selectedFuel, hasPackages]);

  // Automatically update other options if the exact combination doesn't exist
  // but there is another active package with the newly selected option
  const handleSelectDuration = (duration: "full_day" | "half_day") => {
    setSelectedDuration(duration);
    const possible = activePackages.find((p) => p.duration === duration);
    if (possible) {
      // Check if we can keep current driver and fuel
      const exact = activePackages.find(
        (p) => p.duration === duration && p.driverType === selectedDriver && p.fuelOption === selectedFuel
      );
      if (!exact) {
        // Fallback to what's available for this duration
        const matchDriver = activePackages.find((p) => p.duration === duration && p.driverType === selectedDriver);
        if (matchDriver) {
          setSelectedFuel(matchDriver.fuelOption as "with_fuel" | "without_fuel");
        } else {
          setSelectedDriver(possible.driverType as "self_drive" | "with_driver");
          setSelectedFuel(possible.fuelOption as "with_fuel" | "without_fuel");
        }
      }
    }
  };

  const handleSelectDriver = (driver: "self_drive" | "with_driver") => {
    setSelectedDriver(driver);
    const possible = activePackages.find((p) => p.driverType === driver);
    if (possible) {
      const exact = activePackages.find(
        (p) => p.duration === selectedDuration && p.driverType === driver && p.fuelOption === selectedFuel
      );
      if (!exact) {
        const matchDuration = activePackages.find((p) => p.driverType === driver && p.duration === selectedDuration);
        if (matchDuration) {
          setSelectedFuel(matchDuration.fuelOption as "with_fuel" | "without_fuel");
        } else {
          setSelectedDuration(possible.duration as "full_day" | "half_day");
          setSelectedFuel(possible.fuelOption as "with_fuel" | "without_fuel");
        }
      }
    }
  };

  const handleSelectFuel = (fuel: "with_fuel" | "without_fuel") => {
    setSelectedFuel(fuel);
    const possible = activePackages.find((p) => p.fuelOption === fuel);
    if (possible) {
      const exact = activePackages.find(
        (p) => p.duration === selectedDuration && p.driverType === selectedDriver && p.fuelOption === fuel
      );
      if (!exact) {
        const matchDuration = activePackages.find((p) => p.fuelOption === fuel && p.duration === selectedDuration);
        if (matchDuration) {
          setSelectedDriver(matchDuration.driverType as "self_drive" | "with_driver");
        } else {
          setSelectedDuration(possible.duration as "full_day" | "half_day");
          setSelectedDriver(possible.driverType as "self_drive" | "with_driver");
        }
      }
    }
  };

  // Check which individual options are available at all across all active packages
  const availableDurations = useMemo(() => new Set(activePackages.map((p) => p.duration)), [activePackages]);
  const availableDrivers = useMemo(() => new Set(activePackages.map((p) => p.driverType)), [activePackages]);
  const availableFuels = useMemo(() => new Set(activePackages.map((p) => p.fuelOption)), [activePackages]);

  // Construct active vehicle state mapping selected package fields
  const activeVehicle: Vehicle = useMemo(() => {
    if (!isCar || !selectedPackage) return vehicle;
    return {
      ...vehicle,
      pricePerDay: selectedPackage.price,
      rentalDuration: selectedPackage.duration === "full_day" ? "Full Day" : "Half Day",
      selfDrive: selectedPackage.driverType === "self_drive",
      withFuel: selectedPackage.fuelOption === "with_fuel",
    };
  }, [vehicle, selectedPackage, isCar]);

  return (
    <div className="min-h-screen w-full">
      <DetailHeroSection
        vehicle={activeVehicle}
        packages={isCar ? activePackages : undefined}
        selectedDuration={isCar ? selectedDuration : undefined}
        selectedDriver={isCar ? selectedDriver : undefined}
        selectedFuel={isCar ? selectedFuel : undefined}
      />
      <DetailSpecSection
        vehicle={activeVehicle}
        packages={isCar ? activePackages : undefined}
        selectedDuration={isCar ? selectedDuration : undefined}
        selectedDriver={isCar ? selectedDriver : undefined}
        selectedFuel={isCar ? selectedFuel : undefined}
        onSelectDuration={isCar ? handleSelectDuration : undefined}
        onSelectDriver={isCar ? handleSelectDriver : undefined}
        onSelectFuel={isCar ? handleSelectFuel : undefined}
        availableDurations={isCar ? availableDurations : undefined}
        availableDrivers={isCar ? availableDrivers : undefined}
        availableFuels={isCar ? availableFuels : undefined}
      />
      <DetailFacilitiesSection vehicle={activeVehicle} />
      <DetailInfoSection vehicle={activeVehicle} />
    </div>
  );
}
