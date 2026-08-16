"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactInfo() {
  const t = useTranslations("ContactPage.info");

  const data = [
    {
      title: t("telephone"),
      value: "+62 812 1119 0448",
      icon: Phone,
    },
    {
      title: t("whatsapp"),
      value: "+62 812 1119 0448",
      icon: MessageCircle,
    },
    {
      title: t("email"),
      value: "Lagarage.official@gmail.com",
      icon: Mail,
    },
    {
      title: t("address"),
      value:
        "Jl. Arjuna No.2, Sidokerto, Purwomartani, Kalasan, Sleman, Yogyakarta",
      icon: MapPin,
    },
    {
      title: t("hours"),
      value: t("hoursDetail"),
      icon: Clock,
    },
  ];
  return (
    <div className="">
      <h2 className="text-2xl md:text-4xl font-medium mb-6 text-gray-800">
        {t("title")}
        <span className="block w-20 h-1  bg-yellow-400 mt-3 rounded-full"></span>

      </h2>

      <div className="space-y-6">
        {data.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={i} className="flex gap-4 items-start">
              <div className="bg-blue-900 text-white p-3 md:p-4 rounded-lg">
                <Icon className="w-4 h-4 md:w-6 md:h-6" />
              </div>

              <div>
                <p className="text-base md:text-lg font-medium text-gray-800">
                  {item.title}
                </p>
                <p className="text-sm md:text-base text-gray-600 whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}