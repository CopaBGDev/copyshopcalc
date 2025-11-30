import type { AppCategory } from './types';
import { Printer, Scissors, ScanLine, Palette, Key, Shirt, Book, FileText, ShoppingBag, Ruler, Image as ImageIcon } from 'lucide-react';

// Replacing mockServices with a more structured category list
// The actual service data will be handled differently later

export const appCategories: AppCategory[] = [
  {
    id: 'stampa',
    naziv: 'Štampa',
    icon: Printer,
    opis: 'Mali i veliki formati, C/B i kolor.'
  },
  {
    id: 'dorada',
    naziv: 'Dorada',
    icon: Scissors,
    opis: 'Koričenje, sečenje, plastifikacija...'
  },
  {
    id: 'skeniranje',
    naziv: 'Skeniranje',
    icon: ScanLine,
    opis: 'Digitalizacija dokumenata i planova.'
  },
   {
    id: 'tekstil',
    naziv: 'Tekstil',
    icon: Shirt,
    opis: 'Štampa na majicama, duks.',
  },
  {
    id: 'kljucevi',
    naziv: 'Ključevi',
    icon: Key,
    opis: 'Narezivanje klasičnih i tačkastih ključeva.'
  },
   {
    id: 'vizitke_flajeri',
    naziv: 'Vizitke i Flajeri',
    icon: FileText,
    opis: 'Dizajn i štampa vizit karti i flajera.'
  },
   {
    id: 'promo',
    naziv: 'Promo Materijal',
    icon: ShoppingBag,
    opis: 'Kese, olovke, upaljači, rokovnici...'
  },
    {
    id: 'kanvas',
    naziv: 'Kanvas Platno',
    icon: ImageIcon,
    opis: 'Štampa i zatezanje na blind ram.'
  },
  {
    id: 'veliki_formati',
    naziv: 'Veliki Formati',
    icon: Ruler,
    opis: 'Baneri, rollup, posteri, folije.'
  },
  {
    id: 'dizajn',
    naziv: 'Dizajn',
    icon: Palette,
    opis: 'Usluge grafičkog dizajna i pripreme.'
  },
];
