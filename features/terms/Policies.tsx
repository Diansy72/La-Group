"use client";

import {
  FileText,
  ReceiptText,
  DollarSign,
  Users,
  ShieldCheck,
} from "lucide-react";
import PolicyCard from "@/components/molecules/PolicyCard";

type Policy = {
  title: string;
  subtitle: string;
  content: string;
};

type Props = {
  policies: Policy[];
};

const icons = [
  FileText,
  ReceiptText,
  DollarSign,
  Users,
  ShieldCheck,
];

const featureColors = [
  { color: "bg-blue-500", bgLight: "bg-blue-50" },
  { color: "bg-emerald-500", bgLight: "bg-emerald-50" },
  { color: "bg-amber-500", bgLight: "bg-amber-50" },
  { color: "bg-purple-500", bgLight: "bg-purple-50" },
  { color: "bg-pink-500", bgLight: "bg-pink-50" },
];

export default function Policies({ policies }: Props) {
  return (
    <div className="max-w-6xl mx-auto p-10 md:p-20">
      {/* TITLE */}
      <p className="text-2xl md:text-4xl font-medium text-gray-900 mb-8 md:mb-12 relative m-0">
        All of Our Policies
        <span className="block w-20 h-1  bg-yellow-400 mt-3 rounded-full"></span>
      </p>

      {/* LIST */}
      <div className="space-y-4">
        {policies.map((item, i) => {
          const Icon = icons[i % icons.length];
          const colors = featureColors[i % featureColors.length];

          return (
            <PolicyCard
              key={i}
              icon={<Icon size={22} />}
              title={item.title}
              description={item.subtitle}
              content={item.content}
              color={colors.color}
              bgLight={colors.bgLight}
            />
          );
        })}
      </div>
    </div>
  );
}