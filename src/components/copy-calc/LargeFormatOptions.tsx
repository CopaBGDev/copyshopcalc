"use client";

import { useState, useMemo } from 'react';
import type { OrderItem } from '@/lib/types';
import { largeFormatServices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Ruler } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';

type LargeFormatOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};


const PlottingCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [rollWidth, setRollWidth] = useState(largeFormatServices.plotting.paper80g[0].rollWidth);
    const [printType, setPrintType] = useState<'cb' | 'lineColor' | 'fullColor'>('cb');
    const [length, setLength] = useState<number>(1);
    const [finishing, setFinishing] = useState({ cut: false, foldA4: false, foldA3: false });

    const { unitPrice, plotPrice, finishingPrice, description } = useMemo(() => {
        const selectedRoll = largeFormatServices.plotting.paper80g.find(r => r.rollWidth === rollWidth);
        if (!selectedRoll || length <= 0) return { unitPrice: 0, plotPrice: 0, finishingPrice: 0, description: '' };

        let pricePerMeter = 0;
        let typeDesc = '';
        switch(printType) {
            case 'cb':
                pricePerMeter = selectedRoll.cb;
                typeDesc = 'C/B';
                break;
            case 'lineColor':
                pricePerMeter = selectedRoll.lineColor;
                typeDesc = 'Linijski kolor';
                break;
            case 'fullColor':
                pricePerMeter = selectedRoll.fullColor;
                typeDesc = 'Pun kolor';
                break;
        }

        const currentPlotPrice = pricePerMeter * length;

        let currentFinishingPrice = 0;
        let finishingDesc = [];
        if (finishing.cut) {
            currentFinishingPrice += largeFormatServices.plotting.finishing[0].price * length;
            finishingDesc.push('sečenje');
        }
        if (finishing.foldA4) {
            currentFinishingPrice += largeFormatServices.plotting.finishing[1].price * length;
            finishingDesc.push('savijanje na A4');
        }
        if (finishing.foldA3) {
            currentFinishingPrice += largeFormatServices.plotting.finishing[2].price * length;
            finishingDesc.push('savijanje na A3');
        }

        const total = currentPlotPrice + currentFinishingPrice;
        const desc = `Plotovanje ${length.toFixed(2)}m, ${rollWidth}, ${typeDesc}${finishingDesc.length > 0 ? `, ${finishingDesc.join(', ')}` : ''}`;

        return { unitPrice: total, plotPrice: currentPlotPrice, finishingPrice: currentFinishingPrice, description: desc };
    }, [rollWidth, printType, length, finishing]);

    const handleAddToBasket = () => {
        if (unitPrice <= 0) return;
        onAddToBasket({
            serviceId: `plot-${rollWidth}-${printType}-${length}`,
            naziv: 'Plotovanje crteža',
            opis: description,
            kolicina: 1,
            cena_jedinice: unitPrice,
            cena_ukupno: unitPrice,
        });
    };
    
    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Širina rolne</Label>
                        <Select onValueChange={(v) => setRollWidth(v)} defaultValue={rollWidth}>
                            <SelectTrigger>
                                <SelectValue placeholder="Izaberite širinu rolne" />
                            </SelectTrigger>
                            <SelectContent>
                                {largeFormatServices.plotting.paper80g.map(r => (
                                    <SelectItem key={r.rollWidth} value={r.rollWidth}>
                                        {r.rollWidth}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Vrsta štampe</Label>
                        <RadioGroup value={printType} onValueChange={(v) => setPrintType(v as any)} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cb" id="plot-cb" />
                                <Label htmlFor="plot-cb">C/B</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lineColor" id="plot-line" />
                                <Label htmlFor="plot-line">Linijski kolor</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fullColor" id="plot-full" />
                                <Label htmlFor="plot-full">Pun kolor</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="plot-length">Dužina (m)</Label>
                    <Input id="plot-length" type="number" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} min="0.1" step="0.1" className="max-w-xs"/>
                </div>

                <div className="space-y-2">
                    <Label>Dorada</Label>
                    <div className="flex flex-col sm:flex-row gap-4">
                         <div className="flex items-center space-x-2">
                            <Checkbox id="cut" checked={finishing.cut} onCheckedChange={checked => setFinishing(f => ({ ...f, cut: !!checked }))} />
                            <Label htmlFor="cut">Sečenje (+{largeFormatServices.plotting.finishing[0].price.toFixed(2)} RSD/m)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="foldA4" checked={finishing.foldA4} onCheckedChange={checked => setFinishing(f => ({ ...f, foldA4: !!checked }))} />
                            <Label htmlFor="foldA4">Savijanje na A4 (+{largeFormatServices.plotting.finishing[1].price.toFixed(2)} RSD/m)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="foldA3" checked={finishing.foldA3} onCheckedChange={checked => setFinishing(f => ({ ...f, foldA3: !!checked }))} />
                            <Label htmlFor="foldA3">Savijanje na A3 (+{largeFormatServices.plotting.finishing[2].price.toFixed(2)} RSD/m)</Label>
                        </div>
                    </div>
                </div>
                
                <Separator />

                 <div className="flex flex-col items-end bg-primary/5 p-4 rounded-lg">
                    <div className="w-full flex justify-between text-sm"><span>Cena plotovanja:</span> <span>{plotPrice.toFixed(2)} RSD</span></div>
                    {finishingPrice > 0 && <div className="w-full flex justify-between text-sm"><span>Cena dorade:</span> <span>{finishingPrice.toFixed(2)} RSD</span></div>}
                    <Separator className="my-2" />
                    <Label className="text-sm text-muted-foreground self-end">Ukupna cena</Label>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                        {unitPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                    </p>
                    <p className="text-xs text-muted-foreground h-4">
                        {description}
                    </p>
                </div>


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

const PosterCalculator = ({ onAddToBasket }: { onAddToBasket: (item: Omit<OrderItem, 'id'>) => void }) => {
    const [calcType, setCalcType] = useState<'fixed' | 'by-meter'>('fixed');
    
    // Fixed format state
    const [fixedFormat, setFixedFormat] = useState<'50x70' | '70x100'>('50x70');
    const [fixedPaper, setFixedPaper] = useState(largeFormatServices.posters.fixedFormat['50x70'][0].paper);
    const [fixedQuantity, setFixedQuantity] = useState(1);

    // By meter state
    const [byMeterPaperId, setByMeterPaperId] = useState(0);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    const { fixedPrice, fixedDescription } = useMemo(() => {
        const paperOptions = largeFormatServices.posters.fixedFormat[fixedFormat];
        const selected = paperOptions.find(p => p.paper === fixedPaper);
        if (!selected) return { fixedPrice: 0, fixedDescription: '' };
        
        const price = selected.price * fixedQuantity;
        const desc = `Poster ${fixedFormat}cm, ${fixedPaper}`;

        return { fixedPrice: price, fixedDescription: desc };
    }, [fixedFormat, fixedPaper, fixedQuantity]);


    const { byMeterPrice, byMeterDescription } = useMemo(() => {
        const selected = largeFormatServices.posters.byMeter[byMeterPaperId];
        if (!selected || width <=0 || height <= 0) return { byMeterPrice: 0, byMeterDescription: '' };

        const area = width * height;
        const price = area * selected.priceM2;
        const desc = `Poster ${width.toFixed(2)}x${height.toFixed(2)}m (${area.toFixed(2)}m²), ${selected.paper}`;

        return { byMeterPrice: price, byMeterDescription: desc };
    }, [byMeterPaperId, width, height]);


    const handleFixedAddToBasket = () => {
        if (fixedPrice <= 0) return;
        const paperOptions = largeFormatServices.posters.fixedFormat[fixedFormat];
        const selected = paperOptions.find(p => p.paper === fixedPaper);
        
        onAddToBasket({
            serviceId: `poster-fixed-${fixedFormat}-${fixedPaper}`,
            naziv: 'Štampa postera',
            opis: `${fixedDescription} (x${fixedQuantity})`,
            kolicina: fixedQuantity,
            cena_jedinice: selected?.price || 0,
            cena_ukupno: fixedPrice,
        });
    }

    const handleByMeterAddToBasket = () => {
        if (byMeterPrice <= 0) return;
        const selected = largeFormatServices.posters.byMeter[byMeterPaperId];
        onAddToBasket({
            serviceId: `poster-bymeter-${byMeterPaperId}-${width}x${height}`,
            naziv: 'Štampa postera po meri',
            opis: byMeterDescription,
            kolicina: 1,
            cena_jedinice: byMeterPrice,
            cena_ukupno: byMeterPrice,
        });
    }

    const handleFixedFormatChange = (value: string) => {
        const newFormat = value as '50x70' | '70x100';
        setFixedFormat(newFormat);
        setFixedPaper(largeFormatServices.posters.fixedFormat[newFormat][0].paper);
    }

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4 space-y-6">
                <RadioGroup value={calcType} onValueChange={(v) => setCalcType(v as any)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="poster-fixed" />
                        <Label htmlFor="poster-fixed">Fiksni formati</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="by-meter" id="poster-by-meter" />
                        <Label htmlFor="poster-by-meter">Po metru</Label>
                    </div>
                </RadioGroup>
                <Separator />

                {calcType === 'fixed' && (
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Format</Label>
                                <Select onValueChange={handleFixedFormatChange} defaultValue={fixedFormat}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="50x70">50x70 cm</SelectItem>
                                        <SelectItem value="70x100">70x100 cm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Vrsta papira</Label>
                                <Select onValueChange={setFixedPaper} value={fixedPaper}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {largeFormatServices.posters.fixedFormat[fixedFormat].map(p => (
                                            <SelectItem key={p.paper} value={p.paper}>{p.paper}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="fixed-poster-qty">Količina</Label>
                                <Input id="fixed-poster-qty" type="number" value={fixedQuantity} onChange={(e) => setFixedQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="max-w-xs"/>
                            </div>
                            <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
                                <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                                <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                                    {fixedPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                                </p>
                            </div>
                         </div>
                         <Separator/>
                         <div className="flex justify-end">
                            <Button size="lg" onClick={handleFixedAddToBasket} disabled={fixedPrice <= 0}>
                                <PlusCircle className="mr-2" />
                                Dodaj u korpu
                            </Button>
                        </div>
                    </div>
                )}

                {calcType === 'by-meter' && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                            <Label>Vrsta papira i širina rolne</Label>
                            <Select onValueChange={(v) => setByMeterPaperId(parseInt(v, 10))} defaultValue={byMeterPaperId.toString()}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {largeFormatServices.posters.byMeter.map((p, idx) => (
                                        <SelectItem key={idx} value={idx.toString()}>{p.paper} ({p.rollWidth})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="poster-width">Širina (m)</Label>
                                <Input id="poster-width" type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} min="0.1" step="0.1" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="poster-height">Visina (m)</Label>
                                <Input id="poster-height" type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} min="0.1" step="0.1" />
                            </div>
                             <div className="flex flex-col items-end bg-primary/5 p-4 rounded-lg">
                                <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
                                <p className="text-3xl font-bold font-mono tracking-tight text-primary">
                                    {byMeterPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
                                </p>
                            </div>
                         </div>
                         <Separator/>
                         <div className="flex justify-end">
                            <Button size="lg" onClick={handleByMeterAddToBasket} disabled={byMeterPrice <= 0}>
                                <PlusCircle className="mr-2" />
                                Dodaj u korpu
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export function LargeFormatOptions({ onAddToBasket }: LargeFormatOptionsProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                Opcije za Velike Formate
            </h3>
            <Tabs defaultValue="plotting" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="plotting">
                        Plotovanje crteža
                    </TabsTrigger>
                    <TabsTrigger value="posters">
                        Štampa postera
                    </TabsTrigger>
                    <TabsTrigger value="banners" disabled>
                        Baneri i Cirade
                    </TabsTrigger>
                     <TabsTrigger value="rollups" disabled>
                        Roll-up
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="plotting">
                    <PlottingCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="posters">
                   <PosterCalculator onAddToBasket={onAddToBasket} />
                </TabsContent>
                <TabsContent value="banners">
                   <p className="p-4 text-center text-muted-foreground">Uskoro dostupno...</p>
                </TabsContent>
                <TabsContent value="rollups">
                   <p className="p-4 text-center text-muted-foreground">Uskoro dostupno...</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
