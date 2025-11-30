"use client";

import { useState, useMemo } from 'react';
import type { OrderItem, DesignService } from '@/lib/types';
import { designServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Palette } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type DesignOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

export function DesignOptions({ onAddToBasket }: DesignOptionsProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<string>(designServices[0].id);
    const [quantity, setQuantity] = useState(1);
    const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);

    const selectedService = useMemo(() => {
        return designServices.find(s => s.id === selectedServiceId);
    }, [selectedServiceId]);

    const { unitPrice, totalPrice, description, unitLabel } = useMemo(() => {
        if (!selectedService) return { unitPrice: 0, totalPrice: 0, description: '', unitLabel: '' };

        const uPrice = (selectedService.id === 'izrada-logoa' && customPrice) ? customPrice : selectedService.price;
        const total = uPrice * quantity;
        const desc = `${selectedService.name}`;
        
        return { 
            unitPrice: uPrice, 
            totalPrice: total,
            description: desc,
            unitLabel: selectedService.unit
        };
    }, [selectedService, quantity, customPrice]);
    
    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `dizajn-${selectedServiceId}-${quantity}`,
            naziv: description,
            opis: `Količina: ${quantity} ${unitLabel}${customPrice ? `, cena: ${customPrice.toFixed(2)} RSD` : ''}`,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
        });
    };

    const handleServiceChange = (id: string) => {
        setSelectedServiceId(id);
        setQuantity(1);
        setCustomPrice(undefined);
    }

    return (
        <div className="space-y-6">
             <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Opcije za usluge dizajna
            </h3>
            <Card className="border-none shadow-none">
                <CardContent className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="design-type">Vrsta usluge</Label>
                        <Select onValueChange={handleServiceChange} defaultValue={selectedServiceId}>
                            <SelectTrigger id="design-type">
                                <SelectValue placeholder="Izaberite uslugu" />
                            </SelectTrigger>
                            <SelectContent>
                                {designServices.map(s => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="design-quantity">Količina ({unitLabel})</Label>
                            <Input
                                id="design-quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                className="max-w-xs"
                            />
                        </div>
                        {selectedService?.id === 'izrada-logoa' && (
                             <div className="space-y-2">
                                <Label htmlFor="custom-price">Cena po komadu (RSD)</Label>
                                <Input
                                    id="custom-price"
                                    type="number"
                                    value={customPrice ?? selectedService.price}
                                    onChange={(e) => setCustomPrice(parseFloat(e.target.value) || undefined)}
                                    placeholder="Unesite cenu"
                                    className="max-w-xs"
                                />
                            </div>
                        )}
                        <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg col-span-full md:col-span-1 md:col-start-2">
                            <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                            <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                                {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                            </p>
                            <p className="text-xs text-muted-foreground h-4">
                                {quantity > 0 && `(${unitPrice.toFixed(2)} RSD / ${unitLabel})`}
                            </p>
                        </div>
                    </div>
                    
                    {selectedService?.notes && (
                         <Alert>
                            <AlertTitle>Napomena</AlertTitle>
                            <AlertDescription>
                                {selectedService.notes}
                            </AlertDescription>
                        </Alert>
                    )}

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
