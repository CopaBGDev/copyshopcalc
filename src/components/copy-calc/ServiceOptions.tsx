"use client";

import type { AppCategory, OrderItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { PrintOptions } from "./PrintOptions";
import { FinishingOptions } from "./FinishingOptions";
import { ScanOptions } from "./ScanOptions";
import { TextileOptions } from "./TextileOptions";
import { KeyOptions } from "./KeyOptions";
import { BusinessCardOptions } from "./BusinessCardOptions";
import { LargeFormatOptions } from "./LargeFormatOptions";
import { CanvasOptions } from "./CanvasOptions";

type ServiceOptionsProps = {
  category: AppCategory;
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};


export function ServiceOptions({ category, onAddToBasket }: ServiceOptionsProps) {

  const renderContent = () => {
    switch(category.id) {
      case 'stampa':
        return <PrintOptions onAddToBasket={onAddToBasket} />;
      case 'dorada':
        return <FinishingOptions onAddToBasket={onAddToBasket} />;
      case 'skeniranje':
        return <ScanOptions onAddToBasket={onAddToBasket} />;
      case 'tekstil':
        return <TextileOptions onAddToBasket={onAddToBasket} />;
      case 'kljucevi':
        return <KeyOptions onAddToBasket={onAddToBasket} />;
      case 'vizitke_flajeri':
        return <BusinessCardOptions onAddToBasket={onAddToBasket} />;
      case 'veliki_formati':
        return <LargeFormatOptions onAddToBasket={onAddToBasket} />;
      case 'kanvas':
        return <CanvasOptions onAddToBasket={onAddToBasket} />;
      // Add cases for other categories here
      case 'promo':
      case 'dizajn':
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
