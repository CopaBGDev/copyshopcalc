
"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { giftServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Gift } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

type GiftOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

export function GiftOptions({ onAddToBasket }: GiftOptionsProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<string>(giftServices.items[0].id);
    const [quantity, setQuantity] = useState(1);

    const { unitPrice, description, serviceName, sifra } = useMemo(() => {
        const service = giftServices.items.find(s => s.id === selectedServiceId);

        if (!service) return { unitPrice: 0, description: '', serviceName: '', sifra: undefined };
        
        return { 
            unitPrice: service.price, 
            description: service.name,
            serviceName: "Foto poklon",
            sifra: service.sifra
        };
    }, [selectedServiceId]);
    
    const totalPrice = unitPrice * quantity;

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `poklon-${selectedServiceId}`,
            naziv: description,
            opis: `Količina: ${quantity}`,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
            sifra: sifra,
        });
    };

    return (
        <div className="space-y-6">
             <h3 className="text-lg font-semibold flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Opcije za foto poklone
            </h3>
            <Card className="border-none shadow-none">
                <CardContent className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="gift-type">Vrsta poklona</Label>
                        <Select onValueChange={setSelectedServiceId} defaultValue={selectedServiceId}>
                            <SelectTrigger id="gift-type">
                                <SelectValue placeholder="Izaberite poklon" />
                            </SelectTrigger>
                            <SelectContent>
                                {giftServices.items.map(s => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="gift-quantity">Količina</Label>
                            <Input
                                id="gift-quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                className="max-w-xs"
                            />
                        </div>
                        <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
                            <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                            <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                                {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                            </p>
                            <p className="text-xs text-muted-foreground h-4">
                            {quantity > 0 && `(${unitPrice.toFixed(2)} RSD / kom)`}
                            </p>
                        </div>
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
        </div>
    );
}
