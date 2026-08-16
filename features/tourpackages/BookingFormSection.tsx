"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/atoms/input";

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  originCity: string;
  pickupPoint: string;
  startDate: string;
  endDate: string;
}

interface BookingFormSectionProps {
  bookingData: BookingFormData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  errors: Partial<Record<keyof BookingFormData, boolean>>;
}

export default function BookingFormSection({
  bookingData,
  setBookingData,
  errors,
}: BookingFormSectionProps) {
  const t = useTranslations("TourDetail");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      id="booking-information-form"
      className="bg-white rounded-xl shadow p-6 h-fit space-y-4"
    >
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
        {t("bookingInfoTitle")}
      </h3>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="booking-fullName"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("fullNameLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-fullName"
            name="fullName"
            value={bookingData.fullName}
            onChange={handleChange}
            placeholder={t("fullNameLabel")}
            className={errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="booking-email"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("emailLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-email"
            name="email"
            type="email"
            value={bookingData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="booking-phone"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("phoneLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-phone"
            name="phone"
            type="tel"
            value={bookingData.phone}
            onChange={handleChange}
            placeholder="+628123456789"
            className={errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>

        {/* Origin City */}
        <div>
          <label
            htmlFor="booking-originCity"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("originCityLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-originCity"
            name="originCity"
            value={bookingData.originCity}
            onChange={handleChange}
            placeholder={t("originCityLabel")}
            className={errors.originCity ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>

        {/* Pickup Point */}
        <div>
          <label
            htmlFor="booking-pickupPoint"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("pickupPointLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-pickupPoint"
            name="pickupPoint"
            value={bookingData.pickupPoint}
            onChange={handleChange}
            placeholder={t("pickupPointLabel")}
            className={errors.pickupPoint ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor="booking-startDate"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("startDateLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-startDate"
            name="startDate"
            type="date"
            value={bookingData.startDate}
            onChange={handleChange}
            className={errors.startDate ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="booking-endDate"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {t("endDateLabel")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="booking-endDate"
            name="endDate"
            type="date"
            value={bookingData.endDate}
            onChange={handleChange}
            className={errors.endDate ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
        </div>
      </div>
    </div>
  );
}
