"use client";

import { useState } from "react";
import type { AppCategory, OrderItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ServiceOptionsProps = {
  category: AppCategory;
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

// Placeholder component for the new structure
const PrintOptions = ({ onAddToBasket, category }: ServiceOptionsProps) => {
  // This will contain the complex logic for print services
  return (
    <div>
      <h3 className="font-semibold mb-2">Štampa i kopiranje</h3>
      <p className="text-sm text-muted-foreground">
        Uskoro će ovde biti opcije za štampu (A4/A3, C/B/Kolor, jednostrano/obostrano, količina...).
      </p>
       {/* Example button */}
       <Button className="mt-4" onClick={() => onAddToBasket({
         serviceId: 'test-print',
         naziv: 'Primer: Štampa A4 C/B',
         opis: '1-20 kom, jednostrano',
         kolicina: 10,
         cena_jedinice: 19.90,
         cena_ukupno: 199.00
       })}>Dodaj primer štampe</Button>
    </div>
  );
}

export function ServiceOptions({ category, onAddToBasket }: ServiceOptionsProps) {

  const renderContent = () => {
    switch(category.id) {
      case 'stampa':
        return <PrintOptions category={category} onAddToBasket={onAddToBasket} />;
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
