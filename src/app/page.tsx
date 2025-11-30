"use client";

import { useState, useMemo, useTransition } from "react";
import type { OrderItem, AppCategory } from "@/lib/types";
import { appCategories } from "@/lib/data";
import { createOrder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Header } from "@/components/copy-calc/Header";
import { CategorySelector } from "@/components/copy-calc/CategorySelector";
import { ServiceOptions } from "@/components/copy-calc/ServiceOptions";
import { OrderBasket } from "@/components/copy-calc/OrderBasket";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";


export default function Home() {
  const [activeCategories, setActiveCategories] = useState<string[]>(['stampa']);
  const [basket, setBasket] = useState<OrderItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCategoryToggle = (categoryId: string) => {
    setActiveCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddToBasket = (item: Omit<OrderItem, 'id'>) => {
    const newItem: OrderItem = {
      ...item,
      id: `${item.serviceId}-${Date.now()}`,
    };

    setBasket(prev => [...prev, newItem]);
    
    toast({
      title: "Stavka dodata",
      description: `${item.naziv} (x${item.kolicina}) je dodat u korpu.`,
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setBasket((prevBasket) => {
      if (newQuantity <= 0) {
        return prevBasket.filter((item) => item.id !== itemId);
      }
      return prevBasket.map((item) => {
        if (item.id === itemId) {
          const newTotal = item.cena_jedinice * newQuantity;
          return { 
            ...item, 
            kolicina: newQuantity,
            cena_ukupno: newTotal,
            opis: item.opis.includes("x") ? item.opis.substring(0, item.opis.lastIndexOf(" (x")) + ` (x${newQuantity})` : `${item.opis} (x${newQuantity})`,
           };
        }
        return item;
      });
    });
  };

  const handleFinalizeOrder = () => {
    const total = basket.reduce((acc, item) => acc + item.cena_ukupno, 0);

    if (basket.length === 0) {
        toast({
            variant: "destructive",
            title: "Greška",
            description: "Korpa je prazna. Dodajte stavke pre zaključenja.",
        });
        return;
    }

    startTransition(async () => {
      const result = await createOrder(basket, total);
      if (result.success) {
        toast({
          title: "Uspeh!",
          description: result.message,
        });
        setBasket([]);
      } else {
        toast({
          variant: "destructive",
          title: "Greška",
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
             <Card className="shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight mb-1">Započnite novu porudžbinu</h2>
                    <p className="text-muted-foreground mb-6">Izaberite kategoriju usluge za unos stavki.</p>
                    <Accordion 
                      type="multiple" 
                      value={activeCategories}
                      onValueChange={setActiveCategories}
                      className="w-full"
                    >
                      {appCategories.map(cat => (
                        <CategorySelector
                          key={cat.id}
                          category={cat}
                          isOpen={activeCategories.includes(cat.id)}
                          onToggle={() => handleCategoryToggle(cat.id)}
                        >
                          <ServiceOptions
                              key={cat.id}
                              category={cat}
                              onAddToBasket={handleAddToBasket}
                          />
                        </CategorySelector>
                      ))}
                    </Accordion>
                </CardContent>
            </Card>
          </div>
          <aside className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <OrderBasket
                items={basket}
                onUpdateQuantity={handleUpdateQuantity}
                onFinalizeOrder={handleFinalizeOrder}
                isFinalizing={isPending}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
