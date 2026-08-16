import { LucideIcon } from "lucide-react";

type HeroCardItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type HeroCardsProps = {
  items: HeroCardItem[];
};

export default function HeroCards({ items }: HeroCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="border border-white/40 rounded-xl p-4 
            md:text-left text-center bg-white/10 hover:bg-transparent transition duration-300"
          >
            {/* ICON */}
            <div className="flex justify-center md:justify-start mb-3">
              <div className="bg-white/10 p-3 rounded-xl">
                <Icon className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
              </div>
            </div>

            {/* TITLE */}
            <p className="font-semibold text-white text-base md:text-lg">
              {item.title}
            </p>

            {/* DESCRIPTION */}
            <p className="text-gray-300 mt-1 text-xs md:text-sm">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}