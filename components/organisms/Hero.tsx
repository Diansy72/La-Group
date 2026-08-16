"use client";

import React from "react";
import { patternParang } from "@/lib/pattern";
import { cn } from "@/lib/cn";

type HeroProps = {
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  layout?: "center" | "split";
  align?: "center" | "left";
  className?: string;
};

export default function Hero({
  title,
  subtitle,
  children,
  layout = "center",
  align = "center",
  className,
}: HeroProps) {
  const isSplit = layout === "split";
  const isLeft = align === "left";

  const alignment = isLeft
    ? "text-center md:text-left items-center md:items-start"
    : "text-center items-center";

  const containerWidth = isSplit ? "max-w-6xl" : "max-w-4xl";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-33 md:py-46 text-white",
        className
      )}
    >
      {/* ===== BACKGROUND GRADIENT ===== */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1b357e] via-[#1e2d50] to-[#1c2e5e]" />

      {/* ===== PATTERN ===== */}
      <div
        className="absolute inset-0 z-0 opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage: patternParang,
          backgroundRepeat: "repeat",
          WebkitMaskImage: RADIAL_MASK,
          maskImage: RADIAL_MASK,
        }}
      />

      {/* ===== DEPTH ===== */}
      <HeroDepth />

      {/* ===== CONTENT ===== */}
      <div
        className={cn(
          "relative z-10 mx-auto px-6 md:px-12",
          containerWidth
        )}
      >
        {isSplit ? (
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <HeroText
              title={title}
              subtitle={subtitle}
              alignment={alignment}
            />
            <div className="flex justify-center md:justify-end">
              {children}
            </div>
          </div>
        ) : (
          <HeroText
            title={title}
            subtitle={subtitle}
            alignment={alignment}
          >
            {children}
          </HeroText>
        )}
      </div>
    </section>
  );
}

/* ====================== */

function HeroText({
  title,
  subtitle,
  alignment,
  children,
}: {
  title: React.ReactNode;
  subtitle?: string;
  alignment: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", alignment)}>
      <h1 className="text-3xl md:text-[42px] font-semibold text-yellow-400">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-4 text-gray-200 max-w-md mx-auto md:mx-0 text-base md:text-lg">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}

/* ====================== */

function HeroDepth() {
  return (
    <>
      {/* TOP VIGNETTE (UNCHANGED LIGHT DEPTH) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_52%,rgba(0,0,0,0.22)_100%)]" />

      {/* BOTTOM VIGNETTE (LIGHTENED FOCUS AREA) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,transparent_70%,rgba(0,0,0,0.10)_100%)]" />

      {/* INNER SHADOW (SOFTENED) */}
      <div className="absolute inset-0 z-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.18)]" />
    </>
  );
}

/* ====================== */

const RADIAL_MASK =
  "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 85%, transparent 100%)";