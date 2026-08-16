"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  OrnamentCorner,
  BatikPattern,
} from "@/components/atoms/wayang-ornament";

export default function MissionVisionSection() {
  const t = useTranslations("About.missionVision");

  const missions = [
    {
      title: t("missions.item1.title"),
      description: t("missions.item1.description"),
    },
    {
      title: t("missions.item2.title"),
      description: t("missions.item2.description"),
    },
    {
      title: t("missions.item3.title"),
      description: t("missions.item3.description"),
    },
    {
      title: t("missions.item4.title"),
      description: t("missions.item4.description"),
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-(--primary)/95 shadow-2xl">
          {/* Batik Pattern */}
          <BatikPattern className="absolute inset-0 opacity-25" />

          {/* Corner Ornaments */}
          <OrnamentCorner className="absolute top-0 left-0 z-10 h-24 w-24 md:h-36 md:w-36 text-yellow-400/90" />
          <OrnamentCorner className="absolute top-0 right-0 z-10 h-24 w-24 md:h-36 md:w-36 scale-x-[-1] text-yellow-400/90" />
          <OrnamentCorner className="absolute bottom-0 left-0 z-10 h-24 w-24 md:h-36 md:w-36 scale-y-[-1] text-yellow-400/90" />
          <OrnamentCorner className="absolute bottom-0 right-0 z-10 h-24 w-24 md:h-36 md:w-36 scale-[-1] text-yellow-400/90" />

          {/* Glow Effects */}
          <div className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/20 blur-[180px]" />
          <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-white/10 blur-[140px]" />
          <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-white/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-black/20 blur-[160px]" />

          {/* Content */}
          <div className="relative z-20 px-6 py-12 md:px-12 md:py-16">
            {/* Header */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-yellow-400 md:text-6xl">
                {t("title")}
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Mission */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
                <h3 className="mb-6 text-2xl font-semibold text-yellow-400 md:text-3xl">
                  {t("missionTitle")}
                </h3>

                <div className="space-y-5">
                  {missions.map((mission, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400/15">
                        <Check className="h-4 w-4 text-yellow-400" />
                      </div>

                      <div>
                        <h4 className="font-medium text-white">
                          {mission.title}
                        </h4>

                        <p className="mt-1 text-sm leading-relaxed text-gray-300">
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision */}
              <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
                <h3 className="mb-6 text-2xl font-semibold text-yellow-400 md:text-3xl">
                  {t("visionTitle")}
                </h3>

                <p className="text-lg leading-relaxed text-gray-100">
                  {t("vision")}
                </p>

                <div className="mt-8 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

                <p className="mt-8 text-sm leading-relaxed text-gray-300">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}