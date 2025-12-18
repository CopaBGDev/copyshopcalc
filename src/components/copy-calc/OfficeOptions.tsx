
"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { officeSuppliesData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, FileText, Mail, BookOpen, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type OfficeOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

const MemorandumCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [quantity, setQuantity] = useState('100');

    const { totalPrice, unitPrice, sifra } = useMemo(() => {
        const qtyNum = parseInt(quantity);
        const tier = officeSuppliesData.memorandums.find(m => m.kolicina === qtyNum);
        if (!tier) return { totalPrice: 0, unitPrice: 0, sifra: undefined };
        return { totalPrice: tier.cena, unitPrice: tier.cena / qtyNum, sifra: tier.sifra };
    }, [quantity]);

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        const qtyNum = parseInt(quantity);
        onAddToBasket({
            serviceId: `memorandum-${qtyNum}`,
            naziv: `Memorandumi, kolor`,
            opis: `${qtyNum} komada`,
            kolicina: qtyNum,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
            sifra: sifra,
        });
    };

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="memo-quantity">Količina</Label>
                    <Select onValueChange={setQuantity} defaultValue={quantity}>
                        <SelectTrigger id="memo-quantity">
                            <SelectValue placeholder="Izaberite količinu" />
                        </SelectTrigger>
                        <SelectContent>
                            {officeSuppliesData.memorandums.map(tier => (
                                <SelectItem key={tier.kolicina} value={tier.kolicina.toString()}>
                                    {tier.kolicina} komada
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        <PlusCircle className="mr-2" /> Dodaj u korpu
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const EnvelopeCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [type, setType] = useState<'ameriken' | 'c4'>('ameriken');
    const [quantity, setQuantity] = useState('50');

    const { totalPrice, unitPrice, description, sifra } = useMemo(() => {
        const qtyNum = parseInt(quantity);
        const tier = officeSuppliesData.envelopes.find(e => e.type === type && e.kolicina === qtyNum);
        if (!tier) return { totalPrice: 0, unitPrice: 0, description: '', sifra: undefined };
        const desc = `Koverte sa štampom, ${type === 'ameriken' ? 'Ameriken' : 'C4'}, ${qtyNum} kom`;
        return { totalPrice: tier.cena, unitPrice: tier.cena / qtyNum, description: desc, sifra: tier.sifra };
    }, [type, quantity]);

    const handleAddToBasket = () => {
        if (totalPrice <= 0) return;
        const qtyNum = parseInt(quantity);
        onAddToBasket({
            serviceId: `koverta-${type}-${qtyNum}`,
            naziv: `Koverte sa štampom`,
            opis: description,
            kolicina: qtyNum,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
            sifra: sifra,
        });
    };
    
    const availableQuantities = useMemo(() => {
        return officeSuppliesData.envelopes.filter(e => e.type === type).map(e => e.kolicina.toString())
    }, [type]);
    
    // Reset quantity if not available for the new type
    useState(() => {
        if (!availableQuantities.includes(quantity)) {
            setQuantity(availableQuantities[0] || '50');
        }
    }, [type, availableQuantities, quantity]);


    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Tip koverte</Label>
                        <RadioGroup value={type} onValueChange={(v) => setType(v as 'ameriken' | 'c4')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ameriken" id="env-ameriken" />
                                <Label htmlFor="env-ameriken">Ameriken (11x23cm)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="c4" id="env-c4" />
                                <Label htmlFor="env-c4">C4 (23x33cm)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="env-quantity">Količina</Label>
                        <Select onValueChange={setQuantity} value={quantity}>
                            <SelectTrigger id="env-quantity">
                                <SelectValue placeholder="Izaberite količinu" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableQuantities.map(q => (
                                    <SelectItem key={q} value={q}>{q} komada</SelectItem>
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
                        <PlusCircle className="mr-2" /> Dodaj u korpu
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


const BrochureCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [serviceId, setServiceId] = useState(officeSuppliesData.brochures[0].id);
    const [pages, setPages] = useState(1);
    
    const selectedService = useMemo(() => {
        return officeSuppliesData.brochures.find(b => b.id === serviceId);
    }, [serviceId]);

    const { totalPrice, unitPrice, description, sifra } = useMemo(() => {
        if (!selectedService) return { totalPrice: 0, unitPrice: 0, description: '', sifra: undefined };
        
        if (selectedService.unit === 'po strani') {
            const price = selectedService.pricePerPage! * pages;
            return {
                totalPrice: price,
                unitPrice: selectedService.pricePerPage!,
                description: `${selectedService.name}, ${pages} str.`,
                sifra: selectedService.sifra,
            };
        }
        
        return {
            totalPrice: selectedService.price,
            unitPrice: selectedService.price,
            description: selectedService.name,
            sifra: selectedService.sifra,
        };

    }, [selectedService, pages]);

    const handleAddToBasket = () => {
        if(totalPrice <= 0 || !selectedService) return;
        
        let kolicina = selectedService.unit === 'po strani' ? pages : 1;
        let opis = description;

        onAddToBasket({
            serviceId: `brosura-${serviceId}`,
            naziv: selectedService.name.split(' (')[0],
            opis: opis,
            kolicina: kolicina,
            cena_jedinice: unitPrice,
            cena_ukupno: totalPrice,
            sifra: sifra,
        });
    };

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="brochure-type">Tip usluge</Label>
                    <Select onValueChange={setServiceId} defaultValue={serviceId}>
                        <SelectTrigger id="brochure-type">
                            <SelectValue placeholder="Izaberite tip" />
                        </SelectTrigger>
                        <SelectContent>
                            {officeSuppliesData.brochures.map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    {selectedService?.unit === 'po strani' ? (
                        <div className="space-y-2">
                            <Label htmlFor="brochure-pages">Broj strana</Label>
                            <Input 
                                id="brochure-pages"
                                type="number"
                                value={pages}
                                onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                className="max-w-xs"
                            />
                        </div>
                    ) : <div></div>}

                    <div className="flex flex-col items-end bg-primary/5 p-4 rounded-lg">
                         <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                         <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                            {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                        </p>
                        <p className="text-xs text-muted-foreground h-4">
                           {selectedService?.unit === 'po strani' && `(${unitPrice.toFixed(2)} RSD / strana)`}
                        </p>
                    </div>
                </div>
                 <Separator />
                <div className="flex justify-end">
                    <Button size="lg" onClick={handleAddToBasket} disabled={totalPrice <= 0}>
                        <PlusCircle className="mr-2" /> Dodaj u korpu
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export function OfficeOptions({ onAddToBasket }: OfficeOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Opcije za kancelarijski materijal
            </h3>
            <Tabs defaultValue="memorandums" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="memorandums">
                        <FileText className="mr-2 h-4 w-4"/>
                        Memorandumi
                    </TabsTrigger>
                    <TabsTrigger value="envelopes">
                        <Mail className="mr-2 h-4 w-4"/>
                        Koverte
                    </TabsTrigger>
                     <TabsTrigger value="brochures">
                        <BookOpen className="mr-2 h-4 w-4"/>
                        Brošure i Lifleti
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="memorandums">
                    <MemorandumCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="envelopes">
                    <EnvelopeCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="brochures">
                   <BrochureCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
