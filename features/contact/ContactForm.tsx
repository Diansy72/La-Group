"use client";

import React, { useState } from "react";
import Button from "@/components/atoms/button";
import { Send, CheckCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("ContactPage");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center py-16">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{t("form.successTitle")}</h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          {t("form.successDesc")}
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-blue-900 font-bold hover:underline"
        >
          {t("form.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
        {t("form.title")}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm md:text-base font-medium text-gray-700 block">{t("form.nameLabel")}</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder={t("form.namePlaceholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base transition"
          />
        </div>

        <div>
          <label className="text-sm md:text-base font-medium text-gray-700 block">{t("form.emailLabel")}</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder={t("form.emailPlaceholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base transition"
          />
        </div>

        <div>
          <label className="text-sm md:text-base font-medium text-gray-700 block">
            {t("form.phoneLabel")}
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("form.phonePlaceholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base transition"
          />
        </div>

        <div>
          <label className="text-sm md:text-base font-medium text-gray-700 block">{t("form.subjectLabel")}</label>
          <select
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base transition"
          >
            <option value="">{t("form.subjectPlaceholder")}</option>
            <option value="Booking">{t("subjects.booking")}</option>
            <option value="Information">{t("subjects.information")}</option>
            <option value="Complaint">{t("subjects.complaint")}</option>
          </select>
        </div>

        <div>
          <label className="text-sm md:text-base font-medium text-gray-700 block">{t("form.messageLabel")}</label>
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder={t("form.messagePlaceholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base transition resize-none"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="blue"
          icon={isSubmitting ? <Clock className="animate-spin" size={16} /> : <Send size={16} />}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("form.sending") : t("form.submit")}
        </Button>

        <p className="text-xs md:text-sm text-gray-500 text-center pt-2">
          {t("form.privacy")}
        </p>
      </form>
    </div>
  );
}