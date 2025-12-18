

import type { AppCategory, PrintServiceData, FinishingServiceData, ScanServiceData, TextileServiceData, KeyService, BusinessCardData, LargeFormatData, FlyerData, CanvasServiceData, GiftServiceData, OfficeSuppliesData, DesignServiceData } from './types';
import { Printer, Scissors, ScanLine, Palette, Key, Shirt, Book, FileText, ShoppingBag, Ruler, Image as ImageIcon, Newspaper, Gift, Briefcase } from 'lucide-react';

export const appCategories: AppCategory[] = [
  {
    id: 'stampa',
    naziv: 'Štampa i kopiranje',
    icon: Printer,
    opis: 'A4/A3, C/B i kolor, razni papiri.',
    searchKeywords: "štampa, kopiranje, a4, a3, sra3, papir, kunzdruk, muflon, pvc folija, plastika, proizvoljno, custom, sečenje, ricovanje, ćoškanje, plastifikacija"
  },
  {
    id: 'vizitke',
    naziv: 'Vizit Karte',
    icon: FileText,
    opis: 'Standardne, lux, PVC, sa doradom.',
    searchKeywords: "vizitke, vizit karta, digitalna štampa, lux, pvc, plastifikacija, ćoškanje"
  },
  {
    id: 'flajeri',
    naziv: 'Flajeri',
    icon: Newspaper,
    opis: 'Digitalna i ofset štampa flajera.',
    searchKeywords: "flajer, flajeri, letak, liflet, a6, a5, digitalna štampa, ofset"
  },
   {
    id: 'kancelarijski',
    naziv: 'Kancelarijski Materijal',
    icon: Briefcase,
    opis: 'Memorandumi, koverte, brošure.',
    searchKeywords: "kancelarijski, memorandum, koverta, ameriken, c4, brošura, buklet, katalog, liflet"
  },
  {
    id: 'veliki_formati',
    naziv: 'Veliki Formati',
    icon: Ruler,
    opis: 'Plotovanje, posteri, baneri.',
    searchKeywords: "veliki format, plotovanje, poster, baner, cirada, roll-up, rolna, crtež"
  },
   {
    id: 'kanvas',
    naziv: 'Kanvas Platno',
    icon: ImageIcon,
    opis: 'Štampa i zatezanje na blind ram.',
    searchKeywords: "kanvas, platno, slika, blind ram"
  },
  {
    id: 'tekstil',
    naziv: 'Štampa na Tekstilu',
    icon: Shirt,
    opis: 'Majice, duksevi, cegeri.',
    searchKeywords: "tekstil, majica, duks, ceger, štampa na majicama, dtg, flex, flok"
  },
  {
    id: 'pokloni',
    naziv: 'Foto Pokloni',
    icon: Gift,
    opis: 'Šolje, puzzle, satovi, privesci...',
    searchKeywords: "poklon, foto pokloni, šolja, puzla, puzzle, sat, kugla, ram, maska za telefon"
  },
  {
    id: 'promo',
    naziv: 'Promo Materijal',
    icon: ShoppingBag,
    opis: 'Kese, olovke, upaljači, rokovnici...',
    searchKeywords: "promo, promotivni materijal, kese, olovke, upaljači, rokovnici, privesci"
  },
  {
    id: 'dorada',
    naziv: 'Dorada',
    icon: Scissors,
    opis: 'Koričenje, sečenje, plastifikacija...',
    searchKeywords: "dorada, koričenje, sečenje, plastifikacija, bigovanje, ricovanje, bušenje rupa, heftanje, tvrdi povez, ćoškanje"
  },
  {
    id: 'skeniranje',
    naziv: 'Skeniranje',
    icon: ScanLine,
    opis: 'Digitalizacija dokumenata i planova.',
    searchKeywords: "skeniranje, digitalizacija, dokument, plan, a4, a3"
  },
  {
    id: 'kljucevi',
    naziv: 'Narezivanje Ključeva',
    icon: Key,
    opis: 'Klasični, tačkasti, tagovi.',
    searchKeywords: "ključ, narezivanje ključeva, kopiranje ključa, tag, kasa ključ"
  },
  {
    id: 'dizajn',
    naziv: 'Usluge Dizajna',
    icon: Palette,
    opis: 'Grafička priprema, dizajn i prelom.',
    searchKeywords: "dizajn, usluge dizajna, priprema za štampu, logo, obrada fotografija, prelom, kucanje teksta"
  },
];

export const printServices: PrintServiceData = {
    papers: [
      { id: '80gr', name: 'Standardni 80gr papir', price: 0, sifra: 101 },
      { id: '115-300gr-kuns', name: 'Kunzdruk 115-300gr', price: 36.00, format: 'SRA3', sifra: 102 },
      { id: '120-300gr-papir', name: 'Papir 120-300gr', price: 41.00, format: 'SRA3', sifra: 103 },
      { id: 'pvc-bela', name: 'Plastika za laser štampu bela', price: 330.00, format: 'SRA3', sifra: 104 },
      { id: 'muflon', name: 'Muflon samolepljivi', price: 77.00, format: 'SRA3', sifra: 105 },
      { id: 'pvc-folija', name: 'Samolepljiva PVC folija bela/providna', price: 275.00, format: 'SRA3', sifra: 106 },
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
                {kolicina: {min: 1, max: 20}, cena: 38.80, sifra: 615}, // 19.9 * 2 - 1
                {kolicina: {min: 21, max: 100}, cena: 18.80, sifra: 614}, // 9.9 * 2 - 1
                {kolicina: {min: 101, max: 200}, cena: 14.40, sifra: 613}, // 7.7 * 2 - 1
                {kolicina: {min: 201, max: 1000}, cena: 12.00, sifra: 612}, // 6.5 * 2 - 1
                {kolicina: {min: 1001, max: Infinity}, cena: 8.80, sifra: 611} // 4.9 * 2 - 1
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
                {kolicina: {min: 1, max: 20}, cena: 49.00, sifra: 635}, // 25 * 2 - 1
                {kolicina: {min: 21, max: 100}, cena: 31.00, sifra: 634}, // 16 * 2 - 1
                {kolicina: {min: 101, max: 200}, cena: 26.00, sifra: 633}, // 13.5 * 2 - 1
                {kolicina: {min: 201, max: 1000}, cena: 20.00, sifra: 632}, // 10.5 * 2 - 1
                {kolicina: {min: 1001, max: Infinity}, cena: 18.00, sifra: 631} // 9.5 * 2 - 1
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
                {kolicina: {min: 1, max: 20}, cena: 90.00, sifra: 61},
                {kolicina: {min: 21, max: 100}, cena: 84.00, sifra: 63},
                {kolicina: {min: 101, max: 200}, cena: 62.00, sifra: 65},
                {kolicina: {min: 201, max: 1000}, cena: 51.00, sifra: 67},
                {kolicina: {min: 1001, max: Infinity}, cena: 47.00, sifra: 69}
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
                {kolicina: {min: 1, max: 20}, cena: 151.00, sifra: 81},
                {kolicina: {min: 21, max: 100}, cena: 140.00, sifra: 83},
                {kolicina: {min: 101, max: 200}, cena: 118.00, sifra: 85},
                {kolicina: {min: 201, max: 1000}, cena: 87.00, sifra: 87},
                {kolicina: {min: 1001, max: Infinity}, cena: 81.00, sifra: 89}
            ]
        }
    ]
};


export const finishingServices: FinishingServiceData = {
    binding: {
        plasticSpiral: {
            name: 'Plastična spirala A4',
            tiers: [
                { sheets: { min: 1, max: 80 }, diameter: '6, 8, 10, 12', priceSpiralOnly: 140.00, priceWithCovers: 180.00, sifra: 10 },
                { sheets: { min: 81, max: 150 }, diameter: '14, 16, 19', priceSpiralOnly: 160.00, priceWithCovers: 200.00, sifra: 11 },
                { sheets: { min: 151, max: 210 }, diameter: '22, 25', priceSpiralOnly: 180.00, priceWithCovers: 220.00, sifra: 12 },
                { sheets: { min: 211, max: 300 }, diameter: '28, 32, 45', priceSpiralOnly: 200.00, priceWithCovers: 250.00, sifra: 13 },
                { sheets: { min: 301, max: 450 }, diameter: '52', priceSpiralOnly: 250.00, priceWithCovers: 320.00, sifra: 14 }
            ]
        },
        wireSpiral: {
            name: 'Žičana spirala A4',
            tiers: [
                { sheets: { min: 1, max: 80 }, diameter: '6.9/8/9.5/11', priceSpiralOnly: 160.00, priceWithCovers: 200.00, sifra: 15 },
                { sheets: { min: 81, max: 150 }, diameter: '12.7/14.3/16/19', priceSpiralOnly: 200.00, priceWithCovers: 230.00, sifra: 16 },
                { sheets: { min: 151, max: 210 }, diameter: '22 / 25,4', priceSpiralOnly: 220.00, priceWithCovers: 280.00, sifra: 17 },
                { sheets: { min: 211, max: 300 }, diameter: '28.5 / 32', priceSpiralOnly: 270.00, priceWithCovers: 330.00, sifra: 18 }
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
            { id: 'id-60x95', name: 'ID plastifikacija 60x95 mm', price: 58.00, sifra: 28 },
            { id: 'id-75x105', name: 'ID plastifikacija 75x105 mm', price: 74.00, sifra: 29 },
            { id: 'a6', name: 'A6 plastifikacija 125mic', price: 80.00, sifra: 30 },
            { id: 'a5', name: 'A5 plastifikacija 125mic', price: 90.00, sifra: 31 },
        ],
        roll: [
            { id: 'roll-32', name: 'Plastifikacija iz rolne obostrana (mat/sjaj)', priceA4: 80.00, priceA3: 160.00, sifra: 32 },
            { id: 'roll-33', name: 'Plastifikacija iz rolne jednostrana (mat/sjaj)', priceA4: 40.00, priceA3: 80.00, sifra: 33 },
        ]
    },
    other: [
        { id: 'secenje-a4-a3', name: 'Sečenje A4-A3 formata', price: 7.00, unit: 'rez/list', sifra: 805 },
        { id: 'ricovanje', name: 'Ricovanje', price: 6.00, unit: 'ric', sifra: 806 },
        { id: 'coskanje', name: 'Ćoškanje', price: 3.60, unit: 'kom', sifra: 807 },
        { id: 'secenje-tabak', name: 'Sečenje više tabaka', price: 100.00, unit: 'rez', sifra: 802 },
        { id: 'bigovanje', name: 'Bigovanje', price: 250.00, price_over_50: 6.00, unit: 'big', sifra: 337 },
        { id: 'startovanje-noza', name: 'Startovanje noža', price: 300.00, unit: 'kom', sifra: 803 },
        { id: 'busenje-rupa', name: 'Bušenje rupa za registrator', price: 3.00, unit: 'list', sifra: 511 },
        { id: 'heftanje', name: 'Hefanje', price: 5.00, unit: 'mesto', sifra: 520 },
        { id: 'termo', name: 'Termo koričenje', price: 410.00, unit: 'kom', sifra: 700 },
        { id: 'raskoricavanje', name: 'Raskoričavanje spiralnog poveza', price: 90.00, unit: 'kom', sifra: 14 },
        { id: 'jemstvenik', name: 'Povezivanje projekata jemstvenikom', price: 300.00, unit: 'kom', sifra: 266 }
    ]
}

export const scanServices: ScanServiceData = {
    manual: [
        { kolicina: { min: 1, max: 10 }, priceA4: 41.00, priceA3: 73.00, sifra: 401 },
        { kolicina: { min: 11, max: 50 }, priceA4: 30.00, priceA3: 41.00, sifra: 402 },
        { kolicina: { min: 51, max: Infinity }, priceA4: 13.00, priceA3: 25.00, sifra: 403 },
    ],
    auto: [
        { kolicina: { min: 1, max: 50 }, priceA4: 13.00, priceA3: 25.00, sifra: 411 },
        { kolicina: { min: 51, max: 100 }, priceA4: 7.00, priceA3: 13.00, sifra: 412 },
        { kolicina: { min: 101, max: Infinity }, priceA4: 4.50, priceA3: 7.50, sifra: 413 },
    ]
};

export const textileServices: TextileServiceData = {
    directPrint: {
        kolicina: "1-5 kom",
        options: [
            { naziv: "Bela majica direktna štampa A4", cena: 1400.00, sifra: 317 },
            { naziv: "Bela majica direktna štampa A3", cena: 1700.00, sifra: 318 },
            { naziv: "Crna majica direktna štampa A4", cena: 1800.00, sifra: 319 },
            { naziv: "Crna majica direktna štampa A3", cena: 2200.00, sifra: 320 }
        ]
    },
    flexFoil: {
        kolicina: "1-5 kom",
        options: [
            { naziv: "Bela i crna majica sa flex folijom A4", cena: 1300.00, sifra: 321 },
            { naziv: "Bela i crna majica sa flex folijom A3", cena: 1800.00, sifra: 322 },
            { naziv: "Bela i crna majica sa flex folijom A4 srebrna i zlatna", cena: 1600.00, sifra: 323 },
            { naziv: "Bela i crna majica sa flex folijom A3 srebrna i zlatna", cena: 2100.00, sifra: 324 }
        ]
    },
    broughtIn: [
        { naziv: "Cena štampe A4 aplikacije na BELOJ majici DONETE", cena: 850.00, sifra: 325 },
        { naziv: "Cena štampe A3 aplikacije na BELOJ majici DONETE", cena: 1150.00, sifra: 327 },
        { naziv: "Cena štampe A4 aplikacije na CRNOJ majici DONETE", cena: 1150.00, sifra: 326 },
        { naziv: "Cena štampe A3 aplikacije na CRNOJ majici DONETE", cena: 1550.00, sifra: 328 },
        { naziv: "Flex folija A4 (za donete majice)", cena: 750.00, sifra: 330 },
        { naziv: "Flex folija A3 (za donete majice)", cena: 1250.00, sifra: 332 },
        { naziv: "Flex folija A4 srebrna i zlatna (za donete majice)", cena: 1050.00, sifra: 331 },
        { naziv: "Flex folija A3 srebrna i zlatna (za donete majice)", cena: 1550.00, sifra: 333 }
    ],
    ceger: [
        { id: 'ceger-dtg-a4', name: "Ceger sa direktnom štampom A4", price: 1350.00, sifra: 329 },
        { id: 'ceger-flex-a4', name: "Ceger sa flex folijom A4", price: 1250.00, sifra: 334 },
    ]
};

export const keyServices: KeyService[] = [
    { naziv: "Klasični ključevi", cena: 240.00, sifra: 370 },
    { naziv: "Klasični ključevi II", cena: 280.00, sifra: 371 },
    { naziv: "Tačkasti ključevi", cena: 800.00, sifra: 372 },
    { naziv: "Tačkasti ključevi II", cena: 900.00, sifra: 373 },
    { naziv: "Kasa ključevi", cena: 1050.00, sifra: 374 },
    { naziv: "Kasa ključevi sa dužim vratom", cena: 1200.00, sifra: 375 },
    { naziv: "Tagovi za otvaranje vrata", cena: 300.00, sifra: 390 },
    { naziv: "Tagovi za otvaranje vrata dečiji", cena: 350.00, sifra: 392 },
    { naziv: "Alkice za ključeve", cena: 17.00, sifra: 377 },
    { naziv: "Gumice u boji za ključeve", cena: 25.00, sifra: 378 },
    { naziv: "Plastični privezak", cena: 35.00, sifra: 559 },
    { naziv: "Kopiranje ključa (u kasi je cena 1 din)", cena: 130.00, sifra: 558 }
];

export const businessCardServices: BusinessCardData = {
    digital: {
        oneSided: [
            { kolicina: 50, cena: 750.00, sifra: 500 },
            { kolicina: 100, cena: 837.00, sifra: 501 },
            { kolicina: 200, cena: 1155.00, sifra: 503 },
            { kolicina: 300, cena: 1390.00, sifra: 504 },
            { kolicina: 500, cena: 2130.00, sifra: 509 },
            { kolicina: 1000, cena: 3690.00, sifra: 510 }
        ],
        twoSided: [
            { kolicina: 50, cena: 1090.00, sifra: 511 },
            { kolicina: 100, cena: 1198.00, sifra: 512 },
            { kolicina: 200, cena: 1750.00, sifra: 513 },
            { kolicina: 300, cena: 2080.00, sifra: 520 },
            { kolicina: 500, cena: 3070.00, sifra: 680 },
            { kolicina: 1000, cena: 5430.00, sifra: 681 }
        ]
    },
    lux: {
        pvc: {
            standard: { kolicina: 100, jednostrane: 6500.00, dvostrane: 8500.00, min_kom: 20, sifra_jednostrano: 900, sifra_dvostrano: 901 },
            special: { kolicina: 100, jednostrane: 13000.00, dvostrane: 16000.00, min_kom: 20, sifra_jednostrano: 902, sifra_dvostrano: 903 },
        },
        paper350g: {
             kolicina: 100, jednostrane: 4800.00, dvostrane: 5800.00, sifra_jednostrano: 904, sifra_dvostrano: 905
        }
    },
    doplate: {
        plastifikacija: {
            jednostrano: 60.00,
            dvostrano: 120.00,
            sifra: 33
        },
        coskanje: {
            cena: 3.60,
            sifra: 807
        },
        uv_doplata: "na upit",
    }
};

export const flyerServices: FlyerData = {
    digitalA6: {
        oneSided: [
            {kolicina: 100, cena: 1940.00, sifra: 720},
            {kolicina: 300, cena: 4180.00, sifra: 721},
            {kolicina: 500, cena: 5560.00, sifra: 722},
            {kolicina: 1000, cena: 8250.00, sifra: 723}
        ],
        twoSided: [
            {kolicina: 100, cena: 2350.00, sifra: 725},
            {kolicina: 300, cena: 4960.00, sifra: 726},
            {kolicina: 500, cena: 7100.00, sifra: 727},
            {kolicina: 1000, cena: 11400.00, sifra: 728}
        ]
    },
    offsetA6: {
        oneSided: { kolicina: 4000, cena: 9800.00, sifra: 730 },
        twoSided: { kolicina: 4000, cena: 10800.00, sifra: 731 },
    },
     offsetA5: {
        oneSided: { kolicina: 4000, cena: 12500.00, sifra: 732 },
        twoSided: { kolicina: 4000, cena: 13500.00, sifra: 733 },
    }
}


export const largeFormatServices: LargeFormatData = {
    plotting: {
        paper80g: [
            { rollWidth: "1060 mm", cb: 285.00, lineColor: 299.00, fullColor: 705.00, sifra: 200 },
            { rollWidth: "914 mm", cb: 265.00, lineColor: 280.00, fullColor: 605.00, sifra: 201 },
            { rollWidth: "750 mm", cb: 225.00, lineColor: 250.00, fullColor: 555.00, sifra: 202 },
            { rollWidth: "620 mm", cb: 215.00, lineColor: 230.00, fullColor: 505.00, sifra: 203 },
            { rollWidth: "420 mm", cb: 175.00, lineColor: 199.00, fullColor: 455.00, sifra: 204 },
            { rollWidth: "320 mm", cb: 155.00, lineColor: 180.00, fullColor: 405.00, sifra: 205 },
        ],
        finishing: [
            { name: "Sečenje po m1 dužnom", price: 30.00, sifra: 210 },
            { name: "Savijanje po m1 na A4", price: 30.00, sifra: 211 },
            { name: "Savijanje po m1 na A3", price: 85.00, sifra: 212 },
        ]
    },
    posters: {
        fixedFormat: {
            '50x70': [
                { paper: "120gr Foto mat", price: 590.00, sifra: 220 },
                { paper: "180gr Foto mat", price: 735.00, sifra: 221 },
                { paper: "180gr Foto GLOSSY", price: 945.00, sifra: 222 },
            ],
            '70x100': [
                { paper: "120gr Foto mat", price: 945.00, sifra: 223 },
                { paper: "180gr Foto mat", price: 1253.00, sifra: 224 },
                { paper: "180gr Foto Glossy", price: 1323.00, sifra: 225 },
            ]
        },
        byMeter: [
            { rollWidth: "610mm", paper: "120gr Foto mat (crno belo/linijski kolor)", priceM2: 630.00, sifra: 230 },
            { rollWidth: "610mm", paper: "120gr Foto mat (do 50% popunjenosti)", priceM2: 840.00, sifra: 231 },
            { rollWidth: "610mm", paper: "120gr Foto mat (preko 50% popunjenosti)", priceM2: 840.00, sifra: 232 },
            { rollWidth: "1060mm", paper: "120gr Foto mat (crno belo/linijski kolor)", priceM2: 890.00, sifra: 233 },
            { rollWidth: "1060mm", paper: "120gr Foto mat (do 50% popunjenosti)", priceM2: 1350.00, sifra: 234 },
            { rollWidth: "1060mm", paper: "120gr Foto mat (preko 50% popunjenosti)", priceM2: 1350.00, sifra: 235 },
            { rollWidth: "610mm", paper: "180gr Foto mat", priceM2: 1050.00, sifra: 236 },
            { rollWidth: "610mm", paper: "180gr Foto glossy /satin", priceM2: 1370.00, sifra: 237 },
            { rollWidth: "1060mm", paper: "180gr Foto mat", priceM2: 1790.00, sifra: 238 },
            { rollWidth: "1060mm", paper: "180gr Foto glossy /satin", priceM2: 1890.00, sifra: 239 },
        ]
    },
    banners: {
        services: [
            { name: "Cirada Baner", tiers: { '1-5': 2150.00, '5-10': 1815.00, '10+': "na upit" }, sifra: 250 },
        ],
        addons: [
            { name: "Ringlice za baner ciradu", price: 55.00, unit: 'kom', sifra: 251 },
            { name: "Porubljivanje baner cirade", price: 220.00, unit: 'm', sifra: 252 },
        ]
    },
    rollups: {
        setups: [
            { dimensions: "85x200cm", price: 8800.00, sifra: 260 },
            { dimensions: "100x200cm", price: 9990.00, sifra: 261 },
        ],
        refill: { name: "PP baner za roll up", tiers: { '1-5': 2530.00, '5-10': 2310.00, '10+': "na upit" }, sifra: 262 },
        changeService: { name: "Usluga zamena medija za roll up", price: 700.00, unit: "po m2", sifra: 263 },
    }
}

export const canvasServices: CanvasServiceData = {
    printByMeter: [
      { name: "Štampa na kanvasu po dužnom metru", roll: "60cm", price: 1990.00, sifra: 270 },
      { name: "Štampa na kanvasu po dužnom metru", roll: "100cm", price: 3600.00, sifra: 271 }
    ],
    blindFrameServices: [
      { name: "blind ram (materijal)", pricePerMeter: 650.00, sifra: 272 },
      { name: "zatezanje platna na blind ramu", pricePerMeter: 700.00, sifra: 273 }
    ],
    readyFormats: [
      { id: "30x40", dimension: "30x40 cm", price: 2350.00, sifra: 280 },
      { id: "40x40", dimension: "40x40 cm", price: 2480.00, sifra: 281 },
      { id: "40x50", dimension: "40x50 cm", price: 2660.00, sifra: 282 },
      { id: "40x60", dimension: "40x60 cm", price: 2850.00, sifra: 283 },
      { id: "60x60", dimension: "60x60 cm", price: 3470.00, sifra: 284 },
      { id: "50x85", dimension: "50x85 cm", price: 3920.00, sifra: 285 },
      { id: "30x80", dimension: "30x80 cm", price: 3570.00, sifra: 286 },
      { id: "60x80", dimension: "60x80 cm", price: 3990.00, sifra: 287 },
      { id: "80x80", dimension: "80x80 cm (85x85 cm)", price: 4720.00, sifra: 288 },
      { id: "50x70", dimension: "50x70 cm", price: 3500.00, sifra: 289 },
      { id: "80x100", dimension: "80x100 cm", price: 5500.00, sifra: 290 },
      { id: "100x100", dimension: "100x100 cm", price: 6200.00, sifra: 291 },
      { id: "90x100", dimension: "90x100 cm", price: 5900.00, sifra: 292 }
    ]
}

export const giftServices: GiftServiceData = {
  items: [
    { id: "solja-bela", name: "Foto šolja klasična bela", price: 850.00, sifra: 300 },
    { id: "puzzle-a4", name: "Foto puzzle A4", price: 1200.00, sifra: 301 },
    { id: "puzzle-srce", name: "Foto puzzle srce", price: 1100.00, sifra: 302 },
    { id: "sat", name: "Personalizovani sat (razni oblici)", price: 2900.00, sifra: 303 },
    { id: "foto-kugla", name: "Foto kugla ili srce", price: 1150.00, sifra: 304 },
    { id: "foto-ram", name: "Foto ram ili duplo srce", price: 1350.00, sifra: 305 },
    { id: "maska-telefon", name: "Maska za telefon sa štampom", price: 1500.00, sifra: 335 }
  ]
}

export const officeSuppliesData: OfficeSuppliesData = {
    memorandums: [
        { kolicina: 100, cena: 2200.00, sifra: 550 },
        { kolicina: 200, cena: 3300.00, sifra: 551 },
        { kolicina: 500, cena: 7100.00, sifra: 552 },
    ],
    envelopes: [
        { type: 'ameriken', kolicina: 50, cena: 2500.00, sifra: 560 },
        { type: 'ameriken', kolicina: 100, cena: 2600.00, sifra: 561 },
        { type: 'ameriken', kolicina: 200, cena: 4250.00, sifra: 562 },
        { type: 'ameriken', kolicina: 500, cena: 8350.00, sifra: 563 },
        { type: 'c4', kolicina: 50, cena: 1700.00, sifra: 570 },
        { type: 'c4', kolicina: 100, cena: 2900.00, sifra: 571 },
        { type: 'c4', kolicina: 200, cena: 3900.00, sifra: 572 },
        { type: 'c4', kolicina: 500, cena: 7900.00, sifra: 573 },
    ],
    brochures: [
        { id: 'buklet-a4', name: 'Brošura - buklet A4 (kolor)', price: 0, pricePerPage: 60.00, unit: 'po strani', sifra: 580 },
        { id: 'katalog-a5', name: 'Katalog - buklet A5 (kolor)', price: 0, pricePerPage: 32.00, unit: 'po strani', sifra: 581 },
        { id: 'liflet-a4-50', name: 'Liflet A4 (2 savijanja, 50 kom)', price: 4150.00, unit: 'paket', sifra: 582 },
        { id: 'liflet-a4-100', name: 'Liflet A4 (2 savijanja, 100 kom)', price: 5950.00, unit: 'paket', sifra: 583 },
        { id: 'liflet-a3-50', name: 'Liflet A3 (1 savijanje, 50 kom)', price: 5750.00, unit: 'paket', sifra: 584 },
    ]
}

export const designServices: DesignServiceData = [
    { id: "kreativni-dizajn", name: "Kreativni dizajn", price: 3600.00, unit: "sat", sifra: 1001 },
    { id: "priprema-stampa", name: "Priprema za štampu", price: 2400.00, unit: "sat", sifra: 1002 },
    { id: "montaze-korekcije", name: "Montaže i korekcije", price: 60.00, unit: "minut", sifra: 1003 },
    { id: "izrada-logoa", name: "Izrada logoa", price: 5000.00, unit: "komad", notes: "Cena od 5000 do 18000", sifra: 1004 },
    { id: "obrada-fotografija", name: "Obrada fotografija", price: 2400.00, unit: "sat", sifra: 1005 },
    { id: "kucanje-teksta", name: "Kucanje teksta", price: 1200.00, unit: "strana", sifra: 1006 }
];


  



    










