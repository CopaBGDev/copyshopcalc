"use client";

import type { AppCategory, OrderItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { PrintOptions } from "./PrintOptions";

type ServiceOptionsProps = {
  category: AppCategory;
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};


export function ServiceOptions({ category, onAddToBasket }: ServiceOptionsProps) {

  const renderContent = () => {
    switch(category.id) {
      case 'stampa':
        return <PrintOptions onAddToBasket={onAddToBasket} />;
      // Add cases for other categories here
      default:
        return (
            <div className="text-center text-muted-foreground py-8">
                <p>Opcije za kategoriju "{category.naziv}" još uvek nisu implementirane.</p>
            </div>
        )
    }
  }

  return (
    <div className="animate-in fade-in duration-300 px-2">
      <Card>
        <CardContent className="p-6">
           {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
