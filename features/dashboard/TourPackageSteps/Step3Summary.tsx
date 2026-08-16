import React from "react";
import { PackageOpen, Trash2 } from "lucide-react";
import { TourPackageFormData } from "@/types";
import { formatCurrency } from "@/features/dashboard/services/data";

interface Step3Props {
  formData: TourPackageFormData;
  setFormData: React.Dispatch<React.SetStateAction<TourPackageFormData>>;
}

export default function Step3Summary({ formData, setFormData }: Step3Props) {
  const handleDeletePricing = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingOptions: prev.pricingOptions.filter((po) => po.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-900">
          Included Vehicle Summary
        </h3>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        {formData.pricingOptions.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <PackageOpen size={48} className="text-gray-400 mb-3" />
            <p className="text-sm text-gray-500">
              No vehicles added yet. Go to Step 2 to add vehicles.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-500">
                  Package Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">
                  Price Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500">
                  Vehicles / Capacity
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.pricingOptions.map((po) => (
                <tr
                  key={po.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {formData.title || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formData.category || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {po.type === "per_car" ? "Per Car" : "Per Person"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatCurrency(po.price)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {po.vehicleName ? `${po.vehicleName} (${po.capacity} Persons)` : `${po.capacity} Persons`}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeletePricing(po.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer inline-flex"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
