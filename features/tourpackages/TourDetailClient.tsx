"use client";

import { TourPackage } from "@/types";
import { useState, useEffect, useCallback } from "react";
import DetailHeroSection from "./DetailHeroSection";
import DetailInfoSection from "./DetailInfoSection";
import DetailVehicleSection from "./DetailVehicleSection";
import DetailItinerarySection from "./DetailItinerarySection";
import DetailSidebarSection from "./DetailSidebarSection";
import BookingFormSection, {
  BookingFormData,
} from "./BookingFormSection";

import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-hot-toast";

type Props = {
  tour: TourPackage;
};

export default function TourDetailClient({ tour }: Props) {
  const t = useTranslations("TourDetail");
  const locale = useLocale();

  const [participants, setParticipants] = useState(10);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  useEffect(() => {
    if (tour && tour.vehicleOptions && tour.vehicleOptions.length > 0) {
      // Avoid out of bounds if selectedVehicle is somehow larger
      const index = selectedVehicle >= tour.vehicleOptions.length ? 0 : selectedVehicle;
      setParticipants(tour.vehicleOptions[index].capacity);
    }
  }, [selectedVehicle, tour]);

  // ===== Booking Form State =====
  const [bookingData, setBookingData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    originCity: "",
    pickupPoint: "",
    startDate: "",
    endDate: "",
  });

  const [bookingErrors, setBookingErrors] = useState<
    Partial<Record<keyof BookingFormData, boolean>>
  >({});

  const validateBookingForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, boolean>> = {};
    const fields: (keyof BookingFormData)[] = [
      "fullName",
      "email",
      "phone",
      "originCity",
      "pickupPoint",
      "startDate",
      "endDate",
    ];

    let firstErrorField: string | null = null;

    for (const field of fields) {
      if (!bookingData[field].trim()) {
        newErrors[field] = true;
        if (!firstErrorField) {
          firstErrorField = field;
        }
      }
    }

    setBookingErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(t("validationError"));

      // Scroll to form
      const formEl = document.getElementById("booking-information-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Focus first error field after scroll animation
      if (firstErrorField) {
        setTimeout(() => {
          const inputEl = document.getElementById(
            `booking-${firstErrorField}`
          );
          if (inputEl) {
            inputEl.focus();
          }
        }, 500);
      }

      return false;
    }

    return true;
  }, [bookingData, t]);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleOrder = useCallback(() => {
    if (!tour) return;

    const vehicles = tour.vehicleOptions || [];
    const selected = vehicles[selectedVehicle] || vehicles[0];
    if (!selected) return;

    // Validate form first
    if (!validateBookingForm()) return;

    const isGroup = tour.priceType === "per_person";
    const packageType = isGroup ? t("groupType") : t("privateType");
    const totalFixedPrice = selected.pricePerDay * selected.capacity;
    const totalPrice = isGroup ? totalFixedPrice : selected.pricePerDay;
    const paxCount = isGroup ? participants : selected.capacity;
    const title = locale === "en" && tour.titleEn ? tour.titleEn : tour.title;

    // Existing package message
    const packageMessage = t("waMessage", {
      title,
      type: packageType,
      vehicle: selected.name,
      pax: paxCount,
      price: totalPrice.toLocaleString(),
    });

    // Customer information section
    const customerSection = [
      "",
      "━━━━━━━━━━━━━━",
      "",
      "*CUSTOMER INFORMATION*",
      "",
      `- *Full Name*: ${bookingData.fullName.trim()}`,
      `- *Email*: ${bookingData.email.trim()}`,
      `- *Phone Number*: ${bookingData.phone.trim()}`,
      `- *Origin City*: ${bookingData.originCity.trim()}`,
      `- *Pickup Point*: ${bookingData.pickupPoint.trim()}`,
      `- *Trip Start Date*: ${formatDate(bookingData.startDate)}`,
      `- *Trip End Date*: ${formatDate(bookingData.endDate)}`,
      "",
      "━━━━━━━━━━━━━━",
      "",
      "Please provide availability and booking confirmation.",
      "",
      "Thank you.",
    ].join("\n");

    const fullMessage = packageMessage + customerSection;

    const phoneNumber = "6281211190448";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`,
      "_blank"
    );
  }, [tour, selectedVehicle, participants, bookingData, validateBookingForm, t, locale]);

  const vehicles = tour.vehicleOptions || [];
  const selected = vehicles[selectedVehicle] || vehicles[0];

  return (
    <div className="min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <DetailHeroSection tour={tour} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-8">
            <DetailInfoSection tour={tour} />

            {vehicles.length > 0 && selected && (
              <DetailVehicleSection
                tour={tour}
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                participants={participants}
                setParticipants={setParticipants}
                selected={selected}
              />
            )}

            <DetailItinerarySection tour={tour} />
          </div>

          {/* RIGHT */}
          {selected && (
            <div className="space-y-6">
              <DetailSidebarSection
                tour={tour}
                selected={selected}
                participants={participants}
                onOrder={handleOrder}
              />

              <BookingFormSection
                bookingData={bookingData}
                setBookingData={setBookingData}
                errors={bookingErrors}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
