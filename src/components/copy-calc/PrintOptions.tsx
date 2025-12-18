

"use client";

import { useState, useMemo, useEffect } from "react";
import type { OrderItem, PaperType, PriceTier, PrintOption, PrintFormat } from "@/lib/types";
import { printServices, finishingServices } from "@/lib/data";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "../ui/checkbox";

type PrintOptionsProps = {
  onAddToBasket: (item: Omit<OrderItem, 'id'> | Omit<OrderItem, 'id'>[]) => void;
};

const SHEET_DIMENSIONS = {
  SRA3_482x330: { w: 482, h: 330 },
  SRA3_450x320: { w: 450, h: 320 },
  A3: { w: 420, h: 297 },
  A4: { w: 297, h: 210 },
}
const MARGIN = 5;

function calculateItemsPerSheet(itemW: number, itemH: number, sheetW: number, sheetH: number): { items: number, cols: number, rows: number } {
    if (itemW <= 0 || itemH <= 0) return { items: 0, cols: 0, rows: 0 };
    
    const usableSheetW = sheetW - (MARGIN * 2);
    const usableSheetH = sheetH - (MARGIN * 2);

    if (itemW > usableSheetW && itemW > usableSheetH) return { items: 0, cols: 0, rows: 0 };
    if (itemH > usableSheetH && itemH > usableSheetW) return { items: 0, cols: 0, rows: 0 };
    
    // First orientation: item not rotated
    const colsNormal = Math.floor(usableSheetW / itemW);
    const rowsNormal = Math.floor(usableSheetH / itemH);
    const itemsNormal = colsNormal * rowsNormal;

    // Second orientation: item rotated 90 degrees
    const colsRotated = Math.floor(usableSheetW / itemH);
    const rowsRotated = Math.floor(usableSheetH / itemW);
    const itemsRotated = colsRotated * rowsRotated;

    if (itemsNormal > itemsRotated) {
      return { items: itemsNormal, cols: colsNormal, rows: rowsNormal };
    } else {
      return { items: itemsRotated, cols: colsRotated, rows: rowsRotated };
    }
}


export function PrintOptions({ onAddToBasket }: PrintOptionsProps) {
  const [format, setFormat] = useState<PrintFormat | 'custom'>('A4');
  const [color, setColor] = useState<'cb' | 'kolor'>('cb');
  const [side, setSide] = useState<'oneSided' | 'twoSided'>('oneSided');
  const [paperId, setPaperId] = useState<string>('80gr');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [sifra, setSifra] = useState<number | undefined>(undefined);

  // Custom dimension state
  const [customWidth, setCustomWidth] = useState<number>(90);
  const [customHeight, setCustomHeight] = useState<number>(50);
  const [itemsPerSheet, setItemsPerSheet] = useState<number>(0);
  const [customSheetFormat, setCustomSheetFormat] = useState<'A4' | 'A3' | 'SRA3_450x320' | 'SRA3_482x330'>('SRA3_482x330');
  const [cuts, setCuts] = useState(0);
  const [customFinishing, setCustomFinishing] = useState<'none' | 'cutting' | 'scoring'>('none');
  const [lamination, setLamination] = useState<'none' | 'jednostrana' | 'obostrana'>('none');
  const [cornerRounding, setCornerRounding] = useState(false);
  const [knifeStart, setKnifeStart] = useState(false);
  
  const [finishingPrice, setFinishingPrice] = useState<number>(0);


  const selectedPaper: PaperType | undefined = useMemo(() => printServices.papers.find(p => p.id === paperId), [paperId]);
  
  const activePrintOption: PrintOption | undefined = useMemo(() => {
    // For price calculation, we always use A3 or A4 as base
    let baseFormatForPrice: 'A3' | 'A4' = 'A4';
    if (format === 'A3' || format === 'SRA3_482x330' || format === 'SRA3_450x320' || (format === 'custom' && (customSheetFormat === 'A3' || customSheetFormat === 'SRA3_482x330' || customSheetFormat === 'SRA3_450x320'))) {
        baseFormatForPrice = 'A3';
    }

    return printServices.options.find(opt => opt.format === baseFormatForPrice && opt.color === color);
  }, [format, color, customSheetFormat]);

  const isOneSidedOnlyPaper = useMemo(() => {
    return ['muflon', 'pvc-folija', 'pvc-bela'].includes(paperId);
  }, [paperId]);

  useEffect(() => {
    if (isOneSidedOnlyPaper) {
      setSide('oneSided');
    }
  }, [paperId, isOneSidedOnlyPaper]);


  useEffect(() => {
    if (!activePrintOption || quantity <= 0 || !selectedPaper) {
      setTotalPrice(0);
      setUnitPrice(0);
      setSifra(undefined);
      return;
    }

    if (format === 'custom') {
        const baseFormatForPrice = customSheetFormat === 'A4' ? 'A4' : 'A3';
        const customPrintPriceOption = printServices.options.find(opt => opt.format === baseFormatForPrice && opt.color === color);
        if (!customPrintPriceOption) return;

        const priceTiers: PriceTier[] = customPrintPriceOption[side];
        const tier = priceTiers.find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max) || priceTiers[priceTiers.length - 1];
        
        let printPricePerSheet = tier.cena;
        setSifra(tier.sifra);

        let paperPricePerSheet = 0;
        
        if (selectedPaper.price > 0) {
            let copiesPerSheet = 1;
            if (selectedPaper.format === 'SRA3') {
                if (customSheetFormat === 'SRA3_482x330' || customSheetFormat === 'SRA3_450x320') copiesPerSheet = 1;
                else if (customSheetFormat === 'A3') copiesPerSheet = 1; // approx.
                else if (customSheetFormat === 'A4') copiesPerSheet = 2;
            } else { // Assuming paper price is for A4 if not SRA3
                 if (customSheetFormat === 'A3') copiesPerSheet = 0.5;
                 else if (customSheetFormat === 'SRA3_482x330' || customSheetFormat === 'SRA3_450x320') copiesPerSheet = 0.5; // This case is less likely, should be SRA3 paper
                 else copiesPerSheet = 1;
            }
             paperPricePerSheet = selectedPaper.price / copiesPerSheet;
        }

        const totalSheetPrintPrice = printPricePerSheet + paperPricePerSheet;
        
        const sheetDims = SHEET_DIMENSIONS[customSheetFormat];
        const { items, cols, rows } = calculateItemsPerSheet(customWidth, customHeight, sheetDims.w, sheetDims.h);
        setItemsPerSheet(items);
        
        let currentCuts = 0;
        if (items > 0) {
            currentCuts = (cols + 1) + (rows + 1);
        }
        setCuts(currentCuts);
        
        let currentFinishingPrice = 0;
        if (customFinishing !== 'none' && items > 0) {
            const isCutting = customFinishing === 'cutting';
            const finishingService = finishingServices.other.find(s => s.id === (isCutting ? 'secenje-a4-a3' : 'ricovanje'));
            if(finishingService) {
                currentFinishingPrice += currentCuts * finishingService.price;
            }
        }
        
        let knifeStartPrice = 0;
        if (customFinishing === 'cutting' && knifeStart) {
            const knifeStartService = finishingServices.other.find(s => s.id === 'startovanje-noza');
            if (knifeStartService) {
                knifeStartPrice = knifeStartService.price;
            }
        }

        let laminationPrice = 0;
        if (lamination !== 'none') {
            const laminationService = finishingServices.lamination.roll.find(s => s.id === (lamination === 'obostrana' ? 'roll-32' : 'roll-33'));
            if (laminationService) {
                const price = customSheetFormat === 'A4' ? laminationService.priceA4 : laminationService.priceA3;
                laminationPrice = price * quantity;
            }
        }
        
        let roundingPrice = 0;
        if (cornerRounding && items > 0) {
            const roundingService = finishingServices.other.find(s => s.id === 'coskanje');
            if (roundingService) {
                roundingPrice = roundingService.price * items; // Price is per item, applied only once for all sheets
            }
        }

        const finalFinishingPrice = currentFinishingPrice > 0 ? (currentFinishingPrice * quantity) : 0;
        setFinishingPrice(finalFinishingPrice);
        
        const totalPrintPriceForSheets = totalSheetPrintPrice * quantity;
        const finalTotalPrice = totalPrintPriceForSheets + finalFinishingPrice + laminationPrice + roundingPrice + knifeStartPrice;

        if(items > 0) {
            setTotalPrice(finalTotalPrice);
            setUnitPrice(finalTotalPrice / (items * quantity));
        } else {
            setTotalPrice(0);
            setUnitPrice(0);
        }

    } else {
        setItemsPerSheet(0);
        setCuts(0);
        setFinishingPrice(0);
        const priceTiers: PriceTier[] = activePrintOption[side];
        const tier = priceTiers.find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max) || priceTiers[priceTiers.length - 1];
        setSifra(tier?.sifra);
        
        let currentUnitPrice = tier.cena;
        
        let paperPricePerCopy = 0;
        if (selectedPaper.price > 0) {
            if (selectedPaper.format === 'SRA3') {
                let copiesPerSheet = 1;
                if (format === 'SRA3_482x330' || format === 'SRA3_450x320') copiesPerSheet = 1;
                else if (format === 'A3') copiesPerSheet = 1; // approx
                else if (format === 'A4') copiesPerSheet = 2;
                paperPricePerCopy = selectedPaper.price / copiesPerSheet;
            } else { // Assuming price is per A4 if format is not SRA3
                 paperPricePerCopy = selectedPaper.price;
                 if (format === 'A3') {
                     paperPricePerCopy = selectedPaper.price * 2;
                 }
            }
        }
        
        const finalUnitPrice = currentUnitPrice + paperPricePerCopy;
        setUnitPrice(finalUnitPrice);
        setTotalPrice(finalUnitPrice * quantity);
    }

  }, [quantity, format, color, side, paperId, activePrintOption, selectedPaper, customWidth, customHeight, customSheetFormat, customFinishing, lamination, cornerRounding, knifeStart]);
  

  const handleAddToBasket = () => {
    if (!activePrintOption || !selectedPaper || quantity <= 0 || totalPrice <= 0) return;
    
    const uniqueId = Date.now();
    const itemsToAdd: Omit<OrderItem, 'id'>[] = [];

    if (format === 'custom') {
        if (itemsPerSheet <= 0) return;
        const sheetDimLabel = customSheetFormat.replace('_', ' (').replace('x', 'x') + 'mm)';
        
        const priceTiers: PriceTier[] = activePrintOption[side];
        const tier = priceTiers.find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max) || priceTiers[priceTiers.length - 1];
        
        // --- 1. Print Item ---
        const printPricePerSheet = tier.cena;
        itemsToAdd.push({
          serviceId: `stampa-custom-print-${uniqueId}`,
          naziv: `Štampa ${color === 'cb' ? 'C/B' : 'Kolor'} ${side === 'oneSided' ? '1/0' : '4/4'}`,
          opis: `Proizvoljni format ${customWidth}x${customHeight}mm na ${sheetDimLabel}`,
          kolicina: quantity,
          cena_jedinice: printPricePerSheet, 
          cena_ukupno: printPricePerSheet * quantity,
          sifra: sifra,
        });

        // --- 2. Paper Item ---
        if (selectedPaper.price > 0 && selectedPaper.sifra) {
            let paperPricePerSheet = 0;
             if (selectedPaper.format === 'SRA3') {
                let copiesPerSheet = (customSheetFormat === 'A4') ? 2 : 1;
                paperPricePerSheet = selectedPaper.price / copiesPerSheet;
            } else {
                 paperPricePerSheet = selectedPaper.price * (customSheetFormat === 'A4' ? 1 : 2);
            }

            itemsToAdd.push({
                serviceId: `stampa-custom-paper-${uniqueId}`,
                naziv: `Papir: ${selectedPaper.name}`,
                opis: `Format tabaka: ${sheetDimLabel}`,
                kolicina: quantity,
                cena_jedinice: paperPricePerSheet,
                cena_ukupno: paperPricePerSheet * quantity,
                sifra: selectedPaper.sifra
            });
        }
        
        // --- 3. Finishing Item (Cutting/Scoring) ---
        if (customFinishing !== 'none') {
            const isCutting = customFinishing === 'cutting';
            const finishingService = finishingServices.other.find(s => s.id === (isCutting ? 'secenje-a4-a3' : 'ricovanje'));
            if (finishingService) {
                const finishingTotalPrice = finishingService.price * cuts * quantity;
                itemsToAdd.push({
                    serviceId: `stampa-custom-finishing-${uniqueId}`,
                    naziv: isCutting ? 'Sečenje' : 'Ricovanje',
                    opis: `Broj operacija: ${cuts} po tabaku`,
                    kolicina: quantity,
                    cena_jedinice: finishingService.price * cuts,
                    cena_ukupno: finishingTotalPrice,
                    sifra: finishingService.sifra
                });
            }
             // --- 3a. Knife Start Item ---
            if(isCutting && knifeStart) {
                const knifeStartService = finishingServices.other.find(s => s.id === 'startovanje-noza');
                if (knifeStartService) {
                    itemsToAdd.push({
                        serviceId: `stampa-custom-knifestart-${uniqueId}`,
                        naziv: 'Startovanje noža',
                        opis: `Jednokratni trošak`,
                        kolicina: 1,
                        cena_jedinice: knifeStartService.price,
                        cena_ukupno: knifeStartService.price,
                        sifra: knifeStartService.sifra
                    });
                }
            }
        }
        
        // --- 4. Lamination Item ---
        if (lamination !== 'none') {
            const laminationService = finishingServices.lamination.roll.find(s => s.id === (lamination === 'obostrana' ? 'roll-32' : 'roll-33'));
            if (laminationService) {
                const price = customSheetFormat === 'A4' ? laminationService.priceA4 : laminationService.priceA3;
                itemsToAdd.push({
                    serviceId: `stampa-custom-lamination-${uniqueId}`,
                    naziv: `Plastifikacija ${lamination === 'jednostrana' ? 'Jednostrana (Mat/Sjaj)' : 'Obostrana (Mat/Sjaj)'}`,
                    opis: `Za format tabaka: ${sheetDimLabel}`,
                    kolicina: quantity,
                    cena_jedinice: price,
                    cena_ukupno: price * quantity,
                    sifra: laminationService.sifra,
                });
            }
        }
        
        // --- 5. Corner Rounding Item ---
        if (cornerRounding) {
            const roundingService = finishingServices.other.find(s => s.id === 'coskanje');
            if (roundingService) {
                const roundingTotalPrice = roundingService.price * itemsPerSheet;
                 itemsToAdd.push({
                    serviceId: `stampa-custom-rounding-${uniqueId}`,
                    naziv: 'Ćoškanje',
                    opis: `Obračunato za sve komade: ${itemsPerSheet}`,
                    kolicina: 1,
                    cena_jedinice: roundingTotalPrice,
                    cena_ukupno: roundingTotalPrice,
                    sifra: roundingService.sifra,
                });
            }
        }

        onAddToBasket(itemsToAdd);

    } else {
        const displayFormat = format.replace('_', ' (').replace('x', 'x') + 'mm)';
        
        let baseFormatForName: 'A4' | 'A3' = 'A4';
        if (format === 'A3' || format === 'SRA3_482x330' || format === 'SRA3_450x320') {
            baseFormatForName = 'A3';
        }
        
        const naziv = printServices.options.find(opt => opt.format === baseFormatForName && opt.color === color)?.name.replace('A4', displayFormat).replace('A3', displayFormat) || "Štampa";

        const printOnlyPrice = (activePrintOption[side].find(t => quantity >= t.kolicina.min && quantity <= t.kolicina.max) || activePrintOption[side][activePrintOption[side].length -1]).cena;
        const paperPrice = unitPrice - printOnlyPrice;
        
        const items: Omit<OrderItem, 'id'>[] = [];

        // Add print item
        items.push({
            serviceId: `stampa-${format}-${color}-${side}-${paperId}-print-${uniqueId}`,
            naziv: naziv,
            opis: `${displayFormat}, ${color === 'cb' ? 'crno-belo' : 'kolor'}, ${side === 'oneSided' ? 'jednostrano' : 'obostrano'}`,
            kolicina: quantity,
            cena_jedinice: printOnlyPrice,
            cena_ukupno: printOnlyPrice * quantity,
            sifra: sifra,
        });

        // Add paper item if it has a price
        if (paperPrice > 0 && selectedPaper.sifra) {
             items.push({
                serviceId: `stampa-${format}-${color}-${side}-${paperId}-paper-${uniqueId}`,
                naziv: `Papir: ${selectedPaper.name}`,
                opis: `Format: ${displayFormat}`,
                kolicina: quantity,
                cena_jedinice: paperPrice,
                cena_ukupno: paperPrice * quantity,
                sifra: selectedPaper.sifra,
            });
        }
        onAddToBasket(items);
    }
  };

  const sheetDims = SHEET_DIMENSIONS[customSheetFormat];

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
                        <RadioGroupItem value="SRA3_450x320" id="format-sra3-450" />
                        <Label htmlFor="format-sra3-450">SRA3 450x320mm</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SRA3_482x330" id="format-sra3-482" />
                        <Label htmlFor="format-sra3-482">SRA3 482x330mm</Label>
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
                    <RadioGroup defaultValue="oneSided" value={side} onValueChange={(v) => setSide(v as 'oneSided'|'twoSided')} className="flex gap-4" disabled={isOneSidedOnlyPaper}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oneSided" id="side-one" />
                            <Label htmlFor="side-one">Jednostrano</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="twoSided" id="side-two" disabled={isOneSidedOnlyPaper}/>
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
                        Cena ovog papira se dodaje na cenu štampe.
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
                     <div className="space-y-2">
                        <Label htmlFor="custom-sheet-format">Osnovni format za obračun</Label>
                        <Select onValueChange={(v) => setCustomSheetFormat(v as any)} defaultValue={customSheetFormat}>
                            <SelectTrigger id="custom-sheet-format">
                                <SelectValue placeholder="Izaberite format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SRA3_482x330">SRA3 (482x330mm)</SelectItem>
                                <SelectItem value="SRA3_450x320">SRA3 (450x320mm)</SelectItem>
                                <SelectItem value="A3">A3 (420x297mm)</SelectItem>
                                <SelectItem value="A4">A4 (297x210mm)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="custom-finishing">Sečenje / Ricovanje</Label>
                        <Select onValueChange={(v) => setCustomFinishing(v as any)} defaultValue={customFinishing}>
                            <SelectTrigger id="custom-finishing">
                                <SelectValue placeholder="Izaberite doradu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ništa</SelectItem>
                                <SelectItem value="cutting">Sečenje</SelectItem>
                                <SelectItem value="scoring">Ricovanje</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {customFinishing === 'cutting' && (
                        <div className="flex items-center space-x-2 pl-2 animate-in fade-in duration-300">
                             <Checkbox id="knife-start" checked={knifeStart} onCheckedChange={(checked) => setKnifeStart(!!checked)} />
                             <Label htmlFor="knife-start">Startovanje noža (300 RSD)</Label>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="lamination">Plastifikacija</Label>
                        <Select onValueChange={(v) => setLamination(v as any)} defaultValue={lamination}>
                            <SelectTrigger id="lamination">
                                <SelectValue placeholder="Izaberite plastifikaciju" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Bez plastifikacije</SelectItem>
                                <SelectItem value="jednostrana">Jednostrana (Mat/Sjaj)</SelectItem>
                                <SelectItem value="obostrana">Obostrana (Mat/Sjaj)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="corner-rounding" checked={cornerRounding} onCheckedChange={(checked) => setCornerRounding(!!checked)} />
                        <Label htmlFor="corner-rounding">Ćoškanje</Label>
                    </div>
                </div>
                <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertTitle>Obračun po tabaku</AlertTitle>
                    <AlertDescription>
                        Na jedan {customSheetFormat.replace('_', ' (').replace('x','x') + 'mm)'} tabak staje: <span className="font-bold">{itemsPerSheet}</span> kom.
                        <br />
                        {customFinishing !== 'none' && (
                            <>
                            Broj operacija ({customFinishing === 'cutting' ? 'rezova' : 'ricova'}) po tabaku: <span className="font-bold">{cuts}</span>.
                            </>
                        )}
                        
                    </AlertDescription>
                </Alert>
            </div>
        </div>
      )}

      <Separator className="my-6" />

      {/* Quantity & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            {format === 'custom' ? 'Količina (broj tabaka)' : 'Količina (broj komada)'}
          </Label>
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
            {quantity > 0 && unitPrice > 0 && format !== 'custom' && (
                 <p className="text-xs text-muted-foreground font-mono">
                    ({unitPrice.toFixed(2)} RSD / kom)
                </p>
            )}
             {quantity > 0 && unitPrice > 0 && format === 'custom' && itemsPerSheet > 0 && (
                 <p className="text-xs text-muted-foreground font-mono">
                    ({(totalPrice / (itemsPerSheet*quantity)).toFixed(2)} RSD / kom)
                </p>
            )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end">
        <Button size="lg" onClick={handleAddToBasket} disabled={quantity <= 0 || !activePrintOption || totalPrice <= 0 || (format === 'custom' && itemsPerSheet <= 0)}>
          <PlusCircle className="mr-2"/>
          Dodaj u korpu
        </Button>
      </div>
    </div>
  );
}
