import type { AppCategory, PrintServiceData, FinishingServiceData, ScanServiceData } from './types';
import { Printer, Scissors, ScanLine, Palette, Key, Shirt, Book, FileText, ShoppingBag, Ruler, Image as ImageIcon } from 'lucide-react';

export const appCategories: AppCategory[] = [
  {
    id: 'stampa',
    naziv: 'Štampa i kopiranje',
    icon: Printer,
    opis: 'A4/A3, C/B i kolor, razni papiri.'
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
    opis: 'Štampa na majicama, duks.'
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

export const printServices: PrintServiceData = {
    papers: [
      { id: '80gr', name: 'Standardni 80gr papir', price: 0 },
      { id: '115-300gr-kuns', name: 'Kunzdruk 115-300gr', price: 36.00, format: 'SRA3' },
      { id: '120-300gr-papir', name: 'Papir 120-300gr', price: 41.00, format: 'SRA3' },
      { id: 'pvc-bela', name: 'Plastika za laser štampu bela', price: 330.00, format: 'SRA3' },
      { id: 'muflon', name: 'Muflon samolepljivi', price: 77.00, format: 'SRA3' },
      { id: 'pvc-folija', name: 'Samolepljiva PVC folija bela/providna', price: 275.00, format: 'SRA3' },
    ],
    options: [
        {
            format: 'A4',
            color: 'cb',
            name: 'Crno belo A4/80gr',
            oneSided: [
                {kolicina: {min: 1, max: 20}, cena: 19.90, sifra: 605},
                {kolicina: {min: 21, max: 100}, cena: 9.90, sifra: 604},
                {kolicina: {min: 101, max: 200}, cena: 7.70, sifra: 603},
                {kolicina: {min: 201, max: 1000}, cena: 6.50, sifra: 602},
                {kolicina: {min: 1001, max: Infinity}, cena: 4.90, sifra: 601}
            ],
            twoSided: [
                {kolicina: {min: 1, max: 20}, cena: 19.40, sifra: 615},
                {kolicina: {min: 21, max: 100}, cena: 9.40, sifra: 614},
                {kolicina: {min: 101, max: 200}, cena: 7.20, sifra: 613},
                {kolicina: {min: 201, max: 1000}, cena: 6.00, sifra: 612},
                {kolicina: {min: 1001, max: Infinity}, cena: 4.40, sifra: 611}
            ]
        },
        {
            format: 'A3',
            color: 'cb',
            name: 'Crno belo A3/80gr',
            oneSided: [
                {kolicina: {min: 1, max: 20}, cena: 25.00, sifra: 625},
                {kolicina: {min: 21, max: 100}, cena: 16.00, sifra: 624},
                {kolicina: {min: 101, max: 200}, cena: 13.50, sifra: 623},
                {kolicina: {min: 201, max: 1000}, cena: 10.50, sifra: 622},
                {kolicina: {min: 1001, max: Infinity}, cena: 9.50, sifra: 621}
            ],
            twoSided: [
                {kolicina: {min: 1, max: 20}, cena: 24.00, sifra: 635},
                {kolicina: {min: 21, max: 100}, cena: 15.00, sifra: 634},
                {kolicina: {min: 101, max: 200}, cena: 12.50, sifra: 633},
                {kolicina: {min: 201, max: 1000}, cena: 9.50, sifra: 632},
                {kolicina: {min: 1001, max: Infinity}, cena: 8.30, sifra: 631}
            ]
        },
        {
            format: 'A4',
            color: 'kolor',
            name: 'Kolor A4/80gr',
            oneSided: [
                {kolicina: {min: 1, max: 20}, cena: 46.00, sifra: 60},
                {kolicina: {min: 21, max: 100}, cena: 43.00, sifra: 62},
                {kolicina: {min: 101, max: 200}, cena: 36.50, sifra: 64},
                {kolicina: {min: 201, max: 1000}, cena: 29.50, sifra: 66},
                {kolicina: {min: 1001, max: Infinity}, cena: 26.50, sifra: 68}
            ],
            twoSided: [
                {kolicina: {min: 1, max: 20}, cena: 44.00, sifra: 61},
                {kolicina: {min: 21, max: 100}, cena: 41.00, sifra: 63},
                {kolicina: {min: 101, max: 200}, cena: 31.00, sifra: 65},
                {kolicina: {min: 201, max: 1000}, cena: 26.00, sifra: 67},
                {kolicina: {min: 1001, max: Infinity}, cena: 24.00, sifra: 69}
            ]
        },
        {
            format: 'A3',
            color: 'kolor',
            name: 'Kolor A3/80gr',
            oneSided: [
                {kolicina: {min: 1, max: 20}, cena: 83.00, sifra: 80},
                {kolicina: {min: 21, max: 100}, cena: 77.00, sifra: 82},
                {kolicina: {min: 101, max: 200}, cena: 71.00, sifra: 84},
                {kolicina: {min: 201, max: 1000}, cena: 51.50, sifra: 86},
                {kolicina: {min: 1001, max: Infinity}, cena: 46.00, sifra: 88}
            ],
            twoSided: [
                {kolicina: {min: 1, max: 20}, cena: 76.00, sifra: 81},
                {kolicina: {min: 21, max: 100}, cena: 70.50, sifra: 83},
                {kolicina: {min: 101, max: 200}, cena: 59.50, sifra: 85},
                {kolicina: {min: 201, max: 1000}, cena: 44.00, sifra: 87},
                {kolicina: {min: 1001, max: Infinity}, cena: 41.00, sifra: 89}
            ]
        }
    ]
};


export const finishingServices: FinishingServiceData = {
    binding: {
        plasticSpiral: {
            name: 'Plastična spirala A4',
            tiers: [
                { sheets: { min: 1, max: 80 }, diameter: '6, 8, 10, 12', priceSpiralOnly: 140.00, priceWithCovers: 180.00 },
                { sheets: { min: 81, max: 150 }, diameter: '14, 16, 19', priceSpiralOnly: 160.00, priceWithCovers: 200.00 },
                { sheets: { min: 151, max: 210 }, diameter: '22, 25', priceSpiralOnly: 180.00, priceWithCovers: 220.00 },
                { sheets: { min: 211, max: 300 }, diameter: '28, 32, 45', priceSpiralOnly: 200.00, priceWithCovers: 250.00 },
                { sheets: { min: 301, max: 450 }, diameter: '52', priceSpiralOnly: 250.00, priceWithCovers: 320.00 }
            ]
        },
        wireSpiral: {
            name: 'Žičana spirala A4',
            tiers: [
                { sheets: { min: 1, max: 80 }, diameter: '6.9/8/9.5/11', priceSpiralOnly: 160.00, priceWithCovers: 200.00 },
                { sheets: { min: 81, max: 150 }, diameter: '12.7/14.3/16/19', priceSpiralOnly: 200.00, priceWithCovers: 230.00 },
                { sheets: { min: 151, max: 210 }, diameter: '22 / 25,4', priceSpiralOnly: 220.00, priceWithCovers: 280.00 },
                { sheets: { min: 211, max: 300 }, diameter: '28.5 / 32', priceSpiralOnly: 270.00, priceWithCovers: 330.00 }
            ]
        }
    },
    hardcover: {
        name: 'Koričenje diplomskih radova - tvrdi povez',
        services: [
            { name: 'Tvrdi povez sa zlatotiskom (1-4 kom)', price: 1500.00, sifra: 21 },
            { name: 'Tvrdi povez sa zlatotiskom (5+ kom)', price: 1350.00, sifra: 23 },
            { name: 'Tvrdi povez (materijal koji nije štampan kod nas)', price: 1500.00, sifra: 25 },
            { name: 'Tvrdi povez sa UV štampom bela i CMYK', price: 1400.00, sifra: 26 }
        ]
    },
    lamination: {
        pocket: [
            { id: 'id-60x95', name: 'ID plastifikacija 60x95 mm', price: 58.00 },
            { id: 'id-75x105', name: 'ID plastifikacija 75x105 mm', price: 74.00 },
            { id: 'a6', name: 'A6 plastifikacija 125mic', price: 80.00 },
            { id: 'a5', name: 'A5 plastifikacija 125mic', price: 90.00 },
        ],
        roll: [
            { id: 'roll-32', name: 'Plastifikacija iz rolne (mat/sjaj)', priceA4: 40.00, priceA3: 300.00 },
        ]
    }
}

export const scanServices: ScanServiceData = {
    manual: [
        { kolicina: { min: 1, max: 10 }, priceA4: 41.00, priceA3: 73.00 },
        { kolicina: { min: 11, max: 50 }, priceA4: 30.00, priceA3: 41.00 },
        { kolicina: { min: 51, max: Infinity }, priceA4: 13.00, priceA3: 25.00 },
    ],
    auto: [
        { kolicina: { min: 1, max: 50 }, priceA4: 13.00, priceA3: 25.00 }, // Assuming auto scan for small quantities is same as manual 51+
        { kolicina: { min: 51, max: 100 }, priceA4: 7.00, priceA3: 13.00 },
        { kolicina: { min: 101, max: Infinity }, priceA4: 4.50, priceA3: 7.50 },
    ]
};
