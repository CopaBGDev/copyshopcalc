"use client";
import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { finishingServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, BookCopy, ShieldCheck, Layers, Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FinishingOptionsProps = {
    onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

const BindingCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [bindingType, setBindingType] = useState<'plastic' | 'wire'>('plastic');
    const [sheetCount, setSheetCount] = useState<number>(1);
    const [withCovers, setWithCovers] = useState<boolean>(true);

    const { unitPrice, description } = useMemo(() => {
        const service = bindingType === 'plastic' ? finishingServices.binding.plasticSpiral : finishingServices.binding.wireSpiral;
        const tier = service.tiers.find(t => sheetCount > (t.sheets.min || 0) && sheetCount <= t.sheets.max);

        if (!tier) {
            return { unitPrice: 0, description: "Unesite validan broj listova" };
        }

        const price = withCovers ? tier.priceWithCovers : tier.priceSpiralOnly;
        const desc = `${service.name}, ${sheetCount} listova, ${withCovers ? 'sa koricama' : 'samo spirala'}`;
        
        return { unitPrice: price, description: desc };
    }, [bindingType, sheetCount, withCovers]);

    const handleAddToBasket = () => {
        if (unitPrice <= 0) return;
        
        onAddToBasket({
            serviceId: `koricenje-${bindingType}-${sheetCount}`,
            naziv: bindingType === 'plastic' ? "Koričenje plastičnom spiralom" : "Koričenje žičanom spiralom",
            opis: description,
            kolicina: 1, // Binding is usually per piece
            cena_jedinice: unitPrice,
            cena_ukupno: unitPrice,
        });
    };
    
    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Vrsta spirale</Label>
                        <RadioGroup value={bindingType} onValueChange={(v) => setBindingType(v as 'plastic' | 'wire')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="plastic" id="binding-plastic" />
                                <Label htmlFor="binding-plastic">Plastična</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="wire" id="binding-wire" />
                                <Label htmlFor="binding-wire">Žičana</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div className="space-y-2">
                        <Label>Korice</Label>
                        <RadioGroup value={withCovers ? 'da' : 'ne'} onValueChange={(v) => setWithCovers(v === 'da')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="da" id="covers-yes" />
                                <Label htmlFor="covers-yes">Sa koricama (karton+folija)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ne" id="covers-no" />
                                <Label htmlFor="covers-no">Samo spirala</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="sheet-count">Broj listova (do 450)</Label>
                        <Input
                            id="sheet-count"
                            type="number"
                            value={sheetCount}
                            onChange={(e) => setSheetCount(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max="450"
                            className="max-w-xs"
                        />
                    </div>
                    <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
                        <Label className="text-sm text-muted-foreground">Cena po komadu</Label>
                        <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                            {unitPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                        </p>
                         <p className="text-xs text-muted-foreground h-4">
                            {description}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                    <Button size="lg" onClick={handleAddToBasket} disabled={unitPrice <= 0}>
                        <PlusCircle className="mr-2" />
                        Dodaj u korpu
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


const HardcoverBinding = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const services = finishingServices.hardcover.services;
    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0].sifra?.toString() ?? '21');
    const [quantity, setQuantity] = useState<number>(1);

    const selectedService = useMemo(() => {
        if (selectedServiceId === '21' || selectedServiceId === '23') {
            return quantity < 5 ? services.find(s => s.sifra === 21) : services.find(s => s.sifra === 23);
        }
        return services.find(s => s.sifra?.toString() === selectedServiceId);
    }, [selectedServiceId, quantity, services]);
    
    const unitPrice = useMemo(() => selectedService?.price ?? 0, [selectedService]);
    const totalPrice = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

    const handleAddToBasket = () => {
        if (!selectedService || totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `tvrdi-povez-${selectedService.sifra}`,
            naziv: 'Tvrdi povez',
            opis: `${selectedService.name} (x${quantity})`,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
        });
    }

    const uniqueServices = useMemo(() => {
        const seen = new Set();
        return services.filter(s => {
            if (s.sifra === 23) return false; // Hide the 5+ option, handled by quantity
            const duplicate = seen.has(s.name);
            seen.add(s.name);
            return !duplicate;
        });
    }, [services]);

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="hardcover-type">Vrsta tvrdog poveza</Label>
                    <Select onValueChange={setSelectedServiceId} defaultValue={selectedServiceId}>
                        <SelectTrigger id="hardcover-type">
                            <SelectValue placeholder="Izaberite vrstu poveza" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueServices.map(s => (
                                <SelectItem key={s.sifra} value={s.sifra.toString()}>
                                    {s.name.replace(' (1-4 kom)', '')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="hardcover-quantity">Količina</Label>
                        <Input
                            id="hardcover-quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            className="max-w-xs"
                        />
                         { (selectedServiceId === '21' || selectedServiceId === '23') &&
                            <p className="text-xs text-muted-foreground">Cena se menja za 5+ komada.</p>
                         }
                    </div>
                     <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
                        <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                        <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                            {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                        </p>
                        <p className="text-xs text-muted-foreground h-4">
                            ({unitPrice.toFixed(2)} RSD / kom)
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
};


const LaminationCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const { pocket: pocketServices, roll: rollServices } = finishingServices.lamination;
    const [laminationType, setLaminationType] = useState<'pocket' | 'roll'>('pocket');
    const [selectedPocketServiceId, setSelectedPocketServiceId] = useState<string>(pocketServices[0].id);
    const [selectedRollFormat, setSelectedRollFormat] = useState<'A4' | 'A3'>('A4');
    const [quantity, setQuantity] = useState<number>(1);

    const { unitPrice, totalPrice, description } = useMemo(() => {
        let price = 0;
        let desc = '';

        if (laminationType === 'pocket') {
            const service = pocketServices.find(s => s.id === selectedPocketServiceId);
            if (service) {
                price = service.price;
                desc = service.name;
            }
        } else { // roll
            const service = rollServices[0];
            if (service) {
                price = selectedRollFormat === 'A4' ? service.priceA4 : service.priceA3;
                desc = `${service.name} - ${selectedRollFormat}`;
            }
        }
        
        return { 
            unitPrice: price, 
            totalPrice: price * quantity,
            description: desc
        };

    }, [laminationType, selectedPocketServiceId, selectedRollFormat, quantity, pocketServices, rollServices]);

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        onAddToBasket({
            serviceId: `plastifikacija-${laminationType}-${laminationType === 'pocket' ? selectedPocketServiceId : selectedRollFormat}`,
            naziv: 'Plastifikacija',
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
                    <Label>Vrsta plastifikacije</Label>
                    <RadioGroup value={laminationType} onValueChange={(v) => setLaminationType(v as 'pocket' | 'roll')} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pocket" id="lam-pocket" />
                            <Label htmlFor="lam-pocket">Džepna (folija)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="roll" id="lam-roll" />
                            <Label htmlFor="lam-roll">Iz rolne</Label>
                        </div>
                    </RadioGroup>
                </div>

                {laminationType === 'pocket' ? (
                     <div className="space-y-2">
                        <Label htmlFor="pocket-type">Veličina folije</Label>
                        <Select onValueChange={setSelectedPocketServiceId} defaultValue={selectedPocketServiceId}>
                            <SelectTrigger id="pocket-type">
                                <SelectValue placeholder="Izaberite veličinu" />
                            </SelectTrigger>
                            <SelectContent>
                                {pocketServices.map(s => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>Format</Label>
                         <RadioGroup value={selectedRollFormat} onValueChange={(v) => setSelectedRollFormat(v as 'A4' | 'A3')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A4" id="roll-a4" />
                                <Label htmlFor="roll-a4">A4</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A3" id="roll-a3" />
                                <Label htmlFor="roll-a3">A3</Label>
                            </div>
                        </RadioGroup>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="lamination-quantity">Količina</Label>
                        <Input
                            id="lamination-quantity"
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
    );
};


const OtherFinishingCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const services = finishingServices.other;
    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0].id);
    const [quantity, setQuantity] = useState<number>(1);

    const { unitPrice, description, serviceName } = useMemo(() => {
        const service = services.find(s => s.id === selectedServiceId);
        if (!service) return { unitPrice: 0, description: '', serviceName: '' };
        
        let price = service.price;
        // Special price logic for bigovanje
        if (service.id === 'bigovanje' && quantity > 50) {
            price = service.price_over_50 || price;
        }

        return { 
            unitPrice: price, 
            description: service.name,
            serviceName: service.name
        };
    }, [selectedServiceId, quantity, services]);
    
    const totalPrice = unitPrice * quantity;

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;

        let finalDescription = description;
        if (selectedServiceId === 'bigovanje') {
            finalDescription += ` (${quantity} kom)`;
        }


        onAddToBasket({
            serviceId: `dorada-ostalo-${selectedServiceId}`,
            naziv: serviceName,
            opis: finalDescription,
            kolicina: quantity,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
        });
    };

    const selectedService = services.find(s => s.id === selectedServiceId);

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="other-finishing-type">Vrsta usluge</Label>
                    <Select onValueChange={setSelectedServiceId} defaultValue={selectedServiceId}>
                        <SelectTrigger id="other-finishing-type">
                            <SelectValue placeholder="Izaberite vrstu usluge" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="other-finishing-quantity">Količina</Label>
                        <Input
                            id="other-finishing-quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            className="max-w-xs"
                        />
                        { selectedService?.id === 'bigovanje' &&
                            <p className="text-xs text-muted-foreground">Podešavanje + 50 bigova je {selectedService.price} RSD. <br/> Preko 50 kom, cena po komadu je {selectedService.price_over_50} RSD.</p>
                         }
                    </div>
                     <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
                        <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                        <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                            {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                        </p>
                        <p className="text-xs text-muted-foreground h-4">
                           {quantity > 0 && `(${unitPrice.toFixed(2)} RSD / ${selectedService?.unit || 'kom'})`}
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
};


export function FinishingOptions({ onAddToBasket }: FinishingOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Opcije dorade</h3>
            <Tabs defaultValue="binding" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="binding">
                        <BookCopy className="mr-2 h-4 w-4"/>
                        Koričenje
                    </TabsTrigger>
                    <TabsTrigger value="hardcover">
                        <ShieldCheck className="mr-2 h-4 w-4"/>
                        Tvrdi Povez
                    </TabsTrigger>
                    <TabsTrigger value="lamination">
                        <Layers className="mr-2 h-4 w-4" />
                        Plastifikacija
                    </TabsTrigger>
                     <TabsTrigger value="other">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Ostalo
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="binding">
                    <BindingCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="hardcover">
                   <HardcoverBinding onAddToBasket={onAddToBasket} />
                </TabsContent>
                 <TabsContent value="lamination">
                   <LaminationCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="other">
                   <OtherFinishingCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

  