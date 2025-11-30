"use client";

import type { OrderItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingCart, Loader2 } from "lucide-react";

type OrderBasketProps = {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onFinalizeOrder: () => void;
  isFinalizing: boolean;
};

export function OrderBasket({ items, onUpdateQuantity, onFinalizeOrder, isFinalizing }: OrderBasketProps) {
  const total = items.reduce((acc, item) => acc + item.cena_ukupno, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="text-primary" />
          Korpa porudžbine
        </CardTitle>
        <CardDescription>Pregled i izmena stavki pre zaključenja.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[45vh] overflow-y-auto pr-3">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>Korpa je trenutno prazna.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex-grow">
                  <p className="font-medium leading-tight">{item.naziv}</p>
                  <p className="text-xs text-muted-foreground">{item.opis}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.kolicina} x {item.cena_jedinice.toFixed(2)} RSD
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                   <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.kolicina - 1)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-mono">{item.kolicina}</span>
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.kolicina + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                   </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive" onClick={() => onUpdateQuantity(item.id, 0)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col mt-4">
        <Separator />
        <div className="w-full flex justify-between items-center py-4">
          <span className="text-lg font-semibold">UKUPNO:</span>
          <span className="text-2xl font-bold font-mono tracking-tight text-primary">
            {total.toFixed(2)} <span className="text-lg font-semibold">RSD</span>
          </span>
        </div>
        <Button onClick={onFinalizeOrder} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={isFinalizing || items.length === 0}>
          {isFinalizing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isFinalizing ? 'Zaključujem...' : 'Zaključi porudžbinu'}
        </Button>
      </CardFooter>
    </Card>
  );
}
