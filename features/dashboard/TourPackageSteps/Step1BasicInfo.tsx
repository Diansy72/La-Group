import React from "react";
import { cn } from "@/lib/cn";
import { Car, Bus, X, Plus, Check } from "lucide-react";
import Button from "@/components/atoms/button";
import ImageUpload from "@/components/molecules/ImageUpload";
import { TourPackageFormData } from "@/types";

const CATEGORIES = ["Private", "Group"];

interface Step1Props {
  formData: TourPackageFormData;
  setFormData: React.Dispatch<React.SetStateAction<TourPackageFormData>>;
  currentTag: string;
  setCurrentTag: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step1BasicInfo({
  formData,
  setFormData,
  currentTag,
  setCurrentTag,
}: Step1Props) {
  return (
    <div className="space-y-6">
      <ImageUpload
        label="Package Hero Image"
        value={formData.imageUrl}
        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
        className="mb-6 w-full"
        aspectRatio="aspect-[8/1]"
        folder="tour-packages"
      />

      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          STEP 1 — SELECT PRICING TYPE
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              if (formData.priceType !== "per_car") {
                setFormData({ ...formData, priceType: "per_car", pricingOptions: [] });
              }
            }}
            className={cn(
              "p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2",
              formData.priceType === "per_car"
                ? "border-blue-900 bg-blue-900/5"
                : "border-gray-200 bg-gray-50 hover:border-blue-900/50"
            )}
          >
            <Car
              size={24}
              className={
                formData.priceType === "per_car"
                  ? "text-blue-900"
                  : "text-gray-500"
              }
            />
            <div>
              <p className="font-bold text-gray-900">Price per Car</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Avanza, Xpander, Innova, Alphard, dll
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              if (formData.priceType !== "per_person") {
                setFormData({ ...formData, priceType: "per_person", pricingOptions: [] });
              }
            }}
            className={cn(
              "p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2",
              formData.priceType === "per_person"
                ? "border-blue-900 bg-blue-900/5"
                : "border-gray-200 bg-gray-50 hover:border-blue-900/50"
            )}
          >
            <Bus
              size={24}
              className={
                formData.priceType === "per_person"
                  ? "text-blue-900"
                  : "text-gray-500"
              }
            />
            <div>
              <p className="font-bold text-gray-900">Price per Person</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Minibus, Medium Bus, Long Bus
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            Package Name
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            placeholder="e.g. Bali Explorer"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Recommendation
            </label>
            <select
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value as "New" | "Best Seller" | "Recommended" | "None" })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
            >
              <option value="None">None</option>
              <option value="New">New</option>
              <option value="Best Seller">Best Seller</option>
              <option value="Recommended">Recommended</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
          placeholder="Enter package description..."
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Trip Duration
        </label>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 text-sm text-blue-900 font-semibold text-center shrink-0">
            {formData.durationDays} Day{formData.durationDays > 1 ? "s" : ""}{" "}
            {formData.durationNights > 0 ? `${formData.durationNights} Night${formData.durationNights > 1 ? "s" : ""}` : ""}
          </div>
          <span className="text-gray-400 font-bold">—</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            />
            <span className="text-sm text-gray-600 font-medium">Day</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={formData.durationNights}
              onChange={(e) => setFormData({ ...formData, durationNights: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            />
            <span className="text-sm text-gray-600 font-medium">Night</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Destination Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentTag.trim()) {
                e.preventDefault();
                if (!formData.destinationTags.includes(currentTag.trim())) {
                  setFormData((prev) => ({
                    ...prev,
                    destinationTags: [...prev.destinationTags, currentTag.trim()],
                  }));
                }
                setCurrentTag("");
              }
            }}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            placeholder="Add destination..."
          />
          <Button
            variant="blue"
            className="bg-blue-900/10 text-blue-900 border-transparent hover:bg-blue-900/20"
            onClick={() => {
              if (currentTag.trim() && !formData.destinationTags.includes(currentTag.trim())) {
                setFormData((prev) => ({
                  ...prev,
                  destinationTags: [...prev.destinationTags, currentTag.trim()],
                }));
                setCurrentTag("");
              }
            }}
          >
            Add
          </Button>
        </div>
        {formData.destinationTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.destinationTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-500"
              >
                {tag}
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      destinationTags: prev.destinationTags.filter((t) => t !== tag),
                    }))
                  }
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-green-600 mb-2">
      <Check size={16} /> Included Costs
    </label>

    {formData.includes.map((item, i) => (
      <div key={i} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={item}
          onChange={(e) => {
            const newIncludes = [...formData.includes];
            newIncludes[i] = e.target.value;
            setFormData({ ...formData, includes: newIncludes });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && i === formData.includes.length - 1) {
              e.preventDefault();
              setFormData({
                ...formData,
                includes: [...formData.includes, ""],
              });
            }
          }}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          placeholder="e.g. Fuel"
        />

        <button
          type="button"
          onClick={() => {
            if (i === formData.includes.length - 1) {
              setFormData({
                ...formData,
                includes: [...formData.includes, ""],
              });
            } else {
              const newIncludes = formData.includes.filter(
                (_, idx) => idx !== i
              );
              setFormData({
                ...formData,
                includes: newIncludes,
              });
            }
          }}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer shrink-0",
            i === formData.includes.length - 1
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
          )}
        >
          {i === formData.includes.length - 1 ? (
            <Plus size={16} />
          ) : (
            <X size={14} />
          )}
        </button>
      </div>
    ))}
  </div>

  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-red-500 mb-2">
      <X size={16} /> Not Included
    </label>

    {formData.excludes.map((item, i) => (
      <div key={i} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={item}
          onChange={(e) => {
            const newExcludes = [...formData.excludes];
            newExcludes[i] = e.target.value;
            setFormData({ ...formData, excludes: newExcludes });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && i === formData.excludes.length - 1) {
              e.preventDefault();
              setFormData({
                ...formData,
                excludes: [...formData.excludes, ""],
              });
            }
          }}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          placeholder="e.g. Lunch"
        />

        <button
          type="button"
          onClick={() => {
            if (i === formData.excludes.length - 1) {
              setFormData({
                ...formData,
                excludes: [...formData.excludes, ""],
              });
            } else {
              const newExcludes = formData.excludes.filter(
                (_, idx) => idx !== i
              );
              setFormData({
                ...formData,
                excludes: newExcludes,
              });
            }
          }}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer shrink-0",
            i === formData.excludes.length - 1
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
          )}
        >
          {i === formData.excludes.length - 1 ? (
            <Plus size={16} />
          ) : (
            <X size={14} />
          )}
        </button>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
