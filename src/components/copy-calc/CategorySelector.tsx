"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Printer, ScanLine, Scissors, Palette, KeyRound, Shirt, ShoppingBag, Smartphone } from "lucide-react";
import type { ReactNode } from "react";

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
};

export function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Započnite novu porudžbinu</h2>
      <p className="text-muted-foreground mb-6">Izaberite kategoriju usluge za unos stavki.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            className="h-auto w-full p-6 text-left justify-start transition-all hover:border-primary hover:shadow-lg"
            onClick={() => onSelectCategory(category.name)}
          >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {category.icon}
                </div>
                <div>
                    <p className="font-semibold text-lg">{category.name}</p>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
