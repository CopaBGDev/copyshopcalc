"use client";

import { useState, useMemo } from "react";
import type { OrderItem, ScanPriceTier } from "@/lib/types";
import { scanServices } from "@/lib/data";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Scan } from "lucide-react";
import { Switch } from "../ui/switch";

type ScanOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

export function ScanOptions({ onAddToBasket }: ScanOptionsProps) {
  const [format, setFormat] = useState<'A4' | 'A3'>('A4');
  const [isAutomatic, setIsAutomatic] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  
  const { unitPrice, totalPrice } = useMemo(() => {
    const serviceType = isAutomatic ? scanServices.auto : scanServices.manual;
    const tier = serviceType.find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max);

    if (!tier || quantity <= 0) {
      return { unitPrice: 0, totalPrice: 0 };
    }

    const price = format === 'A4' ? tier.priceA4 : tier.priceA3;
    return { unitPrice: price, totalPrice: price * quantity };

  }, [format, isAutomatic, quantity]);

  const handleAddToBasket = () => {
    if (totalPrice <= 0) return;
    
    const opis = `Skeniranje ${format}, ${isAutomatic ? 'automatski' : 'ručno'}`;
    
    onAddToBasket({
      serviceId: `skeniranje-${format}-${isAutomatic ? 'auto' : 'manual'}`,
      naziv: `Skeniranje dokumenata`,
      opis: opis,
      kolicina: quantity,
      cena_jedinice: unitPrice,
      cena_ukupno: totalPrice,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2"><Scan className="w-5 h-5"/>Opcije skeniranja</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Format</Label>
                <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'A4' | 'A3')} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A4" id="scan-a4" />
                        <Label htmlFor="scan-a4">A4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A3" id="scan-a3" />
                        <Label htmlFor="scan-a3">A3</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
         <div className="space-y-4">
             <div className="space-y-2">
                <Label>Način skeniranja</Label>
                <div className="flex items-center space-x-2">
                    <Switch id="automatic-scan" checked={isAutomatic} onCheckedChange={setIsAutomatic} />
                    <Label htmlFor="automatic-scan">Automatski (iz uvlakača)</Label>
                </div>
                 <p className="text-xs text-muted-foreground">Koristiti za veće količine nevezanih dokumenata.</p>
            </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label htmlFor="scan-quantity">Količina (broj strana)</Label>
          <Input 
            id="scan-quantity" 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
           <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
           <p className="text-3xl font-bold font-mono tracking-tight text-primary">
             {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
           </p>
            {quantity > 0 && (
                 <p className="text-xs text-muted-foreground font-mono">
                    ({unitPrice.toFixed(2)} RSD / kom)
                </p>
            )}
        </div>
      </div>

       <Separator />

      <div className="flex justify-end">
        <Button size="lg" onClick={handleAddToBasket} disabled={totalPrice <= 0}>
          <PlusCircle className="mr-2"/>
          Dodaj u korpu
        </Button>
      </div>

    </div>
  );
}
