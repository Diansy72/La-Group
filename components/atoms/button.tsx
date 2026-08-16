"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "gold" | "blue" | "gradient" | "outline" | "text" | "glass";

type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
};

export default function Button({
  children,
  variant = "gold",
  className,
  type = "button",
  onClick,
  disabled,
  icon,
  iconPosition = "left",
  isLoading = false,
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const textBase =
    "inline-flex items-center gap-2 text-sm md:text-base font-semibold transition-colors duration-200 bg-transparent p-0 m-0 shadow-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<Variant, string> = {
    gold: "bg-yellow-400 text-blue-950 hover:bg-yellow-500 focus-visible:ring-yellow-400",
    blue: "bg-blue-900 text-white hover:opacity-90  focus-visible:ring-blue-900 ",
    gradient:
      "bg-[linear-gradient(45deg,#001D4C,#00509D)] text-white hover:opacity-90 focus-visible:ring-blue-700 focus-visible:ring-blue-700",
    outline:
      "border border-gray-800 text-gray-800 bg-transparent hover:bg-gray-900 hover:text-white focus-visible:ring-gray-800",
    text:
      "text-black hover:text-blue-700 focus-visible:ring-blue-800",
    glass:
      "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        variant === "text" ? textBase : baseStyle,
        variants[variant],
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === "left" && (
          <span className="flex items-center justify-center">
            {icon}
          </span>
        )
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === "right" && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}
    </button>
  );
}