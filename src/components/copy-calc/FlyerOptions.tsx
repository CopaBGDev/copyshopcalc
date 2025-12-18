
"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { flyerServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Newspaper } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';


type FlyerOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};


const DigitalFlyerCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
    const [quantity, setQuantity] = useState<string>('100');

    const { totalPrice, description, unitPrice, sifra } = useMemo(() => {
        const quantityNum = parseInt(quantity, 10);
        const priceList = flyerServices.digitalA6[side];
        const tier = priceList.find(p => p.kolicina === quantityNum);

        if (!tier) return { totalPrice: 0, description: '', unitPrice: 0, sifra: undefined };

        const price = tier.cena;
        const desc = `Flajeri A6, digitalna štampa, ${side === 'oneSided' ? 'jednostrano' : 'dvostrano'}, ${quantityNum} kom`;
        
        return { totalPrice: price, description: desc, unitPrice: price / quantityNum, sifra: tier.sifra };

    }, [side, quantity]);

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        const quantityNum = parseInt(quantity, 10);
        
        onAddToBasket({
            serviceId: `flajer-a6-digital-${side}-${quantity}`,
            naziv: 'Flajeri A6 - Digitalna štampa',
            opis: description,
            kolicina: quantityNum,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
            sifra: sifra,
        });
    };

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Štampa</Label>
                        <RadioGroup value={side} onValueChange={(v) => setSide(v as 'oneSided' | 'twoSided')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="oneSided" id="flyer-one-sided" />
                                <Label htmlFor="flyer-one-sided">Jednostrana</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="twoSided" id="flyer-two-sided" />
                                <Label htmlFor="flyer-two-sided">Dvostrana</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="flyer-quantity">Količina</Label>
                        <Select onValueChange={setQuantity} defaultValue={quantity}>
                            <SelectTrigger id="flyer-quantity">
                                <SelectValue placeholder="Izaberite količinu" />
                            </SelectTrigger>
                            <SelectContent>
                                {flyerServices.digitalA6.oneSided.map(tier => (
                                    <SelectItem key={tier.kolicina} value={tier.kolicina.toString()}>
                                        {tier.kolicina} komada
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col items-end bg-primary/5 p-4 rounded-lg">
                    <Label className="text-sm text-muted-foreground">Ukupna cena za {quantity} kom</Label>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                        {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                    </p>
                    <p className="text-xs text-muted-foreground h-4">
                        ({unitPrice.toFixed(2)} RSD / kom)
                    </p>
                </div>

                <Separator />

                <div className="flex justify-end">
                    <Button size="lg" onClick={handleAddToBasket} disabled={totalPrice <= 0}>
                        <PlusCircle className="mr-2" />
                        Dodaj u korpu
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


export function FlyerOptions({ onAddToBasket }: FlyerOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                Opcije za flajere
            </h3>
            <Tabs defaultValue="digital-a6" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="digital-a6">
                        A6 Digitalna štampa
                    </TabsTrigger>
                    <TabsTrigger value="offset" disabled>
                        Ofset štampa
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="digital-a6">
                    <DigitalFlyerCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="offset">
                   <p className="p-4 text-center text-muted-foreground">Uskoro dostupno...</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
