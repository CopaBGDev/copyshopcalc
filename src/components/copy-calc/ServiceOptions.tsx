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
import { FlyerOptions } from "./FlyerOptions";
import { GiftOptions } from "./GiftOptions";

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
      case 'vizitke':
        return <BusinessCardOptions onAddToBasket={onAddToBasket} />;
      case 'veliki_formati':
        return <LargeFormatOptions onAddToBasket={onAddToBasket} />;
      case 'kanvas':
        return <CanvasOptions onAddToBasket={onAddToBasket} />;
      case 'flajeri':
         return <FlyerOptions onAddToBasket={onAddToBasket} />;
      case 'pokloni':
        return <GiftOptions onAddToBasket={onAddToBasket} />;
      case 'promo':
        return (
            <div className="text-center text-muted-foreground py-8">
                <p className="font-semibold">Promo materijal je dostupan na upit.</p>
                <p className="text-sm mt-2">Za cene i dostupnost olovaka, upaljača, privezaka, rokovnika i ostalog promo materijala, molimo kontaktirajte menadžera.</p>
            </div>
        )
      case 'dizajn':
          return (
            <div className="text-center text-muted-foreground py-8">
                <p className="font-semibold">Usluge grafičkog dizajna i pripreme.</p>
                <p className="text-sm mt-2">Za sve potrebe dizajna, preloma teksta i pripreme za štampu, obratite se našem dizajnerskom timu radi konsultacija i formiranja cene.</p>
            </div>
        )
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
