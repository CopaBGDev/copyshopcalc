export type PriceTier = {
  kolicina: string;
  cena: number;
};

export type PrintService = {
  id: string;
  naziv: string;
  kategorija: 'Štampa';
  podkategorija: 'Crno-belo' | 'Kolor';
  format: 'A4' | 'A3';
  cene_jednostrano: PriceTier[];
  cene_obostrano: PriceTier[];
};

export type FinishingService = {
  id: string;
  naziv: string;
  kategorija: 'Dorada';
  podkategorija: string;
  specifikacije: Record<string, any>;
  cena: number;
  jedinica_mere: 'komad' | 'm' | 'rez' | 'big';
};

export type OtherService = {
    id: string;
    naziv: string;
    kategorija: string;
    podkategorija?: string;
    cena: number;
    specifikacije?: Record<string, any>;
    jedinica_mere: string;
}

export type Service = PrintService | FinishingService | OtherService;

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
