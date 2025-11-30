import type { Service } from './types';

export const mockServices: Service[] = [
  // --- PRINTANJE ---
  // A4
  { id: 'p1', naziv: 'Štampa A4, C/B, jednostrano', kategorija: 'Printanje', cena_jedinice: 5, jedinica_mere: 'strana', specifikacije: { format: 'A4', boja: 'C/B', strana: 'Jednostrano' }, tip_kalkulacije: 'po_strani' },
  { id: 'p2', naziv: 'Štampa A4, C/B, dvostrano', kategorija: 'Printanje', cena_jedinice: 8, jedinica_mere: 'strana', specifikacije: { format: 'A4', boja: 'C/B', strana: 'Dvostrano' }, tip_kalkulacije: 'po_strani' },
  { id: 'p3', naziv: 'Štampa A4, Kolor, jednostrano', kategorija: 'Printanje', cena_jedinice: 30, jedinica_mere: 'strana', specifikacije: { format: 'A4', boja: 'Kolor', strana: 'Jednostrano' }, tip_kalkulacije: 'po_strani' },
  { id: 'p4', naziv: 'Štampa A4, Kolor, dvostrano', kategorija: 'Printanje', cena_jedinice: 50, jedinica_mere: 'strana', specifikacije: { format: 'A4', boja: 'Kolor', strana: 'Dvostrano' }, tip_kalkulacije: 'po_strani' },
  // A3
  { id: 'p5', naziv: 'Štampa A3, C/B, jednostrano', kategorija: 'Printanje', cena_jedinice: 10, jedinica_mere: 'strana', specifikacije: { format: 'A3', boja: 'C/B', strana: 'Jednostrano' }, tip_kalkulacije: 'po_strani' },
  { id: 'p6', naziv: 'Štampa A3, C/B, dvostrano', kategorija: 'Printanje', cena_jedinice: 16, jedinica_mere: 'strana', specifikacije: { format: 'A3', boja: 'C/B', strana: 'Dvostrano' }, tip_kalkulacije: 'po_strani' },
  { id: 'p7', naziv: 'Štampa A3, Kolor, jednostrano', kategorija: 'Printanje', cena_jedinice: 60, jedinica_mere: 'strana', specifikacije: { format: 'A3', boja: 'Kolor', strana: 'Jednostrano' }, tip_kalkulacije: 'po_strani' },
  { id: 'p8', naziv: 'Štampa A3, Kolor, dvostrano', kategorija: 'Printanje', cena_jedinice: 100, jedinica_mere: 'strana', specifikacije: { format: 'A3', boja: 'Kolor', strana: 'Dvostrano' }, tip_kalkulacije: 'po_strani' },

  // --- SKENIRANJE ---
  { id: 's1', naziv: 'Skeniranje po strani', kategorija: 'Skeniranje', cena_jedinice: 10, jedinica_mere: 'strana', specifikacije: {}, tip_kalkulacije: 'po_strani' },

  // --- DORADA ---
  { id: 'd1', naziv: 'Plastifikacija A4', kategorija: 'Dorada', cena_jedinice: 100, jedinica_mere: 'komad', specifikacije: { usluga: 'Plastifikacija A4' }, tip_kalkulacije: 'po_komadu' },
  { id: 'd2', naziv: 'Plastifikacija A3', kategorija: 'Dorada', cena_jedinice: 200, jedinica_mere: 'komad', specifikacije: { usluga: 'Plastifikacija A3' }, tip_kalkulacije: 'po_komadu' },
  { id: 'd3', naziv: 'Koričenje spiralom', kategorija: 'Dorada', cena_jedinice: 150, jedinica_mere: 'komad', specifikacije: { usluga: 'Koričenje spiralom' }, tip_kalkulacije: 'po_komadu' },

  // --- DIZAJN ---
  { id: 'dz1', naziv: 'Grafički dizajn', kategorija: 'Dizajn', cena_jedinice: 1500, jedinica_mere: 'sat', specifikacije: {}, tip_kalkulacije: 'po_satu' },
];
