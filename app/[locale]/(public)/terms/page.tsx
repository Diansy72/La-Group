"use client";

import Hero from "@/components/organisms/Hero";
import HeroCards from "@/components/molecules/HeroCards";
import Policies from "@/features/terms/Policies";
import CTA from "@/components/organisms/CTA";
import {
  ShieldCheck,
  Eye,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";


export default function TermsPage() {
  const t = useTranslations("Terms");

  const policies = [
    {
      title: t("policies.requirementsTitle"),
      subtitle: t("policies.requirementsSubtitle"),
      content: t("policies.requirementsContent"),
    },
    {
      title: t("policies.generalTitle"),
      subtitle: t("policies.generalSubtitle"),
      content: t("policies.generalContent"),
    },
    {
      title: t("policies.paymentTitle"),
      subtitle: t("policies.paymentSubtitle"),
      content: t("policies.paymentContent"),
    },
    {
      title: t("policies.liabilityTitle"),
      subtitle: t("policies.liabilitySubtitle"),
      content: t("policies.liabilityContent"),
    },
    {
      title: t("policies.handoverTitle"),
      subtitle: t("policies.handoverSubtitle"),
      content: t("policies.handoverContent"),
    },
    {
      title: t("policies.legalTitle"),
      subtitle: t("policies.legalSubtitle"),
      content: t("policies.legalContent"),
    },
  ];


  const heroCards = [
    {
      title: t("cards.card1Title"),
      description: t("cards.card1Desc"),
      icon: ShieldCheck,
    },
    {
      title: t("cards.card2Title"),
      description: t("cards.card2Desc"),
      icon: Eye,
    },
    {
      title: t("cards.card3Title"),
      description: t("cards.card3Desc"),
      icon: Headphones,
    },
    {
      title: t("cards.card4Title"),
      description: t("cards.card4Desc"),
      icon: BadgeCheck,
    },
  ];


  return (
    <>
      {/* HERO */}
      <Hero
        title={
          <div className="flex flex-row md:flex-col items-center md:items-start gap-1.5 md:gap-0 mb-0 md:mb-4">
            <span className="text-yellow-400 block">{t("title1")}</span>
            <span className="text-white block">{t("title2")}</span>
          </div>
        }
        subtitle={t("subtitle")}
        layout="split"
        align="left"
      >
        <HeroCards items={heroCards} />
      </Hero>

      {/* POLICIES */}
      <Policies policies={policies} />

      {/* CTA */}
      <CTA />
    </>
  );
}