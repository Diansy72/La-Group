"use client";

import React, { useState } from "react";
import { X, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "@/components/atoms/button";
import { TourPackage, TourPackageFormData } from "@/types";

// Import step components
import Step1BasicInfo from "./TourPackageSteps/Step1BasicInfo";
import Step2Pricing from "./TourPackageSteps/Step2Pricing";
import Step3Summary from "./TourPackageSteps/Step3Summary";
import Step4Itinerary from "./TourPackageSteps/Step4Itinerary";

interface TourPackageFormProps {
  initialData?: TourPackage;
  onClose: () => void;
  onSave: (pkg: TourPackage) => void;
}

export default function TourPackageForm({ initialData, onClose, onSave }: TourPackageFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [currentTag, setCurrentTag] = useState("");

  const [formData, setFormData] = useState<TourPackageFormData>({
    title: initialData?.title || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    destinationTags: initialData?.destinationTags || [],
    includes: initialData?.includes?.length ? initialData.includes : [""],
    excludes: initialData?.excludes?.length ? initialData.excludes : [""],
    priceType: initialData?.priceType || "per_car",
    recommendation: initialData?.recommendation || "None",
    durationDays: initialData?.duration ? parseInt(initialData.duration) || 1 : 1,
    durationNights: initialData?.duration ? (parseInt(initialData.duration) - 1) || 0 : 0,
    pricingOptions: initialData?.vehicleOptions?.map(v => ({
      id: v.id,
      type: initialData.priceType || "per_car",
      vehicleName: v.name,
      capacity: v.capacity,
      price: v.pricePerDay
    })) || [],
    itineraryDays: initialData?.itinerary?.length ? initialData.itinerary : [
      {
        day: 1,
        title: "",
        activities: [{ time: "08:00", description: "", type: "Covered" }],
      },
    ],
  });

  const buildPackageData = (status: "active" | "draft"): TourPackage => {
    return {
      id: initialData?.id || `pkg-${Date.now()}`,
      title: formData.title,
      titleEn: formData.title,
      description: formData.description,
      descriptionEn: formData.description,
      imageUrl: formData.imageUrl || "",
      estimatedPrice: formData.pricingOptions.length > 0 ? formData.pricingOptions[0].price : 0,
      duration: formData.durationDays === formData.durationNights + 1
        ? `${formData.durationDays} Days ${formData.durationNights} Nights`
        : `${formData.durationDays} Day${formData.durationDays > 1 ? "s" : ""} ${formData.durationNights > 0 ? `${formData.durationNights} Night${formData.durationNights > 1 ? "s" : ""}` : ""}`.trim(),
      minPax: 0,
      maxPax: 0,
      startTime: "",
      endTime: "",
      includes: formData.includes.filter(Boolean),
      excludes: formData.excludes.filter(Boolean),
      vehicleOptions: formData.pricingOptions.map((po) => ({
        id: po.id,
        name: po.vehicleName || "",
        capacity: po.capacity || 0,
        pricePerDay: po.price,
      })),
      category: formData.category,
      priceType: formData.priceType,
      recommendation: formData.recommendation === "None" ? null : formData.recommendation,
      destinationTags: formData.destinationTags,
      status,
      itinerary: formData.itineraryDays,
    };
  };

  const handleSave = () => {
    const newPkg = buildPackageData("active");
    onSave(newPkg);
  };

  const handleSaveDraft = () => {
    const newPkg = buildPackageData("draft");
    onSave(newPkg);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      {/* Form Header & Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Tour Package" : "Create Tour Package"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center w-full gap-2 mb-3">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-colors",
                step <= currentStep ? "bg-blue-900" : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <span
            className={cn(
              "text-xs font-semibold w-1/4 text-center",
              currentStep === 1 ? "text-blue-900" : "text-gray-500"
            )}
          >
            Basic Info
          </span>
          <span
            className={cn(
              "text-xs font-semibold w-1/4 text-center",
              currentStep === 2 ? "text-blue-900" : "text-gray-500"
            )}
          >
            Vehicles & Pricing
          </span>
          <span
            className={cn(
              "text-xs font-semibold w-1/4 text-center",
              currentStep === 3 ? "text-blue-900" : "text-gray-500"
            )}
          >
            Vehicle Summary
          </span>
          <span
            className={cn(
              "text-xs font-semibold w-1/4 text-center",
              currentStep === 4 ? "text-blue-900" : "text-gray-500"
            )}
          >
            Itinerary
          </span>
        </div>
      </div>

      {/* Steps Content */}
      {currentStep === 1 && (
        <Step1BasicInfo
          formData={formData}
          setFormData={setFormData}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
        />
      )}
      {currentStep === 2 && <Step2Pricing formData={formData} setFormData={setFormData} />}
      {currentStep === 3 && <Step3Summary formData={formData} setFormData={setFormData} />}
      {currentStep === 4 && <Step4Itinerary formData={formData} setFormData={setFormData} />}

      {/* Step Navigation */}
      <div className="flex items-center gap-3 mt-8 pt-5">
        <Button
          variant="blue"
          onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose())}
          className="bg-gray-50 text-gray-500 border-transparent hover:bg-gray-200"
        >
          Back
        </Button>
        {currentStep < totalSteps ? (
          <>
            <Button
              className="bg-[#003B73] hover:bg-[#002A54] text-white"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 &&
                  (!formData.title || !formData.category || !formData.description)) ||
                (currentStep === 3 && formData.pricingOptions.length === 0)
              }
            >
              Next Step
            </Button>
            <Button
              variant="blue"
              onClick={handleSaveDraft}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-transparent"
            >
              Save Draft
            </Button>
          </>
        ) : (
          <Button
            className="bg-blue-900 hover:bg-blue-800 text-white"
            icon={<Check size={16} />}
            onClick={handleSave}
          >
            Save Package
          </Button>
        )}
      </div>
    </div>
  );
}
