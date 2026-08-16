import React from "react";
import { Plus, Clock, X } from "lucide-react";
import { TourPackageFormData } from "@/types";

interface Step4Props {
  formData: TourPackageFormData;
  setFormData: React.Dispatch<React.SetStateAction<TourPackageFormData>>;
}

export default function Step4Itinerary({ formData, setFormData }: Step4Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">
          Travel Itinerary / Rundown
        </h3>
        <button
          onClick={() => {
            const newDay = {
              day: formData.itineraryDays.length + 1,
              title: "",
              activities: [{ time: "08:00", description: "", type: "Covered" }],
            };
            setFormData({ ...formData, itineraryDays: [...formData.itineraryDays, newDay] });
          }}
          className="text-sm font-semibold text-blue-900 flex items-center gap-1 hover:underline"
        >
          <Plus size={16} /> Add Day
        </button>
      </div>

      <div className="space-y-4">
        {formData.itineraryDays.map((dayObj, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-gray-50 rounded-xl border border-gray-200 p-4"
          >
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900">Day {dayObj.day}</h4>
                <button
                  onClick={() => {
                    const newDays = [...formData.itineraryDays];
                    const currentActivities = newDays[dayIndex].activities || [];
                    newDays[dayIndex].activities = [
                      ...currentActivities,
                      {
                        time: "12:00",
                        description: "",
                        type: "Covered",
                      }
                    ];
                    setFormData({ ...formData, itineraryDays: newDays });
                  }}
                  className="text-sm font-semibold text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus size={14} /> Activity
                </button>
              </div>
              <input
                type="text"
                value={dayObj.title || ""}
                onChange={(e) => {
                  const newDays = [...formData.itineraryDays];
                  newDays[dayIndex].title = e.target.value;
                  setFormData({ ...formData, itineraryDays: newDays });
                }}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                placeholder="Day Theme (e.g. Arrival & City Tour)"
              />
            </div>

            <div className="space-y-3">
              {(dayObj.activities || []).map((activity, actIndex) => (
                <div key={actIndex} className="flex items-center gap-3">
                  <div className="relative w-30">
                    <input
                      type="time"
                      value={activity.time}
                      onChange={(e) => {
                        const newDays = [...formData.itineraryDays];
                        const activities = [...(newDays[dayIndex].activities || [])];
                        activities[actIndex] = {
                          ...activities[actIndex],
                          time: e.target.value,
                        };
                        newDays[dayIndex].activities = activities;
                        setFormData({ ...formData, itineraryDays: newDays });
                      }}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    value={activity.description}
                    onChange={(e) => {
                      const newDays = [...formData.itineraryDays];
                      const activities = [...(newDays[dayIndex].activities || [])];
                      activities[actIndex] = {
                        ...activities[actIndex],
                        description: e.target.value,
                      };
                      newDays[dayIndex].activities = activities;
                      setFormData({ ...formData, itineraryDays: newDays });
                    }}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                    placeholder="Activity..."
                  />
                  <select
                    value={activity.type}
                    onChange={(e) => {
                      const newDays = [...formData.itineraryDays];
                      const activities = [...(newDays[dayIndex].activities || [])];
                      activities[actIndex] = {
                        ...activities[actIndex],
                        type: e.target.value,
                      };
                      newDays[dayIndex].activities = activities;
                      setFormData({ ...formData, itineraryDays: newDays });
                    }}
                    className="w-32 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
                  >
                    <option value="Covered">Covered</option>
                    <option value="Personal Expense">Personal</option>
                    <option value="None">None</option>
                  </select>
                  <button
                    onClick={() => {
                      const newDays = [...formData.itineraryDays];
                      newDays[dayIndex].activities = (newDays[dayIndex].activities || []).filter(
                        (_, idx) => idx !== actIndex
                      );
                      setFormData({ ...formData, itineraryDays: newDays });
                    }}
                    className="p-2 text-red-400 hover:text-red-600 cursor-pointer shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
