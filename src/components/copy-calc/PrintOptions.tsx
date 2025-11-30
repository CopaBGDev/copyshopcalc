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

type PrintOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'>) => void;
};

export function PrintOptions({ onAddToBasket }: PrintOptionsProps) {
  const [format, setFormat] = useState<PrintFormat>('A4');
  const [color, setColor] = useState<'cb' | 'kolor'>('cb');
  const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
  const [paperId, setPaperId] = useState<string>('80gr');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  const selectedPaper: PaperType | undefined = useMemo(() => printServices.papers.find(p => p.id === paperId), [paperId]);
  
  const activePrintOption: PrintOption | undefined = useMemo(() => {
    const baseFormat = (format === 'A5' || format === 'A6' || format === 'SRA3') ? 'A4' : format;
    const effectiveColor = (selectedPaper && selectedPaper.price > 0 && color === 'cb') ? 'kolor' : color;
    const baseFormatForPrice = (format === 'A5' || format === 'A6') ? 'A4' : (format === 'SRA3' ? 'A3' : format);

    return printServices.options.find(opt => opt.format === baseFormatForPrice && opt.color === effectiveColor);
  }, [format, color, selectedPaper]);

  useEffect(() => {
    if (!activePrintOption || quantity <= 0 || !selectedPaper) {
      setTotalPrice(0);
      setUnitPrice(0);
      return;
    }

    const priceTiers: PriceTier[] = activePrintOption[side];
    const tier = priceTiers.find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max) || priceTiers[priceTiers.length - 1];
    
    let currentUnitPrice = tier.cena;

    // Adjust price for smaller formats
    if (format === 'A5') {
        currentUnitPrice /= 2;
    } else if (format === 'A6') {
        currentUnitPrice /= 4;
    }

    // Paper price calculation logic
    let paperPricePerCopy = 0;
    if (selectedPaper.price > 0) {
      if (selectedPaper.format === 'SRA3') {
        let copiesPerSheet = 1; // for A3 or SRA3
        if (format === 'A4') copiesPerSheet = 2;
        if (format === 'A5') copiesPerSheet = 4;
        if (format === 'A6') copiesPerSheet = 8;
        paperPricePerCopy = selectedPaper.price / copiesPerSheet;
      } else { // Assuming other special papers are per-sheet for the selected format
        paperPricePerCopy = selectedPaper.price;
      }
    }
    
    const finalUnitPrice = currentUnitPrice + paperPricePerCopy;
    setUnitPrice(finalUnitPrice);
    setTotalPrice(finalUnitPrice * quantity);

  }, [quantity, format, color, side, paperId, activePrintOption, selectedPaper]);
  

  const handleAddToBasket = () => {
    if (!activePrintOption || !selectedPaper || quantity <= 0) return;
    
    const effectiveColor = (selectedPaper && selectedPaper.price > 0 && color === 'cb') ? 'kolor' : color;
    const opis = `${format}, ${effectiveColor === 'cb' ? 'crno-belo' : 'kolor'}, ${side === 'oneSided' ? 'jednostrano' : 'obostrano'}, ${selectedPaper.name}`;
    const baseFormatForName = (format === 'A5' || format === 'A6' || format === 'SRA3') ? 'A4' : format;
    const finalName = printServices.options.find(opt => opt.format === baseFormatForName && opt.color === effectiveColor)?.name || "Štampa";

    onAddToBasket({
      serviceId: `stampa-${format}-${color}-${side}-${paperId}`,
      naziv: `${finalName.replace('A4', format).replace('A3', format)}`,
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
                <RadioGroup defaultValue="A4" value={format} onValueChange={(v) => setFormat(v as PrintFormat)} className="grid grid-cols-2 gap-2">
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

      <Separator />

      {/* Quantity & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label htmlFor="quantity">Količina (broj otisaka)</Label>
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
            {quantity > 0 && (
                 <p className="text-xs text-muted-foreground font-mono">
                    ({unitPrice.toFixed(2)} RSD / kom)
                </p>
            )}
        </div>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button size="lg" onClick={handleAddToBasket} disabled={quantity <= 0 || !activePrintOption}>
          <PlusCircle className="mr-2"/>
          Dodaj u korpu
        </Button>
      </div>
    </div>
  );
}
