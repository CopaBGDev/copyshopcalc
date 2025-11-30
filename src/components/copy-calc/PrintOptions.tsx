"use client";

import { useState, useMemo, useEffect } from "react";
import type { OrderItem, PaperType, PriceTier, PrintOption, PrintFormat } from "@/lib/types";
import { printServices } from "@/lib/data";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PrintOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

const SRA3_W = 450;
const SRA3_H = 320;

function calculateItemsPerSheet(itemW: number, itemH: number, sheetW: number, sheetH: number): number {
    if (itemW <= 0 || itemH <= 0) return 0;

    // First orientation
    const itemsNormal = Math.floor(sheetW / itemW) * Math.floor(sheetH / itemH);

    // Rotated orientation
    const itemsRotated = Math.floor(sheetW / itemH) * Math.floor(sheetH / itemW);

    return Math.max(itemsNormal, itemsRotated);
}


export function PrintOptions({ onAddToBasket }: PrintOptionsProps) {
  const [format, setFormat] = useState<PrintFormat | 'custom'>('A4');
  const [color, setColor] = useState<'cb' | 'kolor'>('cb');
  const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
  const [paperId, setPaperId] = useState<string>('80gr');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  // Custom dimension state
  const [customWidth, setCustomWidth] = useState<number>(90);
  const [customHeight, setCustomHeight] = useState<number>(50);
  const [itemsPerSRA3, setItemsPerSRA3] = useState<number>(0);

  const selectedPaper: PaperType | undefined = useMemo(() => printServices.papers.find(p => p.id === paperId), [paperId]);
  
  const activePrintOption: PrintOption | undefined = useMemo(() => {
    // For price calculation, we always use A3 or A4 as base
    let baseFormatForPrice: 'A3' | 'A4' = 'A4';
    if (format === 'A3' || format === 'SRA3' || format === 'custom') {
        baseFormatForPrice = 'A3';
    }

    const effectiveColor = (selectedPaper && selectedPaper.price > 0 && color === 'cb') ? 'kolor' : color;

    return printServices.options.find(opt => opt.format === baseFormatForPrice && opt.color === effectiveColor);
  }, [format, color, selectedPaper]);

  useEffect(() => {
    if (!activePrintOption || quantity <= 0 || !selectedPaper) {
      setTotalPrice(0);
      setUnitPrice(0);
      return;
    }

    if (format === 'custom') {
        const sra3PrintPriceOption = printServices.options.find(opt => opt.format === 'A3' && opt.color === activePrintOption.color);
        if (!sra3PrintPriceOption) return;

        const sra3PriceTiers: PriceTier[] = sra3PrintPriceOption[side];
        const sra3Tier = sra3PriceTiers[0]; // Price for 1-20 copies is the base for sheet
        
        const sra3PrintPrice = sra3Tier.cena;
        const sra3PaperPrice = selectedPaper.price > 0 ? selectedPaper.price : (activePrintOption.format === 'A3' ? printServices.papers.find(p => p.id === '80gr-a3')?.price || 0 : 0);

        const totalSheetPrice = sra3PrintPrice + sra3PaperPrice;
        
        const itemsCount = calculateItemsPerSheet(customWidth, customHeight, SRA3_W, SRA3_H);
        setItemsPerSRA3(itemsCount);

        if(itemsCount > 0) {
            const finalUnitPrice = totalSheetPrice / itemsCount;
            setUnitPrice(finalUnitPrice);
            setTotalPrice(finalUnitPrice * quantity);
        } else {
            setUnitPrice(0);
            setTotalPrice(0);
        }

    } else {
        setItemsPerSRA3(0);
        const priceTiers: PriceTier[] = activePrintOption[side];
        const tier = priceTiers.find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max) || priceTiers[priceTiers.length - 1];
        
        let currentUnitPrice = tier.cena;

        // Adjust price for smaller formats based on A4
        if (format === 'A5') {
            currentUnitPrice /= 2;
        } else if (format === 'A6') {
            currentUnitPrice /= 4;
        }
        
        let paperPricePerCopy = 0;
        if (selectedPaper.price > 0) {
            if (selectedPaper.format === 'SRA3') {
                let copiesPerSheet = 1;
                if (format === 'SRA3') copiesPerSheet = 1;
                else if (format === 'A3') copiesPerSheet = 1; // approx
                else if (format === 'A4') copiesPerSheet = 2;
                else if (format === 'A5') copiesPerSheet = 4;
                else if (format === 'A6') copiesPerSheet = 8;
                paperPricePerCopy = selectedPaper.price / copiesPerSheet;
            } else {
                 paperPricePerCopy = selectedPaper.price;
            }
        }
        
        const finalUnitPrice = currentUnitPrice + paperPricePerCopy;
        setUnitPrice(finalUnitPrice);
        setTotalPrice(finalUnitPrice * quantity);
    }

  }, [quantity, format, color, side, paperId, activePrintOption, selectedPaper, customWidth, customHeight]);
  

  const handleAddToBasket = () => {
    if (!activePrintOption || !selectedPaper || quantity <= 0 || totalPrice <= 0) return;
    
    let naziv = "Štampa";
    let opis = "";

    if (format === 'custom') {
        naziv = `Štampa proizvoljnog formata`;
        opis = `${customWidth}x${customHeight}mm, ${color === 'cb' ? 'crno-belo' : 'kolor'}, ${side === 'oneSided' ? 'jednostrano' : 'obostrano'}, ${selectedPaper.name}`;
    } else {
        const effectiveColor = (selectedPaper && selectedPaper.price > 0 && color === 'cb') ? 'kolor' : color;
        opis = `${format}, ${effectiveColor === 'cb' ? 'crno-belo' : 'kolor'}, ${side === 'oneSided' ? 'jednostrano' : 'obostrano'}, ${selectedPaper.name}`;
        const baseFormatForName = (format === 'A5' || format === 'A6' || format === 'SRA3') ? 'A4' : format;
        naziv = printServices.options.find(opt => opt.format === baseFormatForName && opt.color === effectiveColor)?.name.replace('A4', format).replace('A3', format) || "Štampa";
    }
    
    onAddToBasket({
      serviceId: `stampa-${format}-${color}-${side}-${paperId}-${customWidth}x${customHeight}`,
      naziv: naziv,
      opis,
      kolicina: quantity,
      cena_jedinice: unitPrice,
      cena_ukupno: totalPrice,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Opcije štampe i kopiranja</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Format */}
            <div className="space-y-2">
                <Label>Format papira</Label>
                <RadioGroup defaultValue="A4" value={format} onValueChange={(v) => setFormat(v as PrintFormat | 'custom')} className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A4" id="format-a4" />
                        <Label htmlFor="format-a4">A4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A3" id="format-a3" />
                        <Label htmlFor="format-a3">A3</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A5" id="format-a5" />
                        <Label htmlFor="format-a5">A5</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A6" id="format-a6" />
                        <Label htmlFor="format-a6">A6</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SRA3" id="format-sra3" />
                        <Label htmlFor="format-sra3">SRA3</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="format-custom" />
                        <Label htmlFor="format-custom">Proizvoljni</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Color & Side */}
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>Boja</Label>
                    <RadioGroup defaultValue="cb" value={color} onValueChange={(v) => setColor(v as 'cb'|'kolor')} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cb" id="color-cb" />
                            <Label htmlFor="color-cb">Crno-belo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="kolor" id="color-kolor" />
                            <Label htmlFor="color-kolor">Kolor</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label>Štampa</Label>
                    <RadioGroup defaultValue="oneSided" value={side} onValueChange={(v) => setSide(v as 'oneSided'|'twoSided')} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oneSided" id="side-one" />
                            <Label htmlFor="side-one">Jednostrano</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="twoSided" id="side-two" />
                            <Label htmlFor="side-two">Obostrano</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            {/* Paper */}
            <div className="space-y-2">
                <Label htmlFor="paper-type">Vrsta papira</Label>
                <Select value={paperId} onValueChange={setPaperId}>
                    <SelectTrigger id="paper-type">
                        <SelectValue placeholder="Izaberite vrstu papira" />
                    </SelectTrigger>
                    <SelectContent>
                        {printServices.papers.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {selectedPaper && selectedPaper.price > 0 && (
                    <p className="text-xs text-muted-foreground">
                        Doplata za ovaj papir se automatski obračunava. Crno-bela štampa na ovom papiru se naplaćuje kao kolor.
                    </p>
                )}
            </div>
        </div>
      </div>

      {format === 'custom' && (
        <div className="animate-in fade-in duration-300">
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                     <h4 className="font-semibold">Proizvoljne dimenzije</h4>
                     <div className="flex gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="custom-width">Širina (mm)</Label>
                            <Input 
                                id="custom-width"
                                type="number"
                                value={customWidth}
                                onChange={(e) => setCustomWidth(parseInt(e.target.value, 10) || 0)}
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="custom-height">Visina (mm)</Label>
                            <Input 
                                id="custom-height"
                                type="number"
                                value={customHeight}
                                onChange={(e) => setCustomHeight(parseInt(e.target.value, 10) || 0)}
                                min="1"
                            />
                        </div>
                    </div>
                </div>
                <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertTitle>Obračun</AlertTitle>
                    <AlertDescription>
                        Cena se računa na osnovu broja komada koji staju na SRA3 tabak (450x320mm). 
                        Na jedan tabak staje: <span className="font-bold">{itemsPerSRA3}</span> kom.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
      )}

      <Separator className="my-6" />

      {/* Quantity & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label htmlFor="quantity">Količina (broj komada)</Label>
          <Input 
            id="quantity" 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-col items-start md:items-end bg-primary/5 p-4 rounded-lg">
           <Label className="text-sm text-muted-foreground">Ukupna cena</Label>
           <p className="text-3xl font-bold font-mono tracking-tight text-primary">
             {totalPrice.toFixed(2)} <span className="text-xl font-semibold">RSD</span>
           </p>
            {quantity > 0 && unitPrice > 0 && (
                 <p className="text-xs text-muted-foreground font-mono">
                    ({unitPrice.toFixed(2)} RSD / kom)
                </p>
            )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end">
        <Button size="lg" onClick={handleAddToBasket} disabled={quantity <= 0 || !activePrintOption || totalPrice <= 0}>
          <PlusCircle className="mr-2"/>
          Dodaj u korpu
        </Button>
      </div>
    </div>
  );
}
