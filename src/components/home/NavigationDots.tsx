'use client';

import { NavigationDotsProps } from "@/types"

export default function NavigationDots({ sections, activeSection, onSelectSection }: NavigationDotsProps) {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => onSelectSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index ? "bg-primary scale-125" : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Scroll to ${section} section`}
          />
        ))}
      </div>
    </div>
  );
}