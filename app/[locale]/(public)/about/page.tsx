"use client";

import CompanyProfile from "@/features/about-us/CompanyProfile";
import MissionVisionSection from "@/features/about-us/MissionVisionSection";
import CompanyHistory from "@/features/about-us/CompanyHistory";
import Gallery from "@/features/about-us/Gallery";
import Collaboration from "@/features/about-us/Collaboration";
import Hero from "@/components/organisms/Hero";
import { useTranslations } from "next-intl";

export default function AboutUsPage() {
  const t = useTranslations("About");

  return (
    <>
      {/* ===== HERO ===== */}
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        layout="center"
      />
      <CompanyProfile />
      <MissionVisionSection />
      <CompanyHistory />
      <Gallery />
      <Collaboration />
    </>
  );
}
