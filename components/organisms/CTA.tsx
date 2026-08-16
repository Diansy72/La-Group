"use client";

import { Link } from "@/i18n/routing";
import Button from "../atoms/button";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("CTA");

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1424] via-[#1B2A4A] to-[#253961] text-center text-white px-6 md:px-8 py-16 md:py-24 shadow-inner">
      {/* Ambient Glows */}
      <div className="absolute -top-40 -left-40 h-[350px] w-[350px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[350px] w-[350px] rounded-full bg-indigo-500/25 blur-[100px] pointer-events-none" />
      
      {/* Center Spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)"
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* TEXT */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent">
          {t("title")}
        </h2>

        <p className="text-gray-200/90 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("description")}
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <a 
            href="https://wa.me/6281211190448" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button 
              type="button" 
              variant="gold" 
              className="w-full rounded-xl py-3 px-6 text-blue-900 text-base md:text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
            >
              {t("whatsapp")}
            </Button>
          </a>
          
          <Link href="/contact" className="w-full sm:w-auto">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full rounded-xl py-3 px-8 border-2 border-white/80 text-white hover:bg-white/10 hover:border-white text-base md:text-lg font-bold transition-all duration-300 hover:scale-105"
            >
              {t("message")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}