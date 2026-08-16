import Image from "next/image";
import { Link } from "@/i18n/routing";
import { TourPackage } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { getPublicUrl } from "@/lib/supabase/storage";

type Props = {
  tour: TourPackage;
};

export default function DetailHeroSection({ tour }: Props) {
  const locale = useLocale();
  const t = useTranslations("TourDetail");
  const tNav = useTranslations("Navbar");

  const displayTitle = locale === "en" ? (tour.titleEn || tour.title) : tour.title;

  return (
    <section className="relative overflow-hidden px-4 md:px-8 xl:px-0 py-10 md:py-20 bg-(--primary)/95">
      {/* Background Depth */}
      <div className="absolute inset-0 z-0">
        {/* Soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />

        {/* Top glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px]" />

        {/* Bottom-right shadow */}
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-black/10 blur-[100px]" />
      </div>

      {/* Spotlight */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 1800px 1400px at 50% -300px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.35) 15%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
        />
      </div>


      <div className="relative z-10 max-w-7xl mx-auto">
        {/* BACK LINK */}
        <Link
          href="/tourpackages"
          className="text-sm text-white mb-6 inline-block transition-all duration-300 hover:text-blue-100 hover:translate-x-1 flex items-center gap-1"
        >
          ← {tNav("tours")}
        </Link>

        {/* HERO */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={getPublicUrl(tour.imageUrl) || "/images/placeholder.png"}
            alt={displayTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-2xl md:text-4xl font-medium">{displayTitle}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
