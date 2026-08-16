import { TourPackage, ItineraryDay, ItineraryActivity } from "@/types";
import { useTranslations } from "next-intl";

interface Props {
    tour: TourPackage;
}

export default function DetailItinerarySection({ tour }: Props) {
    const t = useTranslations("TourDetail");
    const itinerary: ItineraryDay[] = tour.itinerary || [];

    if (itinerary.length === 0) {
        return null; // hide section if no itinerary
    }

    return (
        <div>
            <h3 className="font-semibold mb-6 text-xl md:text-2xl">
                {t("itinerary")}
            </h3>

            <div className="space-y-8">
                {itinerary.map((dayObj: ItineraryDay, idx: number) => (
                    <div key={idx} className="flex gap-4">

                        {/* NUMBER + LINE */}
                        <div className="flex flex-col items-center">
                            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-900 text-white text-sm shrink-0">
                                {dayObj.day}
                            </div>
                            <div className="flex-1 w-[2px] bg-gray-300 mt-1 min-h-[40px]"></div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 pb-4">
                            <h4 className="font-medium text-gray-800 mb-3">
                                {t("day")} {dayObj.day} {dayObj.title ? `– ${dayObj.title}` : ""}
                            </h4>

                            <div className="space-y-4 text-sm text-gray-600">
                                {dayObj.activities?.map((act: ItineraryActivity, actIdx: number) => (
                                    <div key={actIdx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                                        <span>
                                            <strong className="font-medium">{act.time}</strong> – {act.description}
                                        </span>

                                        {act.type === "Covered" && (
                                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full whitespace-nowrap">
                                                ✔ {t("covered")}
                                            </span>
                                        )}
                                        {act.type === "Personal Expense" && (
                                            <span className="flex items-center gap-1 text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full whitespace-nowrap">
                                                ⚠ {t("personalExpense")}
                                            </span>
                                        )}
                                        {/* If type is "None", render nothing */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
