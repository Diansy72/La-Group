"use client";

import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string; // bg-blue-500, bg-emerald-500, dll
  bgLight: string; // bg-blue-50, bg-emerald-50, dll
}

/**
 * FeatureCard - Reusable molecule untuk feature/policy cards
 * Digunakan di WhyChooseUS dan Policies
 * 
 * Contoh:
 * <FeatureCard
 *   icon={<Car size={22} />}
 *   title="Wide Vehicle Selection"
 *   description="Choose from a variety of cars and motorcycles..."
 *   color="bg-blue-500"
 *   bgLight="bg-blue-50"
 * />
 */
export default function FeatureCard({
  icon,
  title,
  description,
  color,
  bgLight,
}: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:border-gray-200 transition-all duration-300 group cursor-pointer">
      <div
        className={`shrink-0 p-2.5 rounded-xl ${bgLight} group-hover:scale-110 transition-transform duration-300`}
      >
        <div className={`${color} text-white p-2 rounded-lg`}>{icon}</div>
      </div>

      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
