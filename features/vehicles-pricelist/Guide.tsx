"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CircleHelp,
  X,
  Car,
  Filter,
  ClipboardList,
  Compass,
  Users,
} from "lucide-react";

interface GuideProps {
  type?: "pricelist" | "tours";
}

export default function Guide({ type = "pricelist" }: GuideProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Guide");

  const isPricelist = type === "pricelist";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        justify-center
        w-14
        h-14
        rounded-full

        bg-blue-500/50
        backdrop-blur-xl
        border border-white/20

        text-white
        shadow-xl

        hover:bg-blue-500/30
        hover:scale-105

        transition-all
        duration-300
        animate-pulse
      "
      >
        <CircleHelp size={26} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {isPricelist ? t("pricelist.title") : t("tours.title")}
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label={t("close")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-5 p-6">
              {isPricelist ? (
                // --- PRICELIST CONTENT ---
                <>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Car size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {t("pricelist.step1Title")}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("pricelist.step1Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <Filter size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {t("pricelist.step2Title")}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("pricelist.step2Desc")}
                      </p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                        <li>{t("pricelist.step2Filter1")}</li>
                        <li>{t("pricelist.step2Filter2")}</li>
                        <li>{t("pricelist.step2Filter3")}</li>
                        <li>{t("pricelist.step2Filter4")}</li>
                        <li>{t("pricelist.step2Filter5")}</li>
                        <li>{t("pricelist.step2Filter6")}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <ClipboardList size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {t("pricelist.step3Title")}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("pricelist.step3Desc")}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // --- TOURS CONTENT ---
                <>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <Compass size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {t("tours.step1Title")}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("tours.step1Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                      <Users size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {t("tours.step2Title")}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("tours.step2Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <ClipboardList size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {t("tours.step3Title")}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("tours.step3Desc")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-blue-600
                  text-white
                  hover:bg-blue-700
                "
              >
                {t("gotIt")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}