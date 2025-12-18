
"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { businessCardServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, FileText, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type BusinessCardOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};


const DigitalCardCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
    const [quantity, setQuantity] = useState<string>('100');
    const [lamination, setLamination] = useState<'none' | 'jednostrana-mat' | 'jednostrana-sjaj' | 'obostrana-mat' | 'obostrana-sjaj'>('none');
    const [rounding, setRounding] = useState(false);


    const { totalPrice, description, sifra } = useMemo(() => {
        const quantityNum = parseInt(quantity, 10);
        const priceList = businessCardServices.digital[side];
        const tier = priceList.find(p => p.kolicina === quantityNum);

        if (!tier || !businessCardServices.doplate) return { totalPrice: 0, description: '', sifra: undefined };

        let basePrice = tier.cena;
        let finishingDesc: string[] = [];
        
        if (lamination !== 'none') {
            const isTwoSidedLamination = lamination.startsWith('obostrana');
            const laminationPrice = isTwoSidedLamination 
                ? businessCardServices.doplate.plastifikacija.dvostrano 
                : businessCardServices.doplate.plastifikacija.jednostrano;
            basePrice += laminationPrice;

            const laminationType = lamination.endsWith('mat') ? 'mat' : 'sjaj';
            finishingDesc.push(`plastifikacija ${isTwoSidedLamination ? 'obostrana' : 'jednostrana'} ${laminationType}`);
        }

        if (rounding) {
            basePrice += businessCardServices.doplate.coskanje.cena * quantityNum;
            finishingDesc.push('ćoškanje');
        }

        let desc = `Vizit karte, ${side === 'oneSided' ? 'jednostrane' : 'dvostrane'}, ${quantityNum} kom`;
        if (finishingDesc.length > 0) {
            desc += `, ${finishingDesc.join(' + ')}`;
        }

        return { totalPrice: basePrice, description: desc, sifra: tier.sifra };

    }, [side, quantity, lamination, rounding]);

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

                <div className="space-y-4">
                    <Label>Dorada</Label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="lamination">Plastifikacija</Label>
                            <Select onValueChange={(v) => setLamination(v as any)} value={lamination}>
                                <SelectTrigger id="lamination">
                                    <SelectValue placeholder="Izaberite plastifikaciju" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Bez plastifikacije</SelectItem>
                                    <SelectItem value="jednostrana-mat">Jednostrana Mat</SelectItem>
                                    <SelectItem value="jednostrana-sjaj">Jednostrana Sjaj</SelectItem>
                                    <SelectItem value="obostrana-mat">Obostrana Mat</SelectItem>
                                    <SelectItem value="obostrana-sjaj">Obostrana Sjaj</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                            <Checkbox id="rounding" checked={rounding} onCheckedChange={(checked) => setRounding(!!checked)} />
                            <Label htmlFor="rounding" className="font-normal">Ćoškanje (zaobljene ivice)</Label>
                        </div>
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

const LuxCardCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [luxType, setLuxType] = useState<'pvc-standard' | 'pvc-special' | 'paper350g'>('paper350g');
    const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
    const [quantity, setQuantity] = useState(100);

    const minQuantity = useMemo(() => {
        return luxType.startsWith('pvc') ? businessCardServices.lux.pvc.standard.min_kom : 1;
    }, [luxType]);

    const { totalPrice, description, unitPrice, sifra } = useMemo(() => {
        let price = 0;
        let desc = '';
        let uPrice = 0;
        let finalSifra: number | undefined = undefined;

        const sideKey = side === 'oneSided' ? 'jednostrane' : 'dvostrane';

        switch (luxType) {
            case 'pvc-standard':
                price = businessCardServices.lux.pvc.standard[sideKey];
                finalSifra = side === 'oneSided' ? businessCardServices.lux.pvc.standard.sifra_jednostrano : businessCardServices.lux.pvc.standard.sifra_dvostrano;
                desc = `Lux PVC vizit karte, ${side === 'oneSided' ? 'jednostrane' : 'dvostrane'}`;
                break;
            case 'pvc-special':
                price = businessCardServices.lux.pvc.special[sideKey];
                finalSifra = side === 'oneSided' ? businessCardServices.lux.pvc.special.sifra_jednostrano : businessCardServices.lux.pvc.special.sifra_dvostrano;
                desc = `Lux PVC vizit karte (crne/zlatne/srebrne), ${side === 'oneSided' ? 'jednostrane' : 'dvostrane'}`;
                break;
            case 'paper350g':
                price = businessCardServices.lux.paper350g[sideKey];
                finalSifra = side === 'oneSided' ? businessCardServices.lux.paper350g.sifra_jednostrano : businessCardServices.lux.paper350g.sifra_dvostrano;
                desc = `Lux vizit karte 350g+ papir, ${side === 'oneSided' ? 'jednostrane' : 'dvostrane'}`;
                break;
        }

        uPrice = price; // Per 100pc
        const validQuantity = Math.max(minQuantity, quantity);
        price = (price / 100) * validQuantity;
        
        desc += `, ${validQuantity} kom`;

        return { totalPrice: price, description: desc, unitPrice: uPrice, sifra: finalSifra };
    }, [luxType, side, quantity, minQuantity]);

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        
        onAddToBasket({
            serviceId: `vizitke-lux-${luxType}-${side}-${quantity}`,
            naziv: 'Lux Vizit karte',
            opis: description,
            kolicina: quantity,
            cena_jedinice: totalPrice / quantity,
            cena_ukupno: totalPrice,
            sifra: sifra,
        });
    };
    
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || minQuantity;
        setQuantity(val);
    }
    
    const handleQuantityBlur = () => {
        if (quantity < minQuantity) {
            setQuantity(minQuantity);
        }
    }


    return (
         <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="lux-type">Tip Lux vizit karti</Label>
                    <Select onValueChange={(v) => {
                        const newType = v as any;
                        setLuxType(newType);
                        const newMinQty = newType.startsWith('pvc') ? businessCardServices.lux.pvc.standard.min_kom : 1;
                        if(quantity < newMinQty) {
                            setQuantity(newMinQty);
                        }
                    }} defaultValue={luxType}>
                        <SelectTrigger id="lux-type">
                            <SelectValue placeholder="Izaberite tip" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paper350g">350g+ Papir</SelectItem>
                            <SelectItem value="pvc-standard">PVC Standard bele</SelectItem>
                            <SelectItem value="pvc-special">PVC Specijalne (crne/zlatne/srebrne)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Štampa</Label>
                        <RadioGroup value={side} onValueChange={(v) => setSide(v as 'oneSided' | 'twoSided')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="oneSided" id="lux-one-sided" />
                                <Label htmlFor="lux-one-sided">Jednostrana</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="twoSided" id="lux-two-sided" />
                                <Label htmlFor="lux-two-sided">Dvostrana</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lux-quantity">Količina</Label>
                        <Input 
                            id="lux-quantity"
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            onBlur={handleQuantityBlur}
                            min={minQuantity}
                            step={luxType.startsWith('pvc') ? 20 : 50}
                        />
                         {luxType.startsWith('pvc') && <p className="text-xs text-muted-foreground">Minimalna količina je {minQuantity} kom.</p>}
                    </div>
                </div>

                <div className="flex flex-col items-end bg-primary/5 p-4 rounded-lg">
                    <Label className="text-sm text-muted-foreground">Ukupna cena za {quantity} kom</Label>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                        {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                    </p>
                    <p className="text-xs text-muted-foreground h-4">
                        Cena za 100 kom: {unitPrice.toFixed(2)} RSD
                    </p>
                </div>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Dodatne opcije</AlertTitle>
                    <AlertDescription>
                        Za doradu (plastifikacija, ćoškanje) i UV štampu, molimo dodajte kao zasebnu stavku ili kontaktirajte menadžera.
                    </AlertDescription>
                </Alert>

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


export function BusinessCardOptions({ onAddToBasket }: BusinessCardOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Opcije za vizit karte
            </h3>
            <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="standard">
                        Standardne vizitke
                    </TabsTrigger>
                    <TabsTrigger value="lux">
                        Lux vizitke
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="standard">
                    <DigitalCardCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="lux">
                   <LuxCardCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

    