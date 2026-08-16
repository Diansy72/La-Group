"use client";

import React from "react";
import { Car, Users, BadgeDollarSign, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
    fadeInLeft,
    fadeInRight,
    staggerContainer,
} from "@/lib/animations";
import SectionHeader from "@/components/molecules/SectionHeader";
import FeatureCard from "@/components/molecules/FeatureCard";
import { useTranslations } from "next-intl";

export default function WhyChooseUs() {
    const t = useTranslations("WhyChooseUs");

    const features = [
        {
            icon: <Car size={22} />,
            title: t("feature1Title"),
            description: t("feature1Desc"),
            color: "bg-blue-500",
            bgLight: "bg-blue-50",
        },
        {
            icon: <Users size={22} />,
            title: t("feature2Title"),
            description: t("feature2Desc"),
            color: "bg-emerald-500",
            bgLight: "bg-emerald-50",
        },
        {
            icon: <BadgeDollarSign size={22} />,
            title: t("feature3Title"),
            description: t("feature3Desc"),
            color: "bg-amber-500",
            bgLight: "bg-amber-50",
        },
        {
            icon: <Clock size={22} />,
            title: t("feature4Title"),
            description: t("feature4Desc"),
            color: "bg-purple-500",
            bgLight: "bg-purple-50",
        },
    ];

    return (
        <section
            id="why-us"
            className="px-4 md:px-8 xl:px-0 py-10 md:py-20 bg-gray-50 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center">
                    {/* LEFT IMAGE */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="relative hidden md:block"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/whychooseus.jpg"
                                alt="Why choose us"
                                className="w-full h-105 object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-blue-900/30 to-transparent rounded-2xl" />
                        </div>

                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-100/40 rounded-2xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-50 rounded-2xl -z-10" />
                    </motion.div>

                    {/* RIGHT CONTENT */}
                    <div>
                        {/* HEADER */}
                        <SectionHeader
                            subtitle={t("subtitle")}
                            title={t("title")}
                            description={t("description")}
                            highlightWord={t("highlightWord")}
                            className="mb-10 text-center md:text-left"
                        />

                        {/* FEATURES */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="space-y-5"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInRight}
                                    transition={{
                                        duration: 1,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <FeatureCard
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                        color={feature.color}
                                        bgLight={feature.bgLight}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}