"use client";

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { AppCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategorySelectorProps = {
  category: AppCategory;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export function CategorySelector({ category, isOpen, children }: CategorySelectorProps) {
  const Icon = category.icon;
  return (
     <AccordionItem value={category.id} className="border-b">
      <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg bg-primary/10 text-primary")}>
                  <Icon className="w-8 h-8" />
              </div>
              <div>
                  <p className="font-semibold text-lg text-left">{category.naziv}</p>
                  <p className={cn("text-sm text-left text-muted-foreground")}>{category.opis}</p>
              </div>
          </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
