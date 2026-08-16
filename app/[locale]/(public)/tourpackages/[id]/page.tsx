"use client";

import { useParams } from "next/navigation";
import { TourPackage } from "@/types";
import { useState, useEffect } from "react";
import TourDetailClient from "@/features/tourpackages/TourDetailClient";
import { useTranslations } from "next-intl";

export default function TourDetailPage() {
  const { id } = useParams();
  const t = useTranslations("TourDetail");

  const [tour, setTour] = useState<TourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetch(`/api/tours/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setTour(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tour:", err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        {t("loading")}
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        {t("notFound")}
      </div>
    );
  }

  return <TourDetailClient tour={tour} />;
}
