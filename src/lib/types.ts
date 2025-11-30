export type OrderItem = {
  id: string; // Unique ID for the basket item instance
  serviceId: string;
  naziv: string;
  opis: string; // Detailed description of options
  kolicina: number;
  cena_jedinice: number;
  cena_ukupno: number;
};

export type AppCategory = {
  id: string;
  naziv: string;
  icon: any; // Lucide icon component
  opis: string;
};

// --- START: Print Service Specific Types ---

export type PriceTier = {
  kolicina: { min: number; max: number };
  cena: number;
  sifra?: number;
};

export type PrintOption = {
  format: 'A4' | 'A3';
  color: 'cb' | 'kolor';
  name: string;
  oneSided: PriceTier[];
  twoSided: PriceTier[];
};

export type PaperType = {
  id: string;
  name: string;
  price: number;
  format?: 'SRA3'
};

export type PrintServiceData = {
  papers: PaperType[];
  options: PrintOption[];
};

// --- END: Print Service Specific Types ---

// --- START: Finishing Service Specific Types ---

export type BindingTier = {
  sheets: { min: number; max: number };
  diameter: string;
  priceSpiralOnly: number;
  priceWithCovers: number;
  sifra?: number;
};

export type BindingType = {
  name: string;
  tiers: BindingTier[];
}

export type HardcoverService = {
  name: string;
  price: number;
  sifra: number;
}

export type HardcoverBindingType = {
  name: string;
  services: HardcoverService[];
}

export type LaminationPocketService = {
  id: string;
  name: string;
  price: number;
  sifra?: number;
}

export type LaminationRollService = {
  id: string;
  name: string;
  priceA4: number;
  priceA3: number;
  sifra?: number;
}

export type LaminationServiceData = {
  pocket: LaminationPocketService[];
  roll: LaminationRollService[];
}


export type FinishingServiceData = {
  binding: {
    plasticSpiral: BindingType;
    wireSpiral: BindingType;
  };
  hardcover: HardcoverBindingType;
  lamination: LaminationServiceData;
}

// --- END: Finishing Service Specific Types ---

// --- START: Scanning Service Specific Types ---

export type ScanPriceTier = {
  kolicina: { min: number; max: number };
  priceA4: number;
  priceA3: number;
};

export type ScanServiceData = {
  manual: ScanPriceTier[];
  auto: ScanPriceTier[];
};

// --- END: Scanning Service Specific Types ---

// --- START: Textile Service Specific Types ---

export type TextilePrintOption = {
    naziv: string;
    cena: number;
    sifra: number;
};

export type TextileService = {
    kolicina: string;
    options: TextilePrintOption[];
};

export type BroughtInTextileService = {
    naziv: string;
    cena: number;
    sifra: number;
}

export type TextileServiceData = {
    directPrint: TextileService;
    flexFoil: TextileService;
    broughtIn: BroughtInTextileService[];
}

// --- END: Textile Service Specific Types ---

// --- START: Key Service Specific Types ---

export type KeyService = {
  naziv: string;
  cena: number;
  sifra: number;
}

// --- END: Key Service Specific Types ---

// --- START: Business Card Service Specific Types ---
export type BusinessCardPriceTier = {
    kolicina: number;
    cena: number;
    sifra: number;
}

export type BusinessCardData = {
    digital: {
        oneSided: BusinessCardPriceTier[];
        twoSided: BusinessCardPriceTier[];
    }
}
// --- END: Business Card Service Specific Types ---


// Generic service types can be defined below if needed for other categories
export type OtherService = {
    id: string;
    naziv: string;
    kategorija: string;
    cena: number;
}
