"use client";
import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { finishingServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, BookCopy, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '../ui/card';

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

// Placeholder for other finishing types
const HardcoverBinding = () => (
    <div className="text-center text-muted-foreground p-8">
        <p>Opcije za tvrdi povez će biti uskoro dostupne.</p>
    </div>
);
const Lamination = () => (
     <div className="text-center text-muted-foreground p-8">
        <p>Opcije za plastifikaciju će biti uskoro dostupne.</p>
    </div>
);


export function FinishingOptions({ onAddToBasket }: FinishingOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Opcije dorade</h3>
            <Tabs defaultValue="binding" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="binding">
                        <BookCopy className="mr-2 h-4 w-4"/>
                        Koričenje
                    </TabsTrigger>
                    <TabsTrigger value="hardcover" disabled>
                        <ShieldCheck className="mr-2 h-4 w-4"/>
                        Tvrdi Povez
                    </TabsTrigger>
                    <TabsTrigger value="lamination" disabled>
                        Plastifikacija
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="binding">
                    <BindingCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="hardcover">
                   <HardcoverBinding />
                </TabsContent>
                 <TabsContent value="lamination">
                   <Lamination />
                </TabsContent>
            </Tabs>
        </div>
    );
}
