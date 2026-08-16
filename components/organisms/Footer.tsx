"use client";

import { Link } from "@/i18n/routing";
import { Car, MapPin, Phone, Mail } from "lucide-react";
import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
} from "react-icons/fa";
import Separator from "@/components/atoms/separator";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const navT = useTranslations("Navbar");

  return (
    <footer className="w-full bg-(--primary)/95 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-2xl md:text-4xl text-yellow-400">
                L.A Group
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              {t("description")}
            </p>

            {/* Social */}
            {/* Social */}
            <div className="flex gap-3">
              {[
                {
                  icon: FaInstagram,
                  href: "https://www.instagram.com/lagroupofficial/",
                },
                {
                  icon: FaTiktok,
                  href: "https://www.tiktok.com/@kaisar_timur",
                },
               
              ].map((social, i) => {
                const Icon = social.icon;

                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
          w-10 h-10 rounded-xl
          flex items-center justify-center
          bg-white/10 border border-white/10
          hover:bg-yellow-400
          hover:border-yellow-400
          hover:scale-105
          transition-all duration-300
          group
        "
                  >
                    <Icon
                      className="
            w-5 h-5 text-gray-300
            group-hover:text-slate-900
            transition-colors duration-300
          "
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-yellow-400  text-lg">
              {t("quickLinks")}
            </h4>

            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { name: navT("home"), href: "/" },
                { name: navT("pricelist"), href: "/vehicles-pricelist" },
                { name: navT("tours"), href: "/tourpackages" },
                { name: navT("about"), href: "/about" },
                { name: navT("terms"), href: "/terms" },
                { name: navT("contact"), href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-yellow-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-yellow-400 text-lg">
              {t("contactUs")}
            </h4>

            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>{t("address")}</span>
              </li>

              <li className="flex gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span>+62 812 1119 0448</span>
              </li>

              <li className="flex gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>Lagarage.official@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4 text-yellow-400 text-lg">
              {t("paymentMethods")}
            </h4>
            <div className="flex flex-wrap gap-2 justify-start">
              {[
                { name: "QRIS", src: "https://raw.githubusercontent.com/hafidznoor/idn-finlogos/main/icons/qris.svg", h: "h-7" },
                { name: "BCA", src: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg", h: "h-5" },
                { name: "BRI", src: "https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg", h: "h-5" },
                { name: "BNI", src: "https://raw.githubusercontent.com/hafidznoor/idn-finlogos/main/icons/bni.svg", h: "h-5" },
                { name: "Mandiri", src: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg", h: "h-4" },
              ].map((logo) => (
                <div
                  key={logo.name}
                  className="bg-white px-2 py-1 rounded-md flex items-center justify-center h-10 w-16 shadow-sm border border-white/10 hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={`${logo.h} object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-semibold mb-4 text-yellow-400  text-lg">
              {t("openInMaps")}
            </h4>

            <div className="h-36 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-xs text-gray-400">Sleman, Yogyakarta</p>
                <a
                  href="https://maps.app.goo.gl/SnCBkSEnQzCnrQBfA"
                  target="_blank"
                  className="text-xs text-yellow-400 underline"
                >
                  {t("openInMaps")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <Separator />
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-row justify-center md:text-lg text-sm text-yellow-300/80">
          <p>© 2026 L.A Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
