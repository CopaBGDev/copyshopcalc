"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { finishingServices, printServices, scanServices, textileServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Shirt } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';


const DigitalPrintCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const services = textileServices.directPrint.options;
    const [serviceId, setServiceId] = useState(services[0].sifra.toString());
    const [isBroughtIn, setIsBroughtIn] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { unitPrice, description, serviceName } = useMemo(() => {
        let service;
        if(isBroughtIn){
            const broughtInMap = {
                '317': textileServices.broughtIn.find(s => s.sifra === 325), // A4 White
                '318': textileServices.broughtIn.find(s => s.sifra === 327), // A3 White
                '319': textileServices.broughtIn.find(s => s.sifra === 326), // A4 Black
                '320': textileServices.broughtIn.find(s => s.sifra === 328), // A3 Black
            };
            service = broughtInMap[serviceId];
        } else {
            service = services.find(s => s.sifra.toString() === serviceId);
        }

        if (!service) return { unitPrice: 0, description: '', serviceName: '' };
        
        return { 
            unitPrice: service.cena, 
            description: `${service.naziv}${isBroughtIn ? ' (doneta majica)' : ''}`,
            serviceName: service.naziv.split(' direktna')[0]
        };
    }, [serviceId, isBroughtIn, services]);
    
    const totalPrice = unitPrice * quantity;

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `tekstil-digital-${serviceId}-${isBroughtIn}`,
            naziv: `Direktna štampa - ${serviceName}`,
            opis: `${description} (x${quantity})`,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
        });
    };

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="digital-print-type">Tip štampe</Label>
                     <Select onValueChange={setServiceId} defaultValue={serviceId}>
                        <SelectTrigger id="digital-print-type">
                            <SelectValue placeholder="Izaberite tip štampe" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map(s => (
                                <SelectItem key={s.sifra} value={s.sifra.toString()}>
                                    {s.naziv}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="brought-in-digital" checked={isBroughtIn} onCheckedChange={setIsBroughtIn} />
                    <Label htmlFor="brought-in-digital">Korisnik je doneo svoju majicu</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="digital-quantity">Količina</Label>
                        <Input
                            id="digital-quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            className="max-w-xs"
                        />
                         <p className="text-xs text-muted-foreground">Cene za 5+ komada su na upit.</p>
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
    );
}

const FlexPrintCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const services = textileServices.flexFoil.options;
    const [serviceId, setServiceId] = useState(services[0].sifra.toString());
    const [isBroughtIn, setIsBroughtIn] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { unitPrice, description, serviceName } = useMemo(() => {
        let service;
        const selectedFlexService = services.find(s => s.sifra.toString() === serviceId);

        if(isBroughtIn){
            // Logic for brought in items with flex foil
            if(serviceId === '323' || serviceId === '324') { // Gold/Silver
                service = textileServices.broughtIn.find(s => s.sifra === 331);
            } else { // Standard
                service = textileServices.broughtIn.find(s => s.sifra === 330);
            }
             if (service && selectedFlexService) {
                return {
                    unitPrice: service.cena,
                    description: `${selectedFlexService.naziv.replace('Bela i crna majica sa ', '')} (doneta majica)`,
                    serviceName: `Flex folija`
                }
            }
        } else {
            service = selectedFlexService;
        }

        if (!service) return { unitPrice: 0, description: '', serviceName: '' };
        
        return { 
            unitPrice: service.cena, 
            description: service.naziv,
            serviceName: `Flex folija`
        };
    }, [serviceId, isBroughtIn, services]);
    
    const totalPrice = unitPrice * quantity;

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `tekstil-flex-${serviceId}-${isBroughtIn}`,
            naziv: serviceName,
            opis: `${description} (x${quantity})`,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
        });
    };

    return (
         <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="flex-print-type">Tip flex folije</Label>
                     <Select onValueChange={setServiceId} defaultValue={serviceId}>
                        <SelectTrigger id="flex-print-type">
                            <SelectValue placeholder="Izaberite tip folije" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map(s => (
                                <SelectItem key={s.sifra} value={s.sifra.toString()}>
                                    {s.naziv.replace('Bela i crna majica sa ', '')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="brought-in-flex" checked={isBroughtIn} onCheckedChange={setIsBroughtIn} />
                    <Label htmlFor="brought-in-flex">Korisnik je doneo svoju majicu</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="flex-quantity">Količina</Label>
                        <Input
                            id="flex-quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            className="max-w-xs"
                        />
                         <p className="text-xs text-muted-foreground">Cene za 5+ komada su na upit.</p>
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
    )
}

export function TextileOptions({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void; }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shirt className="w-5 h-5" />
                Opcije štampe na tekstilu
            </h3>
            <Tabs defaultValue="digital" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="digital">
                        Direktna štampa (DTG)
                    </TabsTrigger>
                    <TabsTrigger value="flex">
                        Flex i Flok folije
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="digital">
                    <DigitalPrintCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="flex">
                    <FlexPrintCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
