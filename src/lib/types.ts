export type Service = {
  id: string;
  naziv: string;
  kategorija: string;
  cena_jedinice: number;
  jedinica_mere: string;
  specifikacije: Record<string, string>;
  tip_kalkulacije: string;
};

export type OrderItem = {
  id: string; // Unique ID for the basket item instance
  serviceId: string;
  naziv: string;
  kolicina: number;
  cena_jedinice: number;
};
