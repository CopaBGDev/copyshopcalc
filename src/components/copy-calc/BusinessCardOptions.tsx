"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { businessCardServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type BusinessCardOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};


const DigitalCardCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
    const [quantity, setQuantity] = useState<string>('100');

    const { totalPrice, description } = useMemo(() => {
        const quantityNum = parseInt(quantity, 10);
        const priceList = businessCardServices.digital[side];
        const tier = priceList.find(p => p.kolicina === quantityNum);

        if (!tier) return { totalPrice: 0, description: '' };

        const desc = `Vizit karte, ${side === 'oneSided' ? 'jednostrane' : 'dvostrane'}, ${quantityNum} kom`;
        return { totalPrice: tier.cena, description: desc };

    }, [side, quantity]);

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        const quantityNum = parseInt(quantity, 10);
        
        onAddToBasket({
            serviceId: `vizitke-digital-${side}-${quantity}`,
            naziv: 'Vizit karte - Digitalna štampa',
            opis: description,
            kolicina: quantityNum,
            cena_jedinice: totalPrice / quantityNum,
            cena_ukupno: totalPrice,
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
                                <RadioGroupItem value="oneSided" id="bc-one-sided" />
                                <Label htmlFor="bc-one-sided">Jednostrana</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="twoSided" id="bc-two-sided" />
                                <Label htmlFor="bc-two-sided">Dvostrana</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bc-quantity">Količina</Label>
                        <Select onValueChange={setQuantity} defaultValue={quantity}>
                            <SelectTrigger id="bc-quantity">
                                <SelectValue placeholder="Izaberite količinu" />
                            </SelectTrigger>
                            <SelectContent>
                                {businessCardServices.digital.oneSided.map(tier => (
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
                        {description}
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


export function BusinessCardOptions({ onAddToBasket }: BusinessCardOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Opcije za vizit karte i flajere
            </h3>
            <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="standard">
                        Standardne vizitke
                    </TabsTrigger>
                    <TabsTrigger value="lux" disabled>
                        Lux vizitke
                    </TabsTrigger>
                    <TabsTrigger value="flyers" disabled>
                        Flajeri
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="standard">
                    <DigitalCardCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="lux">
                   <p className="p-4 text-center text-muted-foreground">Uskoro dostupno...</p>
                </TabsContent>
                 <TabsContent value="flyers">
                   <p className="p-4 text-center text-muted-foreground">Uskoro dostupno...</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
