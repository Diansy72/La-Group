"use client";

import Hero from "@/components/organisms/Hero";
import ContactInfo from "@/features/contact/ContactInfo";
import ContactForm from "@/features/contact/ContactForm";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  return (
    <>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        layout="center"
      />

      <div className="max-w-7xl mx-auto bg-gray-50 px-4 md:px-8 xl:px-0 py-10 md:py-20 grid md:grid-cols-2 gap-8 md:gap-10">
        <ContactInfo />
        <ContactForm />
      </div>
    </>
  );
}
