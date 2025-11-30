"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlusCircle } from "lucide-react";

type ServiceOptionsProps = {
  category: string;
  services: Service[];
  onAddToBasket: (service: Service, quantity: number) => void;
  onBack: () => void;
};

export function ServiceOptions({ category, services, onAddToBasket, onBack }: ServiceOptionsProps) {
  // Common state
  const [quantity, setQuantity] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  // Print-specific state
  const [format, setFormat] = useState<string>('');
  const [boja, setBoja] = useState<string>('');
  const [strana, setStrana] = useState<string>('');
  
  // Finishing-specific state
  const [doradaUsluga, setDoradaUsluga] = useState<string>('');

  const printOptions = useMemo(() => {
    const formats = [...new Set(services.map(s => s.specifikacije.format).filter(Boolean))];
    const colors = [...new Set(services.map(s => s.specifikacije.boja).filter(Boolean))];
    const sides = [...new Set(services.map(s => s.specifikacije.strana).filter(Boolean))];
    return { formats, colors, sides };
  }, [services]);

  const doradaOptions = useMemo(() => {
    return [...new Set(services.map(s => s.specifikacije.usluga).filter(Boolean))];
  }, [services]);

  useEffect(() => {
    if (category === 'Printanje') {
        const service = services.find(s => 
            s.specifikacije.format === format && 
            s.specifikacije.boja === boja && 
            s.specifikacije.strana === strana
        );
        setSelectedService(service || null);
    } else if (category === 'Dorada') {
        const service = services.find(s => s.specifikacije.usluga === doradaUsluga);
        setSelectedService(service || null);
    } else {
        // For simple categories like 'Skeniranje' or 'Dizajn'
        if (services.length > 0) {
            setSelectedService(services[0]);
        }
    }
  }, [format, boja, strana, doradaUsluga, category, services]);

  const handleAddClick = () => {
    if (selectedService && quantity > 0) {
      onAddToBasket(selectedService, quantity);
      setQuantity(1);
      // Reset options for next entry
      if (category === 'Printanje') {
        setFormat('');
        setBoja('');
        setStrana('');
      }
      if (category === 'Dorada') {
        setDoradaUsluga('');
      }
      quantityInputRef.current?.focus();
    }
  };

  const renderPrintOptions = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="format">Format</Label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger id="format"><SelectValue placeholder="Izaberite format" /></SelectTrigger>
          <SelectContent>{printOptions.formats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="boja">Boja</Label>
        <Select value={boja} onValueChange={setBoja}>
          <SelectTrigger id="boja"><SelectValue placeholder="Izaberite boju" /></SelectTrigger>
          <SelectContent>{printOptions.colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="strana">Strana</Label>
        <Select value={strana} onValueChange={setStrana}>
          <SelectTrigger id="strana"><SelectValue placeholder="Jedno/dvostrano" /></SelectTrigger>
          <SelectContent>{printOptions.sides.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
  
  const renderDoradaOptions = () => (
    <div className="space-y-2">
      <Label htmlFor="dorada-usluga">Usluga dorade</Label>
      <Select value={doradaUsluga} onValueChange={setDoradaUsluga}>
        <SelectTrigger id="dorada-usluga"><SelectValue placeholder="Izaberite uslugu" /></SelectTrigger>
        <SelectContent>{doradaOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );

  const renderOptions = () => {
    switch(category) {
        case 'Printanje': return renderPrintOptions();
        case 'Dorada': return renderDoradaOptions();
        default: return null;
    }
  }

  return (
    <div>
        <Button variant="ghost" onClick={onBack} className="mb-4 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sve kategorije
        </Button>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Unos stavke: {category}</h2>

      <div className="space-y-6">
        {renderOptions()}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
                <Label>Izabrana usluga</Label>
                <div className="flex items-center h-10 px-3 py-2 text-sm rounded-md border bg-muted min-h-[40px]">
                    {selectedService ? selectedService.naziv : <span className="text-muted-foreground">Izaberite opcije da biste videli uslugu</span>}
                </div>
            </div>
             <div className="space-y-2">
                <Label>Cena</Label>
                <div className="flex items-center h-10 px-3 py-2 text-sm rounded-md border bg-muted font-mono">
                    {selectedService ? `${selectedService.cena_jedinice.toFixed(2)} / ${selectedService.jedinica_mere}` : '-'}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="quantity">Količina</Label>
            <Input
              ref={quantityInputRef}
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              disabled={!selectedService}
              className="font-mono text-base"
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={handleAddClick} disabled={!selectedService || quantity <= 0} className="w-full" size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Dodaj u korpu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
