"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Printer, ScanLine, Scissors, Palette } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Category = {
  name: string;
  icon: ReactNode;
  description: string;
};

const categories: Category[] = [
  {
    name: "Printanje",
    icon: <Printer className="w-8 h-8" />,
    description: "Štampa dokumenata i materijala.",
  },
  {
    name: "Skeniranje",
    icon: <ScanLine className="w-8 h-8" />,
    description: "Digitalizacija fizičkih dokumenata.",
  },
  {
    name: "Dorada",
    icon: <Scissors className="w-8 h-8" />,
    description: "Koričenje, sečenje, plastifikacija.",
  },
  {
    name: "Dizajn",
    icon: <Palette className="w-8 h-8" />,
    description: "Usluge grafičkog dizajna.",
  },
];

type CategorySelectorProps = {
  onSelectCategory: (category: string) => void;
  selectedCategory: string | null;
};

export function CategorySelector({ onSelectCategory, selectedCategory }: CategorySelectorProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Započnite novu porudžbinu</h2>
      <p className="text-muted-foreground mb-6">Izaberite kategoriju usluge za unos stavki.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? 'default' : 'outline'}
            className={cn(
              "h-auto w-full p-6 text-left justify-start transition-all hover:border-primary hover:shadow-lg",
               selectedCategory === category.name && "border-primary ring-2 ring-primary"
            )}
            onClick={() => onSelectCategory(category.name)}
          >
            <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-lg", selectedCategory === category.name ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary')}>
                    {category.icon}
                </div>
                <div>
                    <p className="font-semibold text-lg">{category.name}</p>
                    <p className={cn("text-sm", selectedCategory === category.name ? "text-primary-foreground/80" : "text-muted-foreground")}>{category.description}</p>
                </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
