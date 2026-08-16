"use client";

import HeroSection from "@/features/landing/HeroSection";
import HowItWorks from "@/features/landing/HowItWorks";
import Destinations from "@/features/landing/Destinations";
import BestVehicles from "@/features/landing/BestVehicles";
import WhyChooseUs from "@/features/landing/WhyChooseUS";
import Membership from "@/features/landing/Membership";
import Testimonials from "@/features/landing/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <Destinations />
      <BestVehicles />
      <WhyChooseUs />
      <Membership/>
      <Testimonials />
    </>
  );
}
