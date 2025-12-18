
"use client";

import type { OrderItem } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2, Printer } from "lucide-react";
import { Separator } from "../ui/separator";

type OrderConfirmationDialogProps = {
  isOpen: boolean;
  onClose: (shouldSubmit: boolean) => void;
  order: {
    items: OrderItem[];
    total: number;
  };
  isFinalizing: boolean;
};

export function OrderConfirmationDialog({ isOpen, onClose, order, isFinalizing }: OrderConfirmationDialogProps) {

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Specifikacija Porudžbine</title>');
      printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } .total { font-weight: bold; font-size: 1.2em; } </style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>Specifikacija Porudžbine</h1>');
      printWindow.document.write(`<p>Datum: ${new Date().toLocaleString('sr-RS')}</p>`);
      printWindow.document.write('<table>');
      printWindow.document.write('<thead><tr><th>Šifra</th><th>Naziv</th><th>Opis</th><th>Kol.</th><th>Cena/jed.</th><th>Ukupno</th></tr></thead>');
      printWindow.document.write('<tbody>');
      order.items.forEach(item => {
        printWindow.document.write(`<tr>
            <td>${item.sifra || '-'}</td>
            <td>${item.naziv}</td>
            <td>${item.opis}</td>
            <td>${item.kolicina}</td>
            <td>${item.cena_jedinice.toFixed(2)}</td>
            <td>${item.cena_ukupno.toFixed(2)}</td>
        </tr>`);
      });
      printWindow.document.write('</tbody></table>');
      printWindow.document.write(`<p class="total">UKUPNO: ${order.total.toFixed(2)} RSD</p>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Potvrda porudžbine</AlertDialogTitle>
          <AlertDialogDescription>
            Pregledajte stavke pre slanja porudžbine.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto my-4 pr-4">
            <div className="space-y-4">
                {order.items.map(item => (
                    <div key={item.id} className="grid grid-cols-5 gap-2 items-start text-sm">
                        <div className="col-span-2">
                             <p className="font-medium leading-tight">{item.naziv}</p>
                             <p className="text-xs text-muted-foreground">{item.opis}</p>
                             {item.sifra && <p className="text-xs font-mono text-muted-foreground/70 pt-1">Šifra: {item.sifra}</p>}
                        </div>
                        <div className="text-right">{item.kolicina} kom</div>
                        <div className="text-right">
                           {item.cena_jedinice.toFixed(2)}
                        </div>
                        <div className="text-right font-semibold">
                            {item.cena_ukupno.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            <Separator className="my-4"/>
            <div className="flex justify-end items-center gap-4">
                <span className="text-lg font-semibold">UKUPNO:</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-primary">
                    {order.total.toFixed(2)} <span className="text-lg font-semibold">RSD</span>
                </span>
            </div>
        </div>

        <AlertDialogFooter className="justify-between w-full">
            <div>
                 <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Štampaj
                </Button>
            </div>
            <div className="flex gap-2">
                 <AlertDialogCancel onClick={() => onClose(false)} disabled={isFinalizing}>
                    Otkaži
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => onClose(true)} disabled={isFinalizing}>
                    {isFinalizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isFinalizing ? 'Šaljem...' : 'Pošalji porudžbinu'}
                </AlertDialogAction>
            </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
