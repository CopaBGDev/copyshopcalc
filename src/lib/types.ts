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

export type OtherFinishingService = {
    id: string;
    name: string;
    price: number;
    price_over_50?: number;
    unit: string;
    sifra?: number;
}


export type FinishingServiceData = {
  binding: {
    plasticSpiral: BindingType;
    wireSpiral: BindingType;
  };
  hardcover: HardcoverBindingType;
  lamination: LaminationServiceData;
  other: OtherFinishingService[];
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

export type BusinessCardDoplate = {
    plastifikacija: {
        jednostrano: number;
        dvostrano: number;
    };
    coskanje: number;
    uv_doplata: string;
}

export type LuxPVCData = {
    kolicina: number;
    jednostrane: number;
    dvostrane: number;
    min_kom: number;
}

export type LuxPaperData = {
    kolicina: number;
    jednostrane: number;
    dvostrane: number;
}

export type BusinessCardData = {
    digital: {
        oneSided: BusinessCardPriceTier[];
        twoSided: BusinessCardPriceTier[];
    };
    lux: {
        pvc: {
            standard: LuxPVCData,
            special: LuxPVCData,
        },
        paper350g: LuxPaperData
    },
    doplate: BusinessCardDoplate;
}
// --- END: Business Card Service Specific Types ---

// --- START: Flyer Service Specific Types ---
export type FlyerPriceTier = {
    kolicina: number;
    cena: number;
}

export type FlyerData = {
    digitalA6: {
        oneSided: FlyerPriceTier[];
        twoSided: FlyerPriceTier[];
    };
    offsetA6: {
        oneSided: { kolicina: number; cena: number; };
        twoSided: { kolicina: number; cena: number; };
    };
    offsetA5: {
        oneSided: { kolicina: number; cena: number; };
        twoSided: { kolicina: number; cena: number; };
    };
}
// --- END: Flyer Service Specific Types ---


// --- START: Large Format Service Specific Types ---

export type PlottingService = {
  rollWidth: string;
  cb: number;
  lineColor: number;
  fullColor: number;
}

export type PlottingData = {
  paper80g: PlottingService[];
  finishing: { name: string; price: number; }[];
}

export type PosterService = {
  paper: string;
  price: number;
}

export type PosterData = {
  fixedFormat: {
    '50x70': PosterService[];
    '70x100': PosterService[];
  };
  byMeter: {
    rollWidth: string;
    paper: string;
    priceM2: number;
  }[];
}

export type BannerService = {
  name: string;
  tiers: { '1-5': number; '5-10': number; '10+': string; }
}

export type RollupService = {
  dimensions: string;
  price: number;
}

export type LargeFormatData = {
  plotting: PlottingData;
  posters: PosterData;
  banners: {
    services: BannerService[];
    addons: { name: string; price: number; unit: 'kom' | 'm' }[]
  };
  rollups: {
    setups: RollupService[],
    refill: { name: string, tiers: { '1-5': number; '5-10': number; '10+': string; } },
    changeService: { name: string, price: number, unit: string }
  }
}

// --- END: Large Format Service Specific Types ---

// --- START: Canvas Service Specific Types ---
export type CanvasReadyFormat = {
    id: string;
    dimension: string;
    price: number;
}

export type CanvasServiceData = {
    printByMeter: { name: string; roll: string; price: number; }[];
    blindFrameServices: { name: string; pricePerMeter: number; }[];
    readyFormats: CanvasReadyFormat[];
}
// --- END: Canvas Service Specific Types ---

// --- START: Gift Service Specific Types ---
export type GiftService = {
  id: string;
  name: string;
  price: number;
  sifra?: number;
}

export type GiftServiceData = {
  items: GiftService[];
}
// --- END: Gift Service Specific Types ---

// --- START: Office Supplies Types ---
export type MemorandumTier = {
    kolicina: number;
    cena: number;
}

export type EnvelopeTier = {
    type: 'ameriken' | 'c4';
    kolicina: number;
    cena: number;
}

export type BrochureService = {
    id: string;
    name: string;
    price: number;
    pricePerPage?: number;
    unit: 'po strani' | 'paket';
}

export type OfficeSuppliesData = {
    memorandums: MemorandumTier[];
    envelopes: EnvelopeTier[];
    brochures: BrochureService[];
}

// --- END: Office Supplies Types ---

// Generic service types can be defined below if needed for other categories
export type OtherService = {
    id: string;
    naziv: string;
    kategorija: string;
    cena: number;
}
