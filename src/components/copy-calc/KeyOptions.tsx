"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { keyServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Key } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

type KeyOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

export function KeyOptions({ onAddToBasket }: KeyOptionsProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<string>(keyServices[0].sifra.toString());
    const [quantity, setQuantity] = useState(1);

    const { unitPrice, description, serviceName } = useMemo(() => {
        const service = keyServices.find(s => s.sifra.toString() === selectedServiceId);

        if (!service) return { unitPrice: 0, description: '', serviceName: '' };
        
        return { 
            unitPrice: service.cena, 
            description: service.naziv,
            serviceName: "Izrada ključeva i tagova"
        };
    }, [selectedServiceId]);
    
    const totalPrice = unitPrice * quantity;

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `kljuc-${selectedServiceId}`,
            naziv: description,
            opis: `Količina: ${quantity}`,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
        });
    };

    return (
        <div className="space-y-6">
             <h3 className="text-lg font-semibold flex items-center gap-2">
                <Key className="w-5 h-5" />
                Opcije za ključeve i tagove
            </h3>
            <Card className="border-none shadow-none">
                <CardContent className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="key-type">Vrsta usluge</Label>
                        <Select onValueChange={setSelectedServiceId} defaultValue={selectedServiceId}>
                            <SelectTrigger id="key-type">
                                <SelectValue placeholder="Izaberite ključ ili tag" />
                            </SelectTrigger>
                            <SelectContent>
                                {keyServices.map(s => (
                                    <SelectItem key={s.sifra} value={s.sifra.toString()}>
                                        {s.naziv}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="key-quantity">Količina</Label>
                            <Input
                                id="key-quantity"
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
