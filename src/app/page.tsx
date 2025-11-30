"use client";

import { useState, useMemo, useTransition } from "react";
import type { OrderItem, Service } from "@/lib/types";
import { mockServices } from "@/lib/data";
import { createOrder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Header } from "@/components/copy-calc/Header";
import { CategorySelector } from "@/components/copy-calc/CategorySelector";
import { ServiceOptions } from "@/components/copy-calc/ServiceOptions";
import { OrderBasket } from "@/components/copy-calc/OrderBasket";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [basket, setBasket] = useState<OrderItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const servicesForCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return mockServices.filter((s) => s.kategorija === selectedCategory);
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
  };

  const handleAddToBasket = (service: Service, quantity: number) => {
    if (quantity <= 0) return;

    setBasket((prevBasket) => {
      const existingItemIndex = prevBasket.findIndex(
        (item) => item.serviceId === service.id
      );

      if (existingItemIndex > -1) {
        const updatedBasket = [...prevBasket];
        updatedBasket[existingItemIndex].kolicina += quantity;
        return updatedBasket;
      } else {
        const newItem: OrderItem = {
          id: `${service.id}-${Date.now()}`,
          serviceId: service.id,
          naziv: service.naziv,
          kolicina: quantity,
          cena_jedinice: service.cena_jedinice,
        };
        return [...prevBasket, newItem];
      }
    });
    
    toast({
        title: "Stavka dodata",
        description: `${service.naziv} (x${quantity}) je dodat u korpu.`,
    })
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setBasket((prevBasket) => {
      if (newQuantity <= 0) {
        return prevBasket.filter((item) => item.id !== itemId);
      }
      return prevBasket.map((item) =>
        item.id === itemId ? { ...item, kolicina: newQuantity } : item
      );
    });
  };

  const handleFinalizeOrder = () => {
    const total = basket.reduce((acc, item) => acc + item.cena_jedinice * item.kolicina, 0);

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
        setSelectedCategory(null);
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
             <Card className="shadow-lg animate-in fade-in duration-500">
                <CardContent className="p-6">
                    <CategorySelector onSelectCategory={handleCategorySelect} selectedCategory={selectedCategory} />
                    {selectedCategory && (
                      <>
                        <Separator className="my-6" />
                        <ServiceOptions
                            key={selectedCategory} // Reset component state on category change
                            category={selectedCategory}
                            services={servicesForCategory}
                            onAddToBasket={handleAddToBasket}
                        />
                      </>
                    )}
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
