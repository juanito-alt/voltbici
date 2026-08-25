import React, { useState, useMemo } from "react";
import {
  Bike, Battery, Gauge, Zap, Timer, Weight, ShieldCheck, ChevronRight,
  Menu, X, Star, Check, XCircle, ArrowRight, SlidersHorizontal, Plus,
  Trash2, Home, Tag, BookOpen, Scale, Info, MapPin, Mountain, Repeat,
  TrendingUp, Award, Quote
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend
} from "recharts";

/* ============================================================
   CONFIG — sostituisci con il tuo tag di affiliazione Amazon.it
   ============================================================ */
const AFFILIATE_TAG = "tuotag-21";
function buyLink(bike) {
  // Link di ricerca Amazon.it con tag affiliato: sostituisci con l'URL
  // diretto del prodotto (con lo stesso tag) non appena hai gli ASIN reali.
  return `https://www.amazon.it/s?k=${encodeURIComponent(bike.name + " " + bike.brand)}&tag=${AFFILIATE_TAG}`;
}

/* ============================================================
   DATI PRODOTTO
   Specifiche aggregate da Amazon.it, siti ufficiali dei brand e
   recensioni di settore (blog/forum). Valori "~" sono stime dove
   il dato non era dichiarato in modo univoco dalla fonte: verificare
   sempre sulla scheda Amazon aggiornata prima della pubblicazione.
   ============================================================ */
const CATEGORY_LABELS = {
  citta: "Città",
  montagna: "Montagna",
  pieghevole: "Pieghevole",
  trekking: "Trekking",
};

const BIKES = [
  {
    id: "fiido-c11",
    name: "C11",
    brand: "Fiido",
    category: "citta",
    price: 799,
    oldPrice: 949,
    deal: true,
    featured: true,
    tagline: "L'ingresso più equilibrato nella e-bike da città",
    blueprint: 1,
    specs: {
      motore: "250 W (hub posteriore)",
      coppia: "55 Nm",
      batteria: "48V 10.4Ah · 499 Wh, removibile",
      autonomia: "~90 km dichiarati (60–70 km reali)",
      velocitaMax: "25 km/h",
      peso: "~22 kg",
      portata: "120 kg",
      ricarica: "~5–6 h",
      freni: "Disco idraulici",
      cambio: "Shimano 7 velocità",
      pneumatici: "700x40C",
      impermeabilita: "IP54",
    },
    radar: [
      { subject: "Autonomia", value: 7 },
      { subject: "Potenza", value: 6 },
      { subject: "Comfort", value: 7 },
      { subject: "Qualità/Prezzo", value: 8.5 },
      { subject: "Robustezza", value: 7 },
    ],
    pros: [
      "Prezzo tra i più bassi della categoria per una city bike ben rifinita",
      "Batteria integrata nel telaio, esteticamente pulita e rimovibile",
      "Cambio Shimano a 7 velocità e freni a disco idraulici anche in fascia entry",
    ],
    cons: [
      "L'autonomia reale è inferiore a quella dichiarata in condizioni miste",
      "Nessun sensore di coppia: la spinta è meno naturale rispetto a modelli superiori",
      "Sospensione solo anteriore, poco adatta a fondi molto sconnessi",
    ],
    idealFor: "Chi cerca la prima e-bike per il tragitto casa-lavoro in città, con un budget contenuto e senza rinunciare a freni e cambio di livello decente.",
    review: {
      rating: 4.3,
      count: 210,
      summary: "Gli utenti premiano soprattutto il rapporto qualità-prezzo e la facilità di montaggio: la bici arriva quasi pronta e la maggior parte la definisce comoda per i tragitti quotidiani. Le critiche più ricorrenti riguardano l'autonomia reale, inferiore alle attese in salita o con temperature basse, e l'assenza di ammortizzatore posteriore su fondi dissestati.",
    },
  },
  {
    id: "fiido-c11-pro",
    name: "C11 Pro",
    brand: "Fiido",
    category: "citta",
    price: 1099,
    oldPrice: null,
    deal: false,
    featured: true,
    tagline: "La C11 con sensore di coppia e più autonomia",
    blueprint: 2,
    specs: {
      motore: "250 W brushless, sensore di coppia Mivice S200",
      coppia: "~55 Nm",
      batteria: "48V 10.4Ah · 499,2 Wh (DMEGC/EVE), removibile",
      autonomia: "fino a 104 km dichiarati",
      velocitaMax: "25 km/h",
      peso: "24,5 kg (21,1 kg senza batteria)",
      portata: "120 kg",
      ricarica: "~5–6 h",
      freni: "Disco idraulici a doppio pistone",
      cambio: "Shimano 7 velocità",
      pneumatici: "700C, forcella ammortizzata 40 mm",
      impermeabilita: "IP54 (IP67 sul sensore di coppia)",
    },
    radar: [
      { subject: "Autonomia", value: 8 },
      { subject: "Potenza", value: 6.5 },
      { subject: "Comfort", value: 8 },
      { subject: "Qualità/Prezzo", value: 8 },
      { subject: "Robustezza", value: 8.5 },
    ],
    pros: [
      "Sensore di coppia: la pedalata assistita risulta molto più naturale della C11 base",
      "Autonomia dichiarata superiore (fino a 104 km) grazie alla batteria più capiente",
      "Freni idraulici a doppio pistone e forcella ammortizzata migliorano il comfort",
    ],
    cons: [
      "Prezzo sensibilmente più alto della C11 standard",
      "Peso in salita rispetto alle city bike più leggere della fascia premium",
      "Portapacchi e accessori spesso venduti a parte",
    ],
    idealFor: "Pendolari abituali che vogliono una guida più fluida e naturale e sono disposti a spendere qualcosa in più per componentistica superiore.",
    review: {
      rating: 4.6,
      count: 96,
      summary: "Chi arriva dalla C11 base nota subito la differenza data dal sensore di coppia, descritta come una spinta più graduale e prevedibile. La frenata idraulica viene indicata come affidabile anche sul bagnato. Alcuni segnalano che il prezzo la avvicina a modelli di fascia superiore, rendendo il confronto con la concorrenza più serrato.",
    },
  },
  {
    id: "engwe-engine-pro-2",
    name: "Engine Pro 2.0",
    brand: "Engwe",
    category: "pieghevole",
    price: 1199,
    oldPrice: 1399,
    deal: true,
    featured: true,
    tagline: "Fat bike pieghevole per città e sterrato",
    blueprint: 3,
    specs: {
      motore: "750 W nominali / 1200 W di picco (hub posteriore)",
      coppia: "75 Nm",
      batteria: "52V 16Ah · 832 Wh, removibile",
      autonomia: "fino a 110 km dichiarati",
      velocitaMax: "25 km/h (versione UE a pedalata assistita)",
      peso: "31,6 kg",
      portata: "150 kg",
      ricarica: "~6–7 h",
      freni: "Disco idraulici",
      cambio: "Shimano 8 velocità",
      pneumatici: "Fat 20x4.0\"",
      impermeabilita: "Resistente a pioggia e schizzi (tenuta IP non certificata dal produttore)",
    },
    radar: [
      { subject: "Autonomia", value: 9 },
      { subject: "Potenza", value: 9 },
      { subject: "Comfort", value: 7 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 8 },
    ],
    pros: [
      "Motore e coppia tra i più potenti della fascia, ottimo in salita e su sterrato",
      "Sospensione completa (forcella idraulica + ammortizzatore posteriore ad aria)",
      "Batteria molto capiente: tra le autonomie dichiarate più alte del comparativo",
    ],
    cons: [
      "Peso elevato (31,6 kg), poco pratico da trasportare a mano una volta piegata",
      "Ingombro da piegata comunque significativo per una \"pieghevole\"",
      "Prezzo tra i più alti del gruppo comparato",
    ],
    idealFor: "Chi vuole un'unica bici per città e uscite fuoristrada leggere, con potenza e autonomia da vendere e non è preoccupato dal peso.",
    review: {
      rating: 4.5,
      count: 340,
      summary: "Le recensioni concordano sulla spinta molto decisa in salita, resa possibile dagli alti Newton metro del motore, e su una sospensione completa che assorbe bene le buche. Il difetto più citato è il peso, che rende la piegatura poco comoda da portare a piedi o in scale; alcuni consigliano di verificare i limiti di circolazione locali data la potenza di picco elevata.",
    },
  },
  {
    id: "ado-a20f-plus",
    name: "A20F+",
    brand: "ADO",
    category: "pieghevole",
    price: 899,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "Fat bike pieghevole compatta e agile in città",
    blueprint: 4,
    specs: {
      motore: "250 W (versione UE)",
      coppia: "~45 Nm (stima)",
      batteria: "36V 10.4Ah · 374 Wh, litio 18650, removibile",
      autonomia: "fino a 80 km assistiti (~40 km in solo elettrico)",
      velocitaMax: "25 km/h (UE)",
      peso: "~25 kg",
      portata: "~120 kg",
      ricarica: "~6 h",
      freni: "Disco meccanici, doppio rotore 160 mm",
      cambio: "Monomarcia / 7 velocità a seconda della versione",
      pneumatici: "Fat 20x4.0\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 6.5 },
      { subject: "Potenza", value: 7 },
      { subject: "Comfort", value: 6 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Struttura pieghevole a 3 segmenti, più compatta di altre fat bike pieghevoli",
      "Prezzo competitivo rispetto ad altre fat bike con pneumatici da 4.0\"",
      "10 anni di garanzia sul telaio dichiarati dal produttore",
    ],
    cons: [
      "Freni meccanici e non idraulici, meno performanti sul bagnato",
      "Autonomia reale stimata dalle recensioni più vicina a 50-60 km che a 80",
      "Assenza di sospensione posteriore",
    ],
    idealFor: "Chi cerca una fat bike pieghevole economica per spostamenti brevi/medi in città, senza necessità di prestazioni estreme.",
    review: {
      rating: 4.1,
      count: 480,
      summary: "Molti recensori la descrivono come divertente da guidare grazie ai pneumatici larghi e stabile su fondi misti (sabbia, sterrato leggero, pavé). Le critiche più frequenti riguardano l'autonomia dichiarata, giudicata ottimistica, e la frenata meccanica, ritenuta meno pronta di un impianto idraulico.",
    },
  },
  {
    id: "eleglide-t1-step-thru",
    name: "T1 Step-Thru",
    brand: "Eleglide",
    category: "trekking",
    price: 799,
    oldPrice: 899,
    deal: true,
    featured: true,
    tagline: "Trekking a telaio basso per lunghe percorrenze",
    blueprint: 5,
    specs: {
      motore: "250 W brushless",
      coppia: "50 Nm",
      batteria: "36V 13Ah · ~468 Wh, removibile e nascosta",
      autonomia: "fino a 100 km dichiarati",
      velocitaMax: "25 km/h (sbloccabile a 32 km/h via app)",
      peso: "~24 kg (stima)",
      portata: "120 kg",
      ricarica: "~6–7 h",
      freni: "Disco (meccanici)",
      cambio: "Shimano 7 velocità",
      pneumatici: "27.5\" CST antiforatura",
      impermeabilita: "Resistente a pioggia leggera, non certificata IP",
    },
    radar: [
      { subject: "Autonomia", value: 7.5 },
      { subject: "Potenza", value: 5.5 },
      { subject: "Comfort", value: 7.5 },
      { subject: "Qualità/Prezzo", value: 8.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Telaio a passo basso: facile salire e scendere, comodo per uso misto città/trekking",
      "Batteria nascosta nel telaio con chiave di sicurezza dedicata",
      "App dedicata per bloccare la bici e personalizzare l'assistenza",
    ],
    cons: [
      "Freni a disco meccanici, non idraulici",
      "Potenza motore nella media, poco brillante su salite ripide",
      "Peso e ingombro poco adatti al trasporto a mano",
    ],
    idealFor: "Chi percorre lunghe distanze miste su asfalto e sterrato leggero e apprezza una posizione di guida comoda ed eretta.",
    review: {
      rating: 4.4,
      count: 175,
      summary: "Le recensioni la indicano come una scelta solida per pendolari e cicloamatori, apprezzando in particolare l'autonomia elevata e la posizione di guida comoda del telaio step-thru. Alcuni utenti richiedono un sensore di coppia più reattivo e segnalano che i freni meccanici andrebbero regolati periodicamente.",
    },
  },
  {
    id: "eleglide-m1-plus",
    name: "M1 Plus",
    brand: "Eleglide",
    category: "montagna",
    price: 849,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "MTB elettrica accessibile per sterrato e collina",
    blueprint: 6,
    specs: {
      motore: "250 W brushless, 500 W di picco",
      coppia: "45 Nm",
      batteria: "36V 12.5Ah · 450 Wh, removibile",
      autonomia: "fino a 100 km dichiarati (55–60 km reali con uso intenso)",
      velocitaMax: "25 km/h",
      peso: "~24 kg (stima)",
      portata: "100 kg",
      ricarica: "~7 h",
      freni: "Disco anteriore e posteriore",
      cambio: "Shimano 21 velocità",
      pneumatici: "27.5\" / 29\" CST",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 7 },
      { subject: "Potenza", value: 6 },
      { subject: "Comfort", value: 6.5 },
      { subject: "Qualità/Prezzo", value: 8 },
      { subject: "Robustezza", value: 7 },
    ],
    pros: [
      "Cambio Shimano a 21 velocità, raro a questo prezzo",
      "Forcella idraulica con blocco per alternare asfalto e sterrato",
      "Modalità \"Walk\" per spingere la bici in salite molto ripide",
    ],
    cons: [
      "Nessun ammortizzatore posteriore: vibrazioni percepite su fondi irregolari",
      "Autonomia reale nei test più vicina ai 55-60 km che ai 100 dichiarati",
      "Assenza di acceleratore di serie (solo pedalata assistita, come da normativa)",
    ],
    idealFor: "Chi vuole avvicinarsi alla mountain bike elettrica con un budget contenuto, privilegiando percorsi collinari misti più che discese tecniche.",
    review: {
      rating: 4.3,
      count: 260,
      summary: "I recensori la considerano un ottimo compromesso qualità-prezzo per iniziare con le e-MTB, con un motore che sorprende in salita nonostante la potenza contenuta. La critica più diffusa riguarda l'assenza di sospensione posteriore, che si fa sentire su terreni sconnessi e in discesa.",
    },
  },
  {
    id: "eleglide-citycrosser",
    name: "CityCrosser",
    brand: "Eleglide",
    category: "citta",
    price: 749,
    oldPrice: 899,
    deal: true,
    featured: false,
    tagline: "Sensore di coppia al prezzo più aggressivo del segmento",
    blueprint: 7,
    specs: {
      motore: "250 W brushless (400 W di picco)",
      coppia: "45 Nm",
      batteria: "36V 10Ah · 360 Wh, removibile",
      autonomia: "fino a 75 km dichiarati (50–55 km reali con assistenza massima)",
      velocitaMax: "25 km/h (sbloccabile a ~35 km/h)",
      peso: "22 kg",
      portata: "120 kg",
      ricarica: "~6–7 h",
      freni: "Disco meccanici (doppio)",
      cambio: "Shimano 7 velocità",
      pneumatici: "700x38C CST antiforatura",
      impermeabilita: "IPX4",
    },
    radar: [
      { subject: "Autonomia", value: 6.5 },
      { subject: "Potenza", value: 5.5 },
      { subject: "Comfort", value: 6.5 },
      { subject: "Qualità/Prezzo", value: 8.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Sensore di coppia raro in questa fascia di prezzo, per una spinta naturale",
      "Peso contenuto (22 kg) per una city bike completa di accessori",
      "Dotazione di serie completa: parafanghi, portapacchi, cavalletto, luci",
    ],
    cons: [
      "Freni a disco meccanici, non idraulici",
      "Ricarica piuttosto lenta (6–7 ore)",
      "Pneumatici stretti, meno adatti a fondi sconnessi",
    ],
    idealFor: "Chi cerca il miglior compromesso prezzo/dotazione per l'uso quotidiano in città, con pedalata assistita naturale grazie al sensore di coppia.",
    review: {
      rating: 4.4,
      count: 520,
      summary: "È tra i modelli più recensiti del comparativo: gli utenti la definiscono un ottimo affare grazie al sensore di coppia, raro sotto i 1.000 euro, e alla dotazione già completa di parafanghi e portapacchi. La critica ricorrente riguarda i tempi di ricarica lunghi e i freni meccanici, che alcuni consigliano di far registrare periodicamente.",
    },
  },
  {
    id: "schiano-e-moon",
    name: "E-Moon",
    brand: "F.lli Schiano",
    category: "citta",
    price: 649,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "City bike Made in Italy, essenziale e diretta",
    blueprint: 8,
    specs: {
      motore: "250 W anteriore ANANDA",
      coppia: "40 Nm",
      batteria: "36V 13Ah · 468 Wh, removibile",
      autonomia: "fino a 100 km dichiarati in modalità ECO",
      velocitaMax: "25 km/h",
      peso: "~24 kg (stima)",
      portata: "~120 kg",
      ricarica: "~6 h",
      freni: "V-Brake",
      cambio: "Shimano 7 velocità (revoshift)",
      pneumatici: "700C / 28\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 7 },
      { subject: "Potenza", value: 4.5 },
      { subject: "Comfort", value: 6 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Marchio italiano storico (dal 1923), assistenza e ricambi più facili da reperire in Italia",
      "Consegna pre-assemblata al 98%",
      "Autonomia dichiarata elevata in modalità ECO",
    ],
    cons: [
      "Freni V-Brake, meno potenti di un impianto a disco",
      "Motore anteriore, meno bilanciato di un hub posteriore su fondi scivolosi",
      "Coppia (40 Nm) nella fascia bassa del comparativo",
    ],
    idealFor: "Chi preferisce un marchio italiano storico e una city bike semplice, senza fronzoli, per un uso urbano regolare e pianeggiante.",
    review: {
      rating: 4.1,
      count: 610,
      summary: "Le recensioni più numerose del comparativo: gli acquirenti apprezzano il marchio italiano e il montaggio quasi completo all'arrivo. Diversi segnalano che i freni V-Brake andrebbero aggiornati a disco per un uso intensivo, e che il motore anteriore si fa sentire meno rispetto ai modelli con motore sul mozzo posteriore.",
    },
  },
  {
    id: "fiido-d11",
    name: "D11",
    brand: "Fiido",
    category: "pieghevole",
    price: 899,
    oldPrice: 999,
    deal: true,
    featured: true,
    tagline: "La pieghevole più leggera del comparativo",
    blueprint: 9,
    specs: {
      motore: "250 W (brushless)",
      coppia: "~40 Nm (stima)",
      batteria: "36V 11.6Ah · 417,6 Wh, removibile nel reggisella",
      autonomia: "fino a 86–100 km dichiarati (a seconda della versione)",
      velocitaMax: "25 km/h",
      peso: "18,5–19,5 kg",
      portata: "120 kg",
      ricarica: "~6–7 h",
      freni: "Disco idraulici",
      cambio: "Shimano 7 velocità",
      pneumatici: "20x1.75\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 7.5 },
      { subject: "Potenza", value: 5 },
      { subject: "Comfort", value: 6 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Tra le più leggere della categoria pieghevoli (18,5 kg), facile da sollevare e trasportare",
      "Piegatura in 5 secondi, tra le più rapide del comparativo",
      "Sensore di coppia e freni idraulici nelle versioni più recenti",
    ],
    cons: [
      "Ruote piccole da 20\", meno stabili su buche profonde",
      "Assenza di sospensioni: comfort inferiore su fondi dissestati",
      "Autonomia reale nei test inferiore a quella dichiarata (circa 70 km)",
    ],
    idealFor: "Chi deve portare la bici a mano (scale, mezzi pubblici, ufficio) e mette la leggerezza al primo posto rispetto alla potenza.",
    review: {
      rating: 4.4,
      count: 140,
      summary: "I recensori mettono in risalto soprattutto la leggerezza e la rapidità di piegatura, utile per chi la porta spesso su mezzi pubblici o scale. Alcuni segnalano un tubo del sellino non perfettamente rigido e un'autonomia reale più vicina ai 70 km che ai 100 dichiarati.",
    },
  },
  {
    id: "engwe-ep2-pro",
    name: "EP-2 Pro",
    brand: "Engwe",
    category: "pieghevole",
    price: 799,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "Fat bike pieghevole più compatta della Engine Pro",
    blueprint: 10,
    specs: {
      motore: "250 W (versione UE)",
      coppia: "55 Nm",
      batteria: "48V 13Ah · ~624 Wh, removibile",
      autonomia: "fino a 120 km dichiarati (50–60 km in solo elettrico)",
      velocitaMax: "25 km/h",
      peso: "~30 kg",
      portata: "150 kg",
      ricarica: "~6–7 h",
      freni: "Disco (meccanici o idraulici secondo la versione)",
      cambio: "Shimano 7 velocità",
      pneumatici: "Fat 20x4.0\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 8 },
      { subject: "Potenza", value: 7 },
      { subject: "Comfort", value: 6.5 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 7 },
    ],
    pros: [
      "Prezzo più accessibile della sorella maggiore Engine Pro 2.0, stessa filosofia fat pieghevole",
      "Autonomia dichiarata molto alta (fino a 120 km)",
      "Sospensione anteriore inclusa per assorbire le asperità",
    ],
    cons: [
      "Alcune versioni montano freni meccanici anziché idraulici: verificare la scheda prodotto",
      "Peso comunque elevato (~30 kg) per una pieghevole",
      "Coppia leggermente inferiore alla Engine Pro 2.0",
    ],
    idealFor: "Chi vuole l'esperienza fat bike pieghevole di Engwe con una spesa più contenuta rispetto al modello Pro 2.0.",
    review: {
      rating: 4.5,
      count: 290,
      summary: "Le recensioni la descrivono come solida e divertente su sabbia, neve e sterrato leggero, con un buon compromesso tra prezzo e autonomia dichiarata. Alcuni acquirenti raccomandano di controllare attentamente la versione in vendita, perché le specifiche di freni e batteria variano tra le revisioni del prodotto.",
    },
  },
  {
    id: "kukirin-v2",
    name: "V2",
    brand: "Kukirin",
    category: "pieghevole",
    price: 599,
    oldPrice: 699,
    deal: true,
    featured: false,
    tagline: "La pieghevole più economica e compatta del comparativo",
    blueprint: 11,
    specs: {
      motore: "250 W",
      coppia: "≥35 Nm",
      batteria: "36V 7.5Ah · 270 Wh, removibile",
      autonomia: "fino a 45 km dichiarati (~40 km assistiti nei test)",
      velocitaMax: "25 km/h",
      peso: "18,5–18,9 kg",
      portata: "120 kg",
      ricarica: "~5–6 h",
      freni: "Disco (anteriore e posteriore)",
      cambio: "Monomarcia",
      pneumatici: "20\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 5 },
      { subject: "Potenza", value: 4.5 },
      { subject: "Comfort", value: 5.5 },
      { subject: "Qualità/Prezzo", value: 8 },
      { subject: "Robustezza", value: 6 },
    ],
    pros: [
      "Il prezzo più basso di tutto il comparativo",
      "Telaio in lega di magnesio molto leggero (~18,5 kg)",
      "Ingombro da piegata tra i più compatti (80x50x40 cm circa)",
    ],
    cons: [
      "Autonomia dichiarata la più bassa del comparativo (45 km)",
      "Nessun cambio: un solo rapporto, poco versatile in salita",
      "Batteria più piccola (270 Wh) rispetto alla concorrenza diretta",
    ],
    idealFor: "Chi percorre tragitti brevi e pianeggianti e cerca la pieghevole più economica e leggera per l'ultimo miglio o il tragitto stazione-ufficio.",
    review: {
      rating: 4.0,
      count: 95,
      summary: "Gli utenti la scelgono soprattutto per il prezzo e la leggerezza, apprezzando quanto sia comoda da riporre in auto o in ufficio. Il limite più citato è l'autonomia, adeguata solo per tragitti brevi, e l'assenza di un cambio per affrontare le salite più impegnative.",
    },
  },
  {
    id: "schiano-e-sky",
    name: "E-Sky",
    brand: "F.lli Schiano",
    category: "pieghevole",
    price: 699,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "Pieghevole essenziale del marchio italiano Schiano",
    blueprint: 12,
    specs: {
      motore: "250 W posteriore ANANDA M129",
      coppia: "~40 Nm (stima)",
      batteria: "36V 7.8Ah · 280,8 Wh, integrata nel telaio",
      autonomia: "~50–60 km dichiarati (stima dalla capacità batteria)",
      velocitaMax: "25 km/h",
      peso: "~20 kg (stima)",
      portata: "~120 kg",
      ricarica: "~5 h",
      freni: "Disco meccanici",
      cambio: "Shimano Tourney TY21, 6 velocità",
      pneumatici: "20\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 5.5 },
      { subject: "Potenza", value: 5 },
      { subject: "Comfort", value: 5.5 },
      { subject: "Qualità/Prezzo", value: 7 },
      { subject: "Robustezza", value: 6 },
    ],
    pros: [
      "Marchio italiano con rete di assistenza nazionale",
      "Telaio a passo basso, pieghevole, adatto a tutte le stature",
      "Consegna pre-assemblata al 98%",
    ],
    cons: [
      "Batteria tra le più piccole del comparativo (280 Wh)",
      "Nessun sensore di coppia",
      "Dati di coppia e peso non sempre dichiarati in modo uniforme dal produttore",
    ],
    idealFor: "Chi cerca una pieghevole semplice ed economica di un marchio italiano, per tragitti urbani brevi.",
    review: {
      rating: 4.0,
      count: 60,
      summary: "Le recensioni la considerano adatta a un uso occasionale in città, apprezzando soprattutto la compattezza da piegata. Chi percorre tragitti più lunghi segnala che la batteria si esaurisce prima rispetto a modelli con capacità superiore.",
    },
  },
  {
    id: "eleglide-m2",
    name: "M2",
    brand: "Eleglide",
    category: "montagna",
    price: 999,
    oldPrice: 1099,
    deal: true,
    featured: true,
    tagline: "L'e-MTB con più coppia e autonomia del comparativo",
    blueprint: 13,
    specs: {
      motore: "250 W brushless (570 W di picco)",
      coppia: "55 Nm",
      batteria: "36V 15Ah · 540 Wh, removibile",
      autonomia: "fino a 125 km dichiarati (spesso oltre 100 km reali in pianura)",
      velocitaMax: "25 km/h",
      peso: "22 kg",
      portata: "120 kg",
      ricarica: "~7 h",
      freni: "Disco idraulici",
      cambio: "Shimano 24 velocità",
      pneumatici: "27.5\"/29\" x 2.4\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 9 },
      { subject: "Potenza", value: 7.5 },
      { subject: "Comfort", value: 7 },
      { subject: "Qualità/Prezzo", value: 8 },
      { subject: "Robustezza", value: 7.5 },
    ],
    pros: [
      "Autonomia reale tra le più alte del comparativo, spesso oltre i 100 km in pianura",
      "Freni a disco idraulici, rari a questo prezzo su una e-MTB",
      "Cambio Shimano a 24 velocità e forcella idraulica con blocco",
    ],
    cons: [
      "Nessun ammortizzatore posteriore, come la M1 Plus",
      "Peso e ingombro tipici da MTB, poco adatta al trasporto a mano",
      "Prezzo superiore alla sorella M1 Plus",
    ],
    idealFor: "Chi vuole un'e-MTB entry-level con più autonomia e coppia della M1 Plus, per uscite più lunghe in collina o montagna.",
    review: {
      rating: 4.5,
      count: 310,
      summary: "È il modello dell'intero comparativo con l'autonomia reale più elogiata dai recensori, che spesso superano i 100 km in pianura con livelli di assistenza bassi. I freni idraulici vengono segnalati come un netto salto di qualità rispetto a modelli concorrenti nella stessa fascia di prezzo.",
    },
  },
  {
    id: "schiano-braver",
    name: "Braver",
    brand: "F.lli Schiano",
    category: "montagna",
    price: 749,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "MTB elettrica italiana per iniziare senza spendere troppo",
    blueprint: 14,
    specs: {
      motore: "250 W posteriore ANANDA",
      coppia: "50 Nm",
      batteria: "36V 11.6Ah · 417,6 Wh, removibile",
      autonomia: "fino a 90 km dichiarati in modalità ECO",
      velocitaMax: "25 km/h",
      peso: "~24 kg (stima)",
      portata: "~120 kg",
      ricarica: "~6 h",
      freni: "Disco meccanici",
      cambio: "Shimano 24 velocità",
      pneumatici: "27.5\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 6.5 },
      { subject: "Potenza", value: 5.5 },
      { subject: "Comfort", value: 6 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Prezzo tra i più bassi per una e-MTB con cambio a 24 velocità",
      "Marchio italiano con assistenza e ricambi reperibili localmente",
      "Consegna pre-assemblata al 98%",
    ],
    cons: [
      "Freni meccanici, non idraulici",
      "Assistenza clienti segnalata come lenta da alcuni recensori",
      "Coppia (50 Nm) nella media, non tra le più alte del comparativo",
    ],
    idealFor: "Chi vuole avvicinarsi alla mountain bike elettrica con un marchio italiano e una spesa contenuta, per uscite occasionali su sterrato leggero.",
    review: {
      rating: 3.9,
      count: 220,
      summary: "Le recensioni sono nel complesso positive sul rapporto qualità-prezzo e sulla solidità dei componenti meccanici, ma alcuni utenti segnalano difficoltà nel contattare l'assistenza in caso di problemi con la parte elettrica, un punto su cui il produttore dovrebbe migliorare.",
    },
  },
  {
    id: "eleglide-c1-st",
    name: "C1 ST",
    brand: "Eleglide",
    category: "trekking",
    price: 999,
    oldPrice: 1099,
    deal: true,
    featured: true,
    tagline: "Motore centrale mid-drive e 150 km di autonomia dichiarata",
    blueprint: 15,
    specs: {
      motore: "250 W mid-drive Ananda M60",
      coppia: "70 Nm",
      batteria: "48V ~14.5Ah · 522 Wh, removibile",
      autonomia: "fino a 150 km dichiarati (35–50 miglia reali nei test indipendenti)",
      velocitaMax: "25 km/h",
      peso: "~24 kg (stima)",
      portata: "120 kg",
      ricarica: "~6–7 h",
      freni: "Disco idraulici",
      cambio: "Shimano 7 velocità",
      pneumatici: "27.5x2.25\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 8.5 },
      { subject: "Potenza", value: 7.5 },
      { subject: "Comfort", value: 8 },
      { subject: "Qualità/Prezzo", value: 7 },
      { subject: "Robustezza", value: 7.5 },
    ],
    pros: [
      "Motore centrale (mid-drive): pedalata più naturale e miglior bilanciamento del peso rispetto ai motori sul mozzo",
      "Coppia (70 Nm) tra le più alte del comparativo",
      "Freni e sospensione idraulici di serie",
    ],
    cons: [
      "Autonomia dichiarata (150 km) molto ottimistica: i test indipendenti indicano 55–85 km reali",
      "Prezzo tra i più alti della categoria trekking",
      "Peso superiore alla T1 Step-Thru",
    ],
    idealFor: "Chi percorre lunghe distanze e vuole la pedalata più naturale offerta da un motore centrale, accettando un prezzo più alto.",
    review: {
      rating: 4.2,
      count: 130,
      summary: "I recensori apprezzano soprattutto la sensazione di pedalata offerta dal motore centrale, definita più fluida rispetto ai modelli con motore sul mozzo. Diversi test indipendenti segnalano però che l'autonomia reale è sensibilmente inferiore ai 150 km dichiarati, più vicina a 60–85 km a seconda dello stile di guida.",
    },
  },
  {
    id: "schiano-e-ride",
    name: "E-Ride",
    brand: "F.lli Schiano",
    category: "trekking",
    price: 899,
    oldPrice: null,
    deal: false,
    featured: false,
    tagline: "Trekking italiana con cambio a 21 velocità",
    blueprint: 16,
    specs: {
      motore: "250 W posteriore ANANDA",
      coppia: "40 Nm",
      batteria: "36V 10.4Ah · 374,4 Wh, removibile",
      autonomia: "fino a 90 km dichiarati in modalità ECO",
      velocitaMax: "25 km/h",
      peso: "~22 kg",
      portata: "~120 kg",
      ricarica: "~6 h",
      freni: "V-Brake",
      cambio: "Shimano 21 velocità",
      pneumatici: "28\"",
      impermeabilita: "Non certificata dal produttore",
    },
    radar: [
      { subject: "Autonomia", value: 6.5 },
      { subject: "Potenza", value: 4.5 },
      { subject: "Comfort", value: 6.5 },
      { subject: "Qualità/Prezzo", value: 7.5 },
      { subject: "Robustezza", value: 6.5 },
    ],
    pros: [
      "Cambio Shimano a 21 velocità, ampio per un modello di questa fascia",
      "Peso contenuto (22 kg) grazie alla batteria removibile compatta",
      "Dotazione completa: luci, parafanghi, cestino, cavalletto",
    ],
    cons: [
      "Freni V-Brake anziché a disco",
      "Coppia (40 Nm) tra le più basse del comparativo",
      "Pneumatici stretti da 28\", meno adatti a sterrato",
    ],
    idealFor: "Chi cerca una trekking italiana equilibrata per tragitti quotidiani misti città-periferia, senza necessità di sterrato impegnativo.",
    review: {
      rating: 4.2,
      count: 85,
      summary: "Chi la usa per il pendolarismo quotidiano segnala un buon comfort di guida e apprezza la leggerezza rispetto ad altre trekking della stessa fascia. Alcuni consigliano di valutare l'aggiornamento a freni a disco per chi percorre spesso strade in discesa o bagnate.",
    },
  },
];

const GUIDES_EXTRA_PLACEHOLDER = null;

const GUIDES = [
  {
    id: "guida-citta-2026",
    title: "Migliore bici elettrica per la città 2026",
    excerpt: "Le e-bike da città che abbiamo confrontato per pendolarismo, autonomia reale e rapporto qualità-prezzo su Amazon.it.",
    bikeIds: ["fiido-c11", "fiido-c11-pro", "eleglide-t1-step-thru"],
    intro: "Per chi si sposta ogni giorno in città, la e-bike ideale deve bilanciare tre cose: autonomia sufficiente per l'intera settimana lavorativa senza ricaricare troppo spesso, un peso gestibile per portarla su e giù dalle scale o dai mezzi pubblici, e una spesa che si ammortizzi rispetto ad abbonamenti trasporti o carburante.",
    body: [
      "Tra i modelli confrontati, la Fiido C11 resta il punto di ingresso più equilibrato: prezzo contenuto, freni idraulici e cambio Shimano già presenti anche nella versione base, con un'autonomia reale sufficiente per la maggior parte dei tragitti urbani quotidiani.",
      "Chi percorre più chilometri al giorno o sale spesso su percorsi con dislivello troviamo che il sensore di coppia della Fiido C11 Pro faccia la differenza concreta nella naturalezza della spinta, giustificando il salto di prezzo per un uso quotidiano intenso.",
      "Per chi preferisce un telaio a passo basso, più comodo a chi scende e sale spesso dalla bici durante il tragitto (consegne, commissioni multiple), la Eleglide T1 Step-Thru offre un ottimo compromesso tra comfort di guida e autonomia dichiarata.",
    ],
  },
];

/* ============================================================
   UTILITY
   ============================================================ */
function getBike(id) {
  return BIKES.find((b) => b.id === id);
}
function formatPrice(n) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}
function discountPct(bike) {
  if (!bike.oldPrice) return null;
  return Math.round(100 - (bike.price / bike.oldPrice) * 100);
}

/* ============================================================
   STILE GLOBALE — design token "officina / scheda tecnica"
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .eb-root {
      --ink: #16140f;
      --panel: #201c15;
      --panel-2: #2a2419;
      --paper: #f4f1e8;
      --paper-dim: #e8e3d5;
      --accent: #c8ff3d;
      --accent-dim: #8fb82b;
      --signal: #ff6a3d;
      --steel: #a39c88;
      --steel-dark: #6b6455;
      --line: rgba(244,241,232,0.14);
      --line-dark: rgba(22,20,15,0.12);
      --good: #7fd28a;
      --bad: #e2695c;
      font-family: 'Inter', sans-serif;
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
    }
    .eb-root * { box-sizing: border-box; }
    .eb-display { font-family: 'Space Grotesk', sans-serif; }
    .eb-mono { font-family: 'JetBrains Mono', monospace; }

    .eb-dark { background: var(--ink); color: var(--paper); }
    .eb-panel { background: var(--panel); color: var(--paper); border: 1px solid var(--line); }

    .eb-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px;
      letter-spacing: 0.02em; padding: 13px 22px; border-radius: 3px; cursor: pointer;
      border: 1px solid transparent; transition: transform .12s ease, background .15s ease, border-color .15s ease;
      text-decoration: none;
    }
    .eb-btn:active { transform: scale(0.97); }
    .eb-btn-accent { background: var(--accent); color: var(--ink); }
    .eb-btn-accent:hover { background: #d7ff6b; }
    .eb-btn-dark { background: var(--ink); color: var(--paper); }
    .eb-btn-dark:hover { background: #2a2619; }
    .eb-btn-outline { background: transparent; border-color: var(--line-dark); color: var(--ink); }
    .eb-btn-outline:hover { border-color: var(--ink); }
    .eb-btn-outline-light { background: transparent; border-color: var(--line); color: var(--paper); }
    .eb-btn-outline-light:hover { border-color: var(--paper); }
    .eb-btn:disabled { opacity: .35; cursor: not-allowed; }

    .eb-tag {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.06em;
      text-transform: uppercase; padding: 4px 9px; border-radius: 2px; display: inline-block;
    }

    .eb-card {
      background: var(--paper); border: 1px solid var(--line-dark); border-radius: 4px;
      transition: border-color .15s ease, transform .15s ease;
    }
    .eb-card:hover { border-color: var(--steel-dark); }

    .eb-hairline { border-top: 1px solid var(--line-dark); }
    .eb-hairline-light { border-top: 1px solid var(--line); }

    .eb-blueprint {
      position: relative; overflow: hidden; background: var(--ink);
      background-image:
        linear-gradient(rgba(244,241,232,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,241,232,0.06) 1px, transparent 1px);
      background-size: 22px 22px;
    }

    .eb-navlink {
      font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px;
      letter-spacing: 0.02em; color: var(--ink); text-decoration: none; cursor: pointer;
      padding: 6px 2px; border-bottom: 2px solid transparent;
    }
    .eb-navlink:hover { border-bottom-color: var(--accent-dim); }

    .eb-spec-row { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; }
    .eb-spec-row + .eb-spec-row { border-top: 1px solid var(--line-dark); }

    .eb-scroll::-webkit-scrollbar { height: 6px; }
    .eb-scroll::-webkit-scrollbar-thumb { background: var(--steel-dark); border-radius: 3px; }

    @media (max-width: 640px) {
      .eb-hide-mobile { display: none !important; }
    }
  `}</style>
);

/* ============================================================
   BLUEPRINT — placeholder "galleria foto" in stile scheda tecnica
   (da sostituire con foto reali con licenza del prodotto)
   ============================================================ */
function Blueprint({ seed = 1, height = 320, label = "Vista laterale" }) {
  const hue = [
    "rotate(0deg)", "rotate(6deg) scale(1.05)", "rotate(-4deg)",
    "rotate(3deg) scale(1.08)", "rotate(-6deg)", "rotate(2deg) scale(1.03)",
  ][seed % 6];
  return (
    <div className="eb-blueprint" style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 12, left: 14, fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.08em", color: "var(--steel)", textTransform: "uppercase" }}>
        {label} · fig.{seed.toString().padStart(2, "0")}
      </div>
      <Bike size={Math.min(height * 0.42, 150)} color="var(--accent)" strokeWidth={1} style={{ opacity: 0.9, transform: hue }} />
      <div style={{ position: "absolute", bottom: 12, right: 14, fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--steel-dark)" }}>
        foto reale non disponibile
      </div>
    </div>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header({ go, view }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", v: "home" },
    { label: "Categorie", v: "categorie" },
    { label: "Comparatore", v: "comparatore" },
    { label: "Guide", v: "guide" },
    { label: "Offerte", v: "offerte" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--paper)", borderBottom: "1px solid var(--line-dark)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ background: "var(--ink)", padding: 7, borderRadius: 3 }}>
            <Zap size={16} color="var(--accent)" strokeWidth={2.5} />
          </div>
          <span className="eb-display" style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
            Volt<span style={{ color: "var(--accent-dim)" }}>Bici</span>
          </span>
        </div>
        <nav className="eb-hide-mobile" style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {links.map((l) => (
            <span key={l.v} className="eb-navlink" style={{ borderBottomColor: view === l.v ? "var(--accent-dim)" : "transparent" }} onClick={() => go(l.v)}>
              {l.label}
            </span>
          ))}
        </nav>
        <div className="eb-hide-mobile">
          <button className="eb-btn eb-btn-dark" onClick={() => go("comparatore")}>
            <Scale size={15} /> Confronta
          </button>
        </div>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer" }} className="eb-only-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid var(--line-dark)", padding: "10px 20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          {links.map((l) => (
            <span key={l.v} className="eb-navlink" onClick={() => { go(l.v); setOpen(false); }}>{l.label}</span>
          ))}
        </div>
      )}
      <style>{`
        .eb-only-mobile { display: none; }
        @media (max-width: 860px) {
          .eb-hide-mobile { display: none !important; }
          .eb-only-mobile { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ go }) {
  return (
    <footer className="eb-dark" style={{ marginTop: 80, padding: "56px 20px 28px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32 }} className="eb-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Zap size={16} color="var(--accent)" />
              <span className="eb-display" style={{ fontWeight: 700, fontSize: 17 }}>VoltBici</span>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--steel)", lineHeight: 1.6, maxWidth: 320 }}>
              Comparativa indipendente di bici elettriche vendute su Amazon.it. Schede tecniche, prove su strada aggregate dalla community e comparatore lato per lato.
            </p>
          </div>
          <div>
            <div className="eb-tag" style={{ color: "var(--steel)", background: "var(--panel)", marginBottom: 14 }}>Esplora</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
              <span style={{ cursor: "pointer" }} onClick={() => go("categorie")}>Tutte le categorie</span>
              <span style={{ cursor: "pointer" }} onClick={() => go("comparatore")}>Comparatore</span>
              <span style={{ cursor: "pointer" }} onClick={() => go("guide")}>Guide d'acquisto</span>
              <span style={{ cursor: "pointer" }} onClick={() => go("offerte")}>Offerte del giorno</span>
            </div>
          </div>
          <div>
            <div className="eb-tag" style={{ color: "var(--steel)", background: "var(--panel)", marginBottom: 14 }}>Categorie</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <span key={k} style={{ cursor: "pointer" }} onClick={() => go("categoria", k)}>{v}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="eb-tag" style={{ color: "var(--steel)", background: "var(--panel)", marginBottom: 14 }}>Legale</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
              <span style={{ cursor: "pointer" }} onClick={() => go("legale")}>Informativa affiliazione</span>
              <span style={{ cursor: "pointer" }} onClick={() => go("legale")}>Privacy &amp; cookie</span>
            </div>
          </div>
        </div>
        <div className="eb-hairline-light" style={{ marginTop: 40, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12, color: "var(--steel-dark)" }}>
          <span>© {new Date().getFullYear()} VoltBici — sito indipendente, non affiliato ai brand recensiti.</span>
          <span>In qualità di Affiliato Amazon, VoltBici riceve un compenso per gli acquisti idonei.</span>
        </div>
      </div>
      <style>{`@media (max-width: 760px){.eb-footer-grid{grid-template-columns:1fr 1fr !important;}}`}</style>
    </footer>
  );
}

/* ============================================================
   COMPONENTI RIUSABILI
   ============================================================ */
function StarRating({ value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={13} fill={i <= Math.round(value) ? "var(--accent-dim)" : "none"} color="var(--accent-dim)" />
        ))}
      </div>
      <span className="eb-mono" style={{ fontSize: 12.5, color: "var(--steel-dark)" }}>{value.toFixed(1)}</span>
    </div>
  );
}

function BikeCard({ bike, go, compareIds, toggleCompare }) {
  const pct = discountPct(bike);
  const inCompare = compareIds.includes(bike.id);
  return (
    <div className="eb-card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ cursor: "pointer" }} onClick={() => go("prodotto", bike.id)}>
        <Blueprint seed={bike.blueprint} height={190} label={bike.brand} />
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div className="eb-mono" style={{ fontSize: 11, color: "var(--steel-dark)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{bike.brand}</div>
            <div className="eb-display" style={{ fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={() => go("prodotto", bike.id)}>{bike.name}</div>
          </div>
          {pct && <span className="eb-tag" style={{ background: "var(--signal)", color: "#fff", whiteSpace: "nowrap" }}>-{pct}%</span>}
        </div>
        <p style={{ fontSize: 13.5, color: "var(--steel-dark)", lineHeight: 1.5, margin: 0 }}>{bike.tagline}</p>
        <StarRating value={bike.review.rating} />
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--steel-dark)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Battery size={13} /> {bike.specs.autonomia.match(/\d+/)?.[0]} km</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Gauge size={13} /> {bike.specs.motore.match(/\d+/)?.[0]} W</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Weight size={13} /> {bike.specs.peso.replace("~", "")}</span>
        </div>
        <div className="eb-hairline" style={{ marginTop: 4, paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            {bike.oldPrice && <div className="eb-mono" style={{ fontSize: 12, color: "var(--steel-dark)", textDecoration: "line-through" }}>{formatPrice(bike.oldPrice)}</div>}
            <div className="eb-display" style={{ fontWeight: 700, fontSize: 20 }}>{formatPrice(bike.price)}</div>
          </div>
          <button
            className="eb-btn"
            style={{ padding: "9px 12px", fontSize: 12, background: inCompare ? "var(--ink)" : "transparent", color: inCompare ? "var(--paper)" : "var(--ink)", border: "1px solid var(--line-dark)" }}
            onClick={() => toggleCompare(bike.id)}
          >
            {inCompare ? <Check size={14} /> : <Plus size={14} />} {inCompare ? "Aggiunta" : "Confronta"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, sub, dark }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div className="eb-tag" style={{ background: dark ? "var(--panel)" : "var(--paper-dim)", color: dark ? "var(--accent)" : "var(--steel-dark)", marginBottom: 12 }}>{eyebrow}</div>
      <h2 className="eb-display" style={{ fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
      {sub && <p style={{ marginTop: 10, fontSize: 15, color: "var(--steel-dark)", maxWidth: 620, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

/* ============================================================
   HOME
   ============================================================ */
function HomePage({ go, compareIds, toggleCompare }) {
  const featured = BIKES.filter((b) => b.featured);
  const deals = BIKES.filter((b) => b.deal);
  return (
    <div>
      {/* HERO */}
      <section className="eb-dark eb-blueprint" style={{ padding: "72px 20px 84px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }} className="eb-hero-grid">
          <div>
            <div className="eb-tag" style={{ background: "rgba(200,255,61,0.12)", color: "var(--accent)", marginBottom: 20 }}>
              Comparativa indipendente · Amazon.it
            </div>
            <h1 className="eb-display" style={{ fontSize: "clamp(34px,5.2vw,58px)", fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.02em", margin: 0 }}>
              Non un'altra lista.<br />Una <span style={{ color: "var(--accent)" }}>scheda tecnica</span><br />per ogni bici elettrica.
            </h1>
            <p style={{ marginTop: 22, fontSize: 16.5, color: "var(--steel)", maxWidth: 480, lineHeight: 1.65 }}>
              Autonomia reale, potenza, radar delle valutazioni e recensioni riassunte per ogni modello. Poi mettile a confronto fianco a fianco e scegli con i dati, non con il marketing.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <button className="eb-btn eb-btn-accent" onClick={() => go("comparatore")}>
                Apri il comparatore <ArrowRight size={15} />
              </button>
              <button className="eb-btn eb-btn-outline-light" onClick={() => go("categorie")}>
                Sfoglia le categorie
              </button>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
              {[["6", "modelli analizzati"], ["4", "categorie"], ["1500+", "recensioni riassunte"]].map(([n, l]) => (
                <div key={l}>
                  <div className="eb-display" style={{ fontSize: 26, fontWeight: 700, color: "var(--accent)" }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: "var(--steel)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="eb-hide-mobile">
            <MiniRadarShowcase />
          </div>
        </div>
      </section>

      {/* IN EVIDENZA */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <SectionHeading eyebrow="In evidenza" title="Le più consigliate del momento" sub="Selezionate per equilibrio tra autonomia, potenza e valutazioni delle recensioni." />
          <span className="eb-navlink" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 30 }} onClick={() => go("categorie")}>
            Vedi tutte <ChevronRight size={15} />
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="eb-grid-3">
          {featured.map((b) => <BikeCard key={b.id} bike={b} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />)}
        </div>
      </section>

      {/* CATEGORIE */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 20px 20px" }}>
        <SectionHeading eyebrow="Categorie" title="Trova la tua tipologia" sub="Ogni uso ha la sua bici: dal pendolarismo urbano al fuoristrada leggero." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }} className="eb-grid-4">
          {[
            { k: "citta", icon: MapPin, desc: "Pendolarismo, comfort, autonomia quotidiana" },
            { k: "montagna", icon: Mountain, desc: "Sterrato, dislivello, cambio ampio" },
            { k: "pieghevole", icon: Repeat, desc: "Compattezza, treno, ufficio, box auto" },
            { k: "trekking", icon: TrendingUp, desc: "Lunghe percorrenze, comfort, versatilità" },
          ].map(({ k, icon: Icon, desc }) => (
            <div key={k} className="eb-card" style={{ padding: 24, cursor: "pointer" }} onClick={() => go("categoria", k)}>
              <Icon size={22} color="var(--accent-dim)" />
              <div className="eb-display" style={{ fontWeight: 700, fontSize: 17, marginTop: 14 }}>{CATEGORY_LABELS[k]}</div>
              <div style={{ fontSize: 13, color: "var(--steel-dark)", marginTop: 6, lineHeight: 1.5 }}>{desc}</div>
              <div style={{ fontSize: 12, color: "var(--steel-dark)", marginTop: 12 }} className="eb-mono">
                {BIKES.filter((b) => b.category === k).length} modelli →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDA */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 20px 20px" }}>
        <div className="eb-panel eb-guide-cta" style={{ borderRadius: 6, padding: "44px 40px", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
          <div>
            <div className="eb-tag" style={{ background: "rgba(200,255,61,0.12)", color: "var(--accent)", marginBottom: 14 }}>Guida d'acquisto</div>
            <div className="eb-display" style={{ fontWeight: 700, fontSize: 24 }}>Migliore bici elettrica per la città 2026</div>
            <p style={{ fontSize: 14, color: "var(--steel)", marginTop: 10, maxWidth: 520, lineHeight: 1.6 }}>{GUIDES[0].excerpt}</p>
          </div>
          <button className="eb-btn eb-btn-accent" onClick={() => go("guida", GUIDES[0].id)}>
            Leggi la guida <BookOpen size={15} />
          </button>
        </div>
      </section>

      {/* OFFERTE */}
      {deals.length > 0 && (
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 20px 90px" }}>
          <SectionHeading eyebrow="Offerte" title="In sconto oggi" sub="Prezzi indicativi: verifica sempre il prezzo aggiornato sulla pagina Amazon." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="eb-grid-3">
            {deals.map((b) => <BikeCard key={b.id} bike={b} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />)}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          .eb-hero-grid { grid-template-columns: 1fr !important; }
          .eb-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .eb-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .eb-guide-cta { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 620px) {
          .eb-grid-3 { grid-template-columns: 1fr !important; }
          .eb-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function MiniRadarShowcase() {
  const data = BIKES[2].radar;
  return (
    <div className="eb-panel" style={{ borderRadius: 6, padding: "22px 10px 8px" }}>
      <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="eb-mono" style={{ fontSize: 11, color: "var(--steel)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Radar valutazioni · esempio</span>
        <span className="eb-mono" style={{ fontSize: 11, color: "var(--accent)" }}>{BIKES[2].brand} {BIKES[2].name}</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(244,241,232,0.15)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#c9c3b2", fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="#c8ff3d" fill="#c8ff3d" fillOpacity={0.35} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================
   PAGINA CATEGORIE (elenco) + CATEGORIA SINGOLA
   ============================================================ */
function CategoriesPage({ go, compareIds, toggleCompare }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 90px" }}>
      <SectionHeading eyebrow="Categorie" title="Tutte le categorie" sub="Scegli la tipologia più adatta al tuo utilizzo." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginBottom: 50 }} className="eb-grid-2">
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <div key={k} className="eb-card" style={{ padding: 26, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => go("categoria", k)}>
            <div>
              <div className="eb-display" style={{ fontWeight: 700, fontSize: 19 }}>{v}</div>
              <div className="eb-mono" style={{ fontSize: 12, color: "var(--steel-dark)", marginTop: 4 }}>{BIKES.filter((b) => b.category === k).length} modelli</div>
            </div>
            <ChevronRight size={20} color="var(--steel-dark)" />
          </div>
        ))}
      </div>
      <SectionHeading eyebrow="Catalogo" title="Tutti i modelli" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="eb-grid-3">
        {BIKES.map((b) => <BikeCard key={b.id} bike={b} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />)}
      </div>
      <style>{`
        @media (max-width: 900px){.eb-grid-3{grid-template-columns:1fr 1fr !important;}}
        @media (max-width: 620px){.eb-grid-3,.eb-grid-2{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

function CategoryPage({ category, go, compareIds, toggleCompare }) {
  const bikes = BIKES.filter((b) => b.category === category);
  const Icon = { citta: MapPin, montagna: Mountain, pieghevole: Repeat, trekking: TrendingUp }[category];
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Icon size={20} color="var(--accent-dim)" />
        <span className="eb-mono" style={{ fontSize: 12, color: "var(--steel-dark)", textTransform: "uppercase" }}>Categoria</span>
      </div>
      <SectionHeading title={`Bici elettriche ${CATEGORY_LABELS[category].toLowerCase() === "città" ? "da città" : CATEGORY_LABELS[category].toLowerCase() === "montagna" ? "da montagna (e-MTB)" : CATEGORY_LABELS[category].toLowerCase() === "pieghevole" ? "pieghevoli" : "da trekking"}`} eyebrow={`${bikes.length} modelli`} sub="Ogni scheda include specifiche complete, radar delle valutazioni e riassunto delle recensioni." />
      {bikes.length === 0 ? (
        <p style={{ color: "var(--steel-dark)" }}>Presto nuovi modelli in questa categoria.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="eb-grid-3">
          {bikes.map((b) => <BikeCard key={b.id} bike={b} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />)}
        </div>
      )}
      <style>{`
        @media (max-width: 900px){.eb-grid-3{grid-template-columns:1fr 1fr !important;}}
        @media (max-width: 620px){.eb-grid-3{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

/* ============================================================
   PAGINA PRODOTTO
   ============================================================ */
function SpecTable({ specs }) {
  const labels = {
    motore: "Motore", coppia: "Coppia", batteria: "Batteria", autonomia: "Autonomia",
    velocitaMax: "Velocità max", peso: "Peso", portata: "Portata max", ricarica: "Tempo di ricarica",
    freni: "Freni", cambio: "Cambio", pneumatici: "Pneumatici", impermeabilita: "Impermeabilità",
  };
  const icons = {
    motore: Zap, coppia: Gauge, batteria: Battery, autonomia: MapPin, velocitaMax: Gauge,
    peso: Weight, portata: ShieldCheck, ricarica: Timer, freni: ShieldCheck, cambio: SlidersHorizontal,
    pneumatici: Bike, impermeabilita: ShieldCheck,
  };
  return (
    <div>
      {Object.entries(labels).map(([k, label]) => {
        const Icon = icons[k];
        return (
          <div key={k} className="eb-spec-row">
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--steel-dark)" }}>
              <Icon size={14} /> {label}
            </span>
            <span className="eb-mono" style={{ fontSize: 13.5, fontWeight: 500, textAlign: "right" }}>{specs[k]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProductPage({ bikeId, go, compareIds, toggleCompare }) {
  const bike = getBike(bikeId);
  if (!bike) return <div style={{ padding: 60, textAlign: "center" }}>Modello non trovato.</div>;
  const related = BIKES.filter((b) => b.category === bike.category && b.id !== bike.id).slice(0, 3);
  const inCompare = compareIds.includes(bike.id);

  return (
    <div>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 20px 0", fontSize: 12.5, color: "var(--steel-dark)", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ cursor: "pointer" }} onClick={() => go("home")}>Home</span> <ChevronRight size={12} />
        <span style={{ cursor: "pointer" }} onClick={() => go("categoria", bike.category)}>{CATEGORY_LABELS[bike.category]}</span> <ChevronRight size={12} />
        <span>{bike.brand} {bike.name}</span>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }} className="eb-product-grid">
        {/* GALLERIA */}
        <div>
          <div style={{ borderRadius: 6, overflow: "hidden", border: "1px solid var(--line-dark)" }}>
            <Blueprint seed={bike.blueprint} height={360} label="Vista laterale" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 10 }}>
            {["Dettaglio motore", "Batteria", "Display", "Freni"].map((lab, i) => (
              <div key={lab} style={{ borderRadius: 4, overflow: "hidden", border: "1px solid var(--line-dark)" }}>
                <Blueprint seed={bike.blueprint + i + 1} height={78} label={lab} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--steel-dark)", marginTop: 10, lineHeight: 1.5 }}>
            <Info size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />
            Galleria segnaposto in stile tecnico: sostituire con fotografie reali e concesse in licenza del prodotto prima della pubblicazione.
          </p>
        </div>

        {/* INFO PRINCIPALI */}
        <div>
          <div className="eb-mono" style={{ fontSize: 12, color: "var(--steel-dark)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{bike.brand}</div>
          <h1 className="eb-display" style={{ fontSize: "clamp(28px,3.4vw,38px)", fontWeight: 700, margin: "6px 0 10px", letterSpacing: "-0.01em" }}>{bike.name}</h1>
          <p style={{ fontSize: 15.5, color: "var(--steel-dark)", lineHeight: 1.6 }}>{bike.tagline}</p>
          <div style={{ marginTop: 10 }}><StarRating value={bike.review.rating} /></div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--steel-dark)" }}>{bike.review.count} recensioni analizzate</div>

          <div className="eb-hairline" style={{ margin: "22px 0" }} />

          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            {bike.oldPrice && <span className="eb-mono" style={{ fontSize: 16, color: "var(--steel-dark)", textDecoration: "line-through" }}>{formatPrice(bike.oldPrice)}</span>}
            <span className="eb-display" style={{ fontSize: 34, fontWeight: 700 }}>{formatPrice(bike.price)}</span>
            {discountPct(bike) && <span className="eb-tag" style={{ background: "var(--signal)", color: "#fff" }}>-{discountPct(bike)}%</span>}
          </div>
          <p style={{ fontSize: 12, color: "var(--steel-dark)", marginTop: 6 }}>Prezzo indicativo — verifica il prezzo aggiornato su Amazon prima dell'acquisto.</p>

          <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
            <a href={buyLink(bike)} target="_blank" rel="noopener noreferrer sponsored" className="eb-btn eb-btn-accent" style={{ flex: "1 1 220px" }}>
              Vedi su Amazon <ArrowRight size={15} />
            </a>
            <button className="eb-btn eb-btn-outline" onClick={() => toggleCompare(bike.id)}>
              {inCompare ? <Check size={15} /> : <Plus size={15} />} {inCompare ? "Nel comparatore" : "Aggiungi al confronto"}
            </button>
          </div>

          <div className="eb-hairline" style={{ margin: "26px 0 18px" }} />
          <div className="eb-mono" style={{ fontSize: 11, color: "var(--steel-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Per chi è ideale</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{bike.idealFor}</p>
        </div>
      </div>

      {/* SPECIFICHE + RADAR */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }} className="eb-product-grid">
        <div>
          <SectionHeading eyebrow="Scheda tecnica" title="Caratteristiche complete" />
          <div className="eb-card" style={{ padding: "6px 20px" }}>
            <SpecTable specs={bike.specs} />
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Valutazioni" title="Radar delle prestazioni" />
          <div className="eb-panel" style={{ borderRadius: 6, padding: "20px 6px 6px" }}>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={bike.radar} outerRadius="75%">
                <PolarGrid stroke="rgba(244,241,232,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#c9c3b2", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#c8ff3d" fill="#c8ff3d" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PRO/CONTRO */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 20px 0" }}>
        <SectionHeading eyebrow="Analisi" title="Pro e contro" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="eb-grid-2">
          <div className="eb-card" style={{ padding: 26, borderColor: "rgba(127,210,138,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Check size={17} color="var(--good)" />
              <span className="eb-display" style={{ fontWeight: 700, fontSize: 15 }}>Punti di forza</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bike.pros.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <Check size={15} color="var(--good)" style={{ flexShrink: 0, marginTop: 2 }} /> {p}
                </div>
              ))}
            </div>
          </div>
          <div className="eb-card" style={{ padding: 26, borderColor: "rgba(226,105,92,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <XCircle size={17} color="var(--bad)" />
              <span className="eb-display" style={{ fontWeight: 700, fontSize: 15 }}>Limiti</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bike.cons.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <XCircle size={15} color="var(--bad)" style={{ flexShrink: 0, marginTop: 2 }} /> {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENSIONI */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 20px 0" }}>
        <SectionHeading eyebrow="Community" title="Cosa dicono le recensioni" sub={`Sintesi di ${bike.review.count} recensioni raccolte su Amazon e altri rivenditori.`} />
        <div className="eb-panel eb-review-block" style={{ borderRadius: 6, padding: 30, display: "flex", gap: 22, alignItems: "flex-start" }}>
          <Quote size={26} color="var(--accent)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <StarRating value={bike.review.rating} />
              <span style={{ fontSize: 12.5, color: "var(--steel)" }}>· {bike.review.count} recensioni</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--paper-dim)", margin: 0 }}>{bike.review.summary}</p>
          </div>
        </div>
      </div>

      {/* CORRELATI */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 20px 90px" }}>
          <SectionHeading eyebrow="Correlati" title={`Altre bici ${CATEGORY_LABELS[bike.category].toLowerCase()}`} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="eb-grid-3">
            {related.map((b) => <BikeCard key={b.id} bike={b} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />)}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .eb-product-grid { grid-template-columns: 1fr !important; }
          .eb-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .eb-grid-2 { grid-template-columns: 1fr !important; }
          .eb-review-block { flex-direction: column !important; }
        }
        @media (max-width: 620px) {
          .eb-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   COMPARATORE — la sezione principale
   ============================================================ */
const RADAR_COLORS = ["#c8ff3d", "#ff6a3d", "#5ac8fa", "#e2695c"];

function ComparatorPage({ compareIds, toggleCompare, clearCompare, go }) {
  const selected = compareIds.map(getBike).filter(Boolean);
  const overlayData = useMemo(() => {
    if (selected.length === 0) return [];
    const subjects = selected[0].radar.map((r) => r.subject);
    return subjects.map((subject) => {
      const row = { subject };
      selected.forEach((b) => {
        row[b.id] = b.radar.find((r) => r.subject === subject)?.value ?? 0;
      });
      return row;
    });
  }, [selected]);

  const specLabels = {
    motore: "Motore", coppia: "Coppia", batteria: "Batteria", autonomia: "Autonomia",
    velocitaMax: "Velocità max", peso: "Peso", portata: "Portata max", ricarica: "Ricarica",
    freni: "Freni", cambio: "Cambio", pneumatici: "Pneumatici", impermeabilita: "Impermeabilità",
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 90px" }}>
      <SectionHeading eyebrow="Il comparatore" title="Metti a confronto le bici" sub="Scegli fino a 4 modelli: vedrai tabella tecnica e radar sovrapposti per decidere con un solo colpo d'occhio." />

      {/* SELETTORE */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 34 }}>
        {BIKES.map((b) => {
          const active = compareIds.includes(b.id);
          const disabled = !active && compareIds.length >= 4;
          return (
            <button
              key={b.id}
              disabled={disabled}
              onClick={() => toggleCompare(b.id)}
              className="eb-btn"
              style={{
                padding: "10px 16px", fontSize: 13,
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--paper)" : "var(--ink)",
                border: "1px solid " + (active ? "var(--ink)" : "var(--line-dark)"),
              }}
            >
              {active ? <Check size={14} /> : <Plus size={14} />} {b.brand} {b.name}
            </button>
          );
        })}
        {compareIds.length > 0 && (
          <button className="eb-btn eb-btn-outline" style={{ padding: "10px 16px", fontSize: 13 }} onClick={clearCompare}>
            <Trash2 size={14} /> Svuota
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="eb-card" style={{ padding: 60, textAlign: "center", color: "var(--steel-dark)" }}>
          <Scale size={28} style={{ margin: "0 auto 14px", color: "var(--steel-dark)" }} />
          Seleziona almeno due bici qui sopra per iniziare il confronto.
        </div>
      ) : (
        <>
          {/* RADAR SOVRAPPOSTO */}
          <div className="eb-panel" style={{ borderRadius: 6, padding: "26px 8px 10px", marginBottom: 40 }}>
            <div style={{ padding: "0 22px", marginBottom: 6 }}>
              <span className="eb-mono" style={{ fontSize: 11, color: "var(--steel)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Radar sovrapposto</span>
            </div>
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart data={overlayData} outerRadius="72%">
                <PolarGrid stroke="rgba(244,241,232,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#c9c3b2", fontSize: 12.5 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                {selected.map((b, i) => (
                  <Radar key={b.id} name={`${b.brand} ${b.name}`} dataKey={b.id} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.18} strokeWidth={2.2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 12.5, color: "#e8e3d5", paddingTop: 14 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* TABELLA COMPARATIVA */}
          <div style={{ overflowX: "auto" }} className="eb-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 11.5, color: "var(--steel-dark)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--line-dark)" }}>Caratteristica</th>
                  {selected.map((b) => (
                    <th key={b.id} style={{ textAlign: "left", padding: "12px 14px", borderBottom: "1px solid var(--line-dark)", minWidth: 200 }}>
                      <div className="eb-mono" style={{ fontSize: 11, color: "var(--steel-dark)", textTransform: "uppercase" }}>{b.brand}</div>
                      <div className="eb-display" style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
                      <div className="eb-display" style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{formatPrice(b.price)}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <a href={buyLink(b)} target="_blank" rel="noopener noreferrer sponsored" className="eb-btn eb-btn-accent" style={{ padding: "7px 10px", fontSize: 11.5 }}>Amazon</a>
                        <button className="eb-btn eb-btn-outline" style={{ padding: "7px 9px", fontSize: 11.5 }} onClick={() => toggleCompare(b.id)}><Trash2 size={12} /></button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(specLabels).map(([key, label], ri) => (
                  <tr key={key} style={{ background: ri % 2 === 0 ? "var(--paper-dim)" : "transparent" }}>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--steel-dark)", whiteSpace: "nowrap" }}>{label}</td>
                    {selected.map((b) => (
                      <td key={b.id} className="eb-mono" style={{ padding: "12px 14px", fontSize: 12.8 }}>{b.specs[key]}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--steel-dark)" }}>Valutazione media</td>
                  {selected.map((b) => (
                    <td key={b.id} style={{ padding: "12px 14px" }}><StarRating value={b.review.rating} /></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--steel-dark)", marginTop: 14 }}>
            Prezzi indicativi soggetti a variazione — verifica sempre il prezzo aggiornato su Amazon.it prima dell'acquisto.
          </p>
        </>
      )}
    </div>
  );
}

/* ============================================================
   OFFERTE
   ============================================================ */
function DealsPage({ go, compareIds, toggleCompare }) {
  const deals = BIKES.filter((b) => b.deal);
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 90px" }}>
      <SectionHeading eyebrow="Offerte" title="Sconti attivi" sub="Selezione aggiornata dei modelli con lo sconto più interessante rispetto al prezzo di listino." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="eb-grid-3">
        {deals.map((b) => <BikeCard key={b.id} bike={b} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />)}
      </div>
      <div className="eb-card" style={{ padding: 22, marginTop: 34, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Info size={16} color="var(--steel-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13, color: "var(--steel-dark)", lineHeight: 1.6, margin: 0 }}>
          I prezzi Amazon variano continuamente. Gli sconti mostrati sono indicativi e calcolati sul prezzo di listino del produttore: il prezzo finale e la disponibilità reale vengono sempre confermati sulla pagina del prodotto su Amazon.it.
        </p>
      </div>
      <style>{`
        @media (max-width: 900px){.eb-grid-3{grid-template-columns:1fr 1fr !important;}}
        @media (max-width: 620px){.eb-grid-3{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

/* ============================================================
   GUIDE
   ============================================================ */
function GuidesListPage({ go }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 90px" }}>
      <SectionHeading eyebrow="Guide d'acquisto" title="Guide per scegliere bene" sub="Approfondimenti pensati per aiutarti a orientarti tra modelli e categorie." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }} className="eb-grid-2">
        {GUIDES.map((g) => (
          <div key={g.id} className="eb-card" style={{ padding: 28, cursor: "pointer" }} onClick={() => go("guida", g.id)}>
            <BookOpen size={20} color="var(--accent-dim)" />
            <div className="eb-display" style={{ fontWeight: 700, fontSize: 19, marginTop: 14 }}>{g.title}</div>
            <p style={{ fontSize: 13.5, color: "var(--steel-dark)", marginTop: 8, lineHeight: 1.6 }}>{g.excerpt}</p>
            <div className="eb-navlink" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>Leggi <ChevronRight size={14} /></div>
          </div>
        ))}
      </div>
      <style>{`@media (max-width: 620px){.eb-grid-2{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function GuidePage({ guideId, go, compareIds, toggleCompare }) {
  const guide = GUIDES.find((g) => g.id === guideId) || GUIDES[0];
  const bikes = guide.bikeIds.map(getBike).filter(Boolean);
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 20px 90px" }}>
      <div className="eb-tag" style={{ background: "var(--paper-dim)", color: "var(--steel-dark)", marginBottom: 16 }}>Guida d'acquisto</div>
      <h1 className="eb-display" style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{guide.title}</h1>
      <p style={{ fontSize: 16, color: "var(--steel-dark)", lineHeight: 1.7, marginTop: 18 }}>{guide.intro}</p>

      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
        {guide.body.map((p, i) => <p key={i} style={{ fontSize: 15.5, lineHeight: 1.8, margin: 0 }}>{p}</p>)}
      </div>

      <div className="eb-hairline" style={{ margin: "44px 0 30px" }} />
      <div className="eb-display" style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>I modelli citati in questa guida</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {bikes.map((b) => (
          <div key={b.id} className="eb-card eb-guide-row" style={{ padding: 18, display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 16, alignItems: "center" }}>
            <div style={{ borderRadius: 4, overflow: "hidden" }}><Blueprint seed={b.blueprint} height={80} label="" /></div>
            <div>
              <div className="eb-display" style={{ fontWeight: 700, fontSize: 16 }}>{b.brand} {b.name}</div>
              <div style={{ fontSize: 13, color: "var(--steel-dark)" }}>{formatPrice(b.price)} · <StarRating value={b.review.rating} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="eb-btn eb-btn-outline" style={{ padding: "9px 12px", fontSize: 12 }} onClick={() => go("prodotto", b.id)}>Scheda</button>
              <button className="eb-btn eb-btn-dark" style={{ padding: "9px 12px", fontSize: 12 }} onClick={() => toggleCompare(b.id)}>
                {compareIds.includes(b.id) ? "Nel confronto" : "Confronta"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <button className="eb-btn eb-btn-accent" onClick={() => go("comparatore")}>Confronta questi modelli <ArrowRight size={15} /></button>
      </div>
    </div>
  );
}

/* ============================================================
   LEGALE
   ============================================================ */
function LegalPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 20px 100px" }}>
      <div className="eb-tag" style={{ background: "var(--paper-dim)", color: "var(--steel-dark)", marginBottom: 16 }}>Informazioni legali</div>
      <h1 className="eb-display" style={{ fontSize: "clamp(26px,3.6vw,36px)", fontWeight: 700 }}>Informativa sull'affiliazione, privacy e cookie</h1>

      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 26, fontSize: 15, lineHeight: 1.75 }}>
        <div>
          <h2 className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>Programma di affiliazione Amazon</h2>
          <p>
            VoltBici aderisce al Programma Affiliazione Amazon EU, un programma di affiliazione pensato per consentire ai siti di percepire una commissione pubblicitaria attraverso link e pubblicità indirizzati ad Amazon.it. Quando clicchi su un link che rimanda a un prodotto su Amazon e completi un acquisto idoneo, VoltBici può ricevere una piccola commissione, senza alcun costo aggiuntivo per te. I prezzi finali sono sempre quelli mostrati da Amazon al momento dell'acquisto.
          </p>
        </div>
        <div>
          <h2 className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>Indipendenza editoriale</h2>
          <p>
            Le schede tecniche, i punteggi del radar e i riassunti delle recensioni pubblicati su VoltBici sono realizzati in autonomia, aggregando informazioni provenienti dalle schede prodotto su Amazon, dai siti ufficiali dei produttori e da recensioni pubblicate da blog e forum specializzati. Nessun brand ha diritto di revisione sui contenuti pubblicati.
          </p>
        </div>
        <div>
          <h2 className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>Accuratezza dei dati</h2>
          <p>
            Le specifiche tecniche possono variare tra versioni, colori o mercati e vengono aggiornate periodicamente dai produttori. Ti invitiamo a verificare sempre le caratteristiche esatte e il prezzo corrente sulla scheda prodotto ufficiale su Amazon.it prima di procedere all'acquisto. VoltBici non è responsabile di eventuali discrepanze tra i dati riportati e il prodotto effettivamente commercializzato.
          </p>
        </div>
        <div>
          <h2 className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>Privacy e cookie</h2>
          <p>
            Questo sito può utilizzare cookie tecnici necessari al funzionamento e, se presenti, cookie di terze parti (es. Amazon, strumenti di analisi) secondo le rispettive informative privacy. Non raccogliamo dati di pagamento: ogni transazione avviene direttamente su Amazon.it, soggetta alla sua informativa privacy e ai suoi termini di servizio.
          </p>
        </div>
        <div>
          <h2 className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>Contatti</h2>
          <p>Per segnalazioni su contenuti o dati non aggiornati, scrivi a <span className="eb-mono">contatti@tuodominio.it</span> (sostituisci con il tuo indirizzo reale).</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [view, setView] = useState("home");
  const [params, setParams] = useState(null);
  const [compareIds, setCompareIds] = useState([]);

  function go(v, p = null) {
    setView(v);
    setParams(p);
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }
  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }
  function clearCompare() {
    setCompareIds([]);
  }

  let content;
  if (view === "home") content = <HomePage go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;
  else if (view === "categorie") content = <CategoriesPage go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;
  else if (view === "categoria") content = <CategoryPage category={params} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;
  else if (view === "prodotto") content = <ProductPage bikeId={params} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;
  else if (view === "comparatore") content = <ComparatorPage compareIds={compareIds} toggleCompare={toggleCompare} clearCompare={clearCompare} go={go} />;
  else if (view === "offerte") content = <DealsPage go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;
  else if (view === "guide") content = <GuidesListPage go={go} />;
  else if (view === "guida") content = <GuidePage guideId={params} go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;
  else if (view === "legale") content = <LegalPage />;
  else content = <HomePage go={go} compareIds={compareIds} toggleCompare={toggleCompare} />;

  return (
    <div className="eb-root">
      <GlobalStyle />
      <Header go={go} view={view} />
      {content}
      {compareIds.length > 0 && view !== "comparatore" && (
        <div style={{ position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
          <button className="eb-btn eb-btn-dark" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }} onClick={() => go("comparatore")}>
            <Scale size={15} /> Confronta {compareIds.length} {compareIds.length === 1 ? "bici" : "bici"} <ArrowRight size={15} />
          </button>
        </div>
      )}
      <Footer go={go} />
    </div>
  );
}
