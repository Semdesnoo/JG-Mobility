export type Auto = {
  id: number;
  merk: string;
  model: string;
  versie: string;
  bouwjaar: number;
  bodytype: string;
  prijs: number;
  km: number;
  brandstof: string;
  transmissie: string;
  vermogen: string;
  kleur: string;
  // Extra kenmerken
  apk: string;
  btw: string;
  bekleding: string;
  kleurExterieur: string;
  // Foto's (URLs of /public paden)
  fotos?: string[];
  // Omschrijving
  omschrijving: string;
  // Opties per categorie
  opties: {
    categorie: string;
    items: string[];
  }[];
};

export const autos: Auto[] = [
  {
    id: 1,
    merk: "BMW",
    model: "M4 Competition",
    versie: "xDrive | Carbon | Head-Up | Harman Kardon",
    bouwjaar: 2022,
    bodytype: "Coupé",
    prijs: 89500,
    km: 18000,
    brandstof: "Benzine",
    transmissie: "Automaat",
    vermogen: "510 pk",
    kleur: "Frozen Grey",
    apk: "12-2025",
    btw: "Marge",
    bekleding: "Volledig leder",
    kleurExterieur: "Frozen Grey metallic",
    omschrijving:
      "Deze BMW M4 Competition xDrive is in uitstekende staat en volledig gedocumenteerd onderhouden. Het voertuig beschikt over een indrukwekkend pakket aan opties en is rijklaar afgeleverd. De Frozen Grey lak geeft de auto een exclusief en tijdloos karakter. Met 510 pk en xDrive vierwielaandrijving is de rijervaring subliem — zowel op de snelweg als op het circuit.\n\nVolledige servicehistorie aanwezig. Geen schadehistorie. Beschikbaar voor proefrit op afspraak.",
    opties: [
      {
        categorie: "Exterieur",
        items: [
          "Frozen Grey metallic lak",
          "M Carbon exterior pakket",
          "19/20 inch M forged wielen",
          "Adaptieve LED koplampen",
          "Carbon dakspoiler",
          "M-specifieke diffuser",
        ],
      },
      {
        categorie: "Interieur",
        items: [
          "Volledig Merino leder interieur",
          "M sport stoelen met geheugenfunctie",
          "Carbon interieur afwerking",
          "Head-Up Display",
          "Harman Kardon surround sound",
          "Panoramisch glazen dak",
          "Sfeerverlichting",
          "Verwarmde voorstoelen",
          "Geventileerde voorstoelen",
        ],
      },
      {
        categorie: "Technologie",
        items: [
          "BMW Live Cockpit Professional",
          "Apple CarPlay / Android Auto",
          "Wireless charging",
          "Driving Assistant Professional",
          "Parking Assistant Plus",
          "360° camera systeem",
          "Active Cruise Control",
        ],
      },
      {
        categorie: "Rijdynamiek",
        items: [
          "M xDrive vierwielaandrijving",
          "M Adaptive suspension",
          "M Sport differential",
          "M Carbon keramische remmen",
          "Launch Control",
          "8-traps M Steptronic transmissie",
        ],
      },
    ],
  },
  {
    id: 2,
    merk: "Mercedes-Benz",
    model: "E 400 E 4MATIC",
    versie: "AMG 53 Look | Hyperscreen | Massage | Burmester",
    bouwjaar: 2023,
    bodytype: "Sedan",
    prijs: 84950,
    km: 3290,
    brandstof: "Hybride (Plug-in)",
    transmissie: "Automaat (9-traps)",
    vermogen: "381 pk / 280 kW",
    kleur: "Grijs",
    apk: "Bij aflevering",
    btw: "BTW",
    bekleding: "Leder",
    kleurExterieur: "Grijs metallic",
    fotos: [
      "https://prod.pictures.autoscout24.net/listing-images/eaa60059-a7a6-4d96-81e4-25fe65570d8f_efb76993-e11d-46bc-9ca5-26e557c9f29a.jpg/1280x960.webp",
    ],
    omschrijving:
      "Prachtige Mercedes-Benz E 400 E 4MATIC in de exclusieve AMG 53 Look uitvoering. Dit bijna nieuwe exemplaar uit augustus 2023 heeft slechts 3.290 km gereden en staat zo goed als nieuw. De plug-in hybride aandrijflijn levert 381 pk en combineert elektrisch rijden met de kracht van een benzinemotor voor het beste van beide werelden.\n\nVolledig uitgerust met het indrukwekkende MBUX Hyperscreen, Burmester 3D surround geluidssysteem, massagefunctie voor de stoelen en het complete AMG 53 Look exterieurpakket. Eerste eigenaar, volledige dealer-documentatie aanwezig.",
    opties: [
      {
        categorie: "Exterieur",
        items: [
          "AMG 53 Look exterieurpakket",
          "AMG bodystyling voor en achter",
          "AMG sideskirts",
          "AMG 20 inch meersspaaks wielen",
          "Multibeam LED koplampen",
          "Grijs metallic lak",
          "Panoramisch schuif-/kanteldak",
          "Privacy glas achter",
        ],
      },
      {
        categorie: "Interieur",
        items: [
          "MBUX Hyperscreen (56 cm breed display)",
          "Burmester 3D Surround Sound systeem",
          "Massage functie voorstoelen",
          "Volledig lederen interieur",
          "Elektrische stoelen met geheugenfunctie",
          "Verwarmde voor- en achterstoelen",
          "Geventileerde voorstoelen",
          "Ambient lighting 64 kleuren",
          "Head-Up Display",
          "Elektrisch verstelbaar stuurwiel met verwarming",
        ],
      },
      {
        categorie: "Technologie",
        items: [
          "Apple CarPlay / Android Auto",
          "360° parkeercamera systeem",
          "Wireless smartphone charging",
          "Keyless Go instap en start",
          "Active Distance Assist DISTRONIC",
          "Active Steering Assist",
          "Active Lane Change Assist",
          "Active Brake Assist",
          "Parking Pilot",
          "Traffic Sign Assist",
        ],
      },
      {
        categorie: "Rijdynamiek",
        items: [
          "4MATIC permanente vierwielaandrijving",
          "E 400 e plug-in hybride aandrijving",
          "381 pk gecombineerd vermogen",
          "9G-TRONIC automaat",
          "AIRMATIC luchtvering",
          "Dynamic Select rijmodi (Comfort / Sport / Sport+ / ECO / Individueel)",
          "Elektrisch rijbereik ca. 50 km",
          "Euro 6d emissienorm",
        ],
      },
    ],
  },
  {
    id: 3,
    merk: "Porsche",
    model: "Cayenne GTS",
    versie: "Coupé | PDCC | Sport Chrono | Bose",
    bouwjaar: 2023,
    bodytype: "SUV",
    prijs: 129000,
    km: 8500,
    brandstof: "Benzine",
    transmissie: "Automaat",
    vermogen: "460 pk",
    kleur: "Jet Black",
    apk: "Bij aflevering",
    btw: "BTW",
    bekleding: "Alcantara / leder",
    kleurExterieur: "Jet Black metallic",
    omschrijving:
      "Prachtige Porsche Cayenne GTS Coupé in de zeldzame Jet Black metallic kleur. Dit exemplaar is nauwelijks gebruikt en verkeert in nieuwstaat. De 4.0 V8 biturbo motor levert 460 pk en zorgt voor een sportieve, toch comfortabele rijervaring. Volledig voorzien van de GTS-specifieke sportaanpassingen.\n\nGarantie loopt nog door tot 2026. Eén eigenaar. Volledig Porsche dealer onderhoud.",
    opties: [
      {
        categorie: "Exterieur",
        items: [
          "Jet Black metallic lak",
          "GTS specifieke exterieur afwerking",
          "22 inch RS Spyder Design wielen in zwart",
          "Porsche Dynamic Light System Plus",
          "Panoramisch vaste glasdak",
          "Sport Design bumpers",
          "Black exterieur pakket",
        ],
      },
      {
        categorie: "Interieur",
        items: [
          "Alcantara/leder GTS interieur",
          "18-weg verstelbare sportstoelen",
          "Sport Chrono pakket",
          "Bose Surround Sound systeem",
          "GTS stuurwiel met Sport Response",
          "Verwarmde en geventileerde stoelen",
          "Panoramisch kantelbaar glazen dak",
          "Sfeerverlichting",
        ],
      },
      {
        categorie: "Technologie",
        items: [
          "Porsche Communication Management (PCM)",
          "Apple CarPlay / Android Auto",
          "Head-Up Display",
          "Surround View camera systeem",
          "Adaptieve cruise control met stopfunctie",
          "Lane Change Assist",
          "Night Vision Assist",
        ],
      },
      {
        categorie: "Rijdynamiek",
        items: [
          "Porsche Dynamic Chassis Control (PDCC)",
          "Luchtvering met Porsche Active Suspension Management",
          "Porsche Torque Vectoring Plus (PTV Plus)",
          "Sport Exhaust systeem",
          "Launch Control",
          "8-traps Tiptronic S",
        ],
      },
    ],
  },
  {
    id: 4,
    merk: "Audi",
    model: "RS6 Avant",
    versie: "Performance | Carbon | Pano | B&O",
    bouwjaar: 2022,
    bodytype: "Stationwagen",
    prijs: 112000,
    km: 22000,
    brandstof: "Benzine",
    transmissie: "Automaat",
    vermogen: "600 pk",
    kleur: "Nardo Grey",
    apk: "09-2025",
    btw: "Marge",
    bekleding: "Valcona leder",
    kleurExterieur: "Nardo Grey",
    omschrijving:
      "De RS6 Avant is het ultieme statement van Audi Sport: een stationwagen met 600 pk en het comfort van een luxe touring-auto. Dit exemplaar in de iconische Nardo Grey kleur is volledig voorzien van het RS Design pakket en Carbon pakket. De 4.0 TFSI V8 motor klinkt en rijdt geweldig.\n\nVolledige Audi Sport dealer onderhoudshistorie. Geen schade. Nette tweede eigenaar.",
    opties: [
      {
        categorie: "Exterieur",
        items: [
          "Nardo Grey lak",
          "RS Carbon exterieur pakket",
          "22 inch RS-wielen in mat antraciet",
          "Matrix LED koplampen",
          "Black Package exterieur",
          "RS Sport uitlaat met zwarte eindpijpen",
          "Panoramisch glazen schuifdak",
        ],
      },
      {
        categorie: "Interieur",
        items: [
          "Valcona leder met RS Design",
          "Elektrische stoelen met geheugenfunctie",
          "B&O Sound System 3D",
          "RS sport stuurwiel in leder/carbon",
          "Verwarmde voor- en achterstoelen",
          "Audi virtual cockpit plus",
          "Head-Up Display",
          "Sfeerverlichting contourverlichting",
        ],
      },
      {
        categorie: "Technologie",
        items: [
          "MMI Navigation plus",
          "Apple CarPlay / Android Auto",
          "Audi phone box wireless charging",
          "360° omgevingscamera",
          "Adaptieve cruise control",
          "Audi Pre Sense City en Front",
          "Parkeer-/uitparkeerassistent",
        ],
      },
      {
        categorie: "Rijdynamiek",
        items: [
          "Quattro permanente 4WD",
          "RS Sport suspension",
          "RS-specifieke stuurbekrachtiging",
          "Carbon keramische remmen optie",
          "Launch Control",
          "8-traps tiptronic automaat",
          "Active sport differential achter",
        ],
      },
    ],
  },
  {
    id: 5,
    merk: "Volvo",
    model: "XC90 Recharge",
    versie: "T8 Ultimate Dark | Pano | Bower & Wilkins",
    bouwjaar: 2023,
    bodytype: "SUV",
    prijs: 79900,
    km: 12000,
    brandstof: "Hybride",
    transmissie: "Automaat",
    vermogen: "455 pk",
    kleur: "Crystal White",
    apk: "Bij aflevering",
    btw: "BTW",
    bekleding: "Nappa leder",
    kleurExterieur: "Crystal White pearl",
    omschrijving:
      "Uitzonderlijk fraaie Volvo XC90 Recharge T8 in de topuitvoering Ultimate Dark. Dit 7-persoons hybride SUV combineert Scandinavische luxe met duurzaamheid en uitstekende rijprestaties. Als plug-in hybride bied je het beste van twee werelden: elektrisch rijden in de stad en vol vermogen voor lange ritten.\n\nBatterijgarantie nog geldig. Eerste eigenaar. Volvo dealer onderhoud.",
    opties: [
      {
        categorie: "Exterieur",
        items: [
          "Crystal White pearl lak",
          "22 inch 5-spaaks diamantgeslepen wielen",
          "Panoramisch glazen dak",
          "Thor's Hammer LED koplampen",
          "Trekhaak elektrisch uitklapbaar",
          "Park Assist pilot voor en achter",
          "360° Surround View camera",
        ],
      },
      {
        categorie: "Interieur",
        items: [
          "Nappa leder 7-zits interieur",
          "Bower & Wilkins 3D Sound 1400W",
          "Verwarmde voor-, midden- en achterstoelen",
          "Geventileerde voorstoelen met massage",
          "Panoramische schuifdak voor en achter",
          "Crystal shift gearselector",
          "Orrefors kristal decoratie",
          "Head-Up Display",
          "Sfeerverlichting",
        ],
      },
      {
        categorie: "Technologie",
        items: [
          "Google built-in infotainment",
          "Apple CarPlay",
          "Wireless charging",
          "Pilot Assist semi-autonoom rijden",
          "IntelliSafe Pro Pack",
          "Air Quality systeem met geurspreider",
          "Keyless entry alle deuren",
        ],
      },
      {
        categorie: "Rijdynamiek",
        items: [
          "T8 Twin Engine AWD aandrijving",
          "455 pk totaalvermogen",
          "50+ km elektrisch rijbereik",
          "Air suspension",
          "4C adaptieve dempers",
          "8-traps Geartronic automaat",
        ],
      },
    ],
  },
  {
    id: 6,
    merk: "Land Rover",
    model: "Defender 110 V8",
    versie: "Carpathian Edition | 525 pk | Carbon | 22\"",
    bouwjaar: 2022,
    bodytype: "SUV",
    prijs: 145000,
    km: 19000,
    brandstof: "Benzine",
    transmissie: "Automaat",
    vermogen: "525 pk",
    kleur: "Santorini Black",
    apk: "06-2025",
    btw: "Marge",
    bekleding: "Windsor leder",
    kleurExterieur: "Santorini Black",
    omschrijving:
      "De ultieme Defender — de zeldzame V8 Carpathian Edition in Santorini Black. Met de supercharged 5.0 V8 met 525 pk is dit de meest krachtige Defender ooit gebouwd. Beperkte oplage wereldwijd. Dit exemplaar is volledig uitgerust met het Carbon Exterior Pack en exclusieve 22 inch Carpathian wielen.\n\nExclusief collectorsobject. Volledige Land Rover dealer servicehistorie. Geen schade.",
    opties: [
      {
        categorie: "Exterieur",
        items: [
          "Santorini Black lak",
          "Carpathian Edition exclusieve badges",
          "22 inch Carpathian Grey wielen",
          "Carbon Exterior Pack",
          "Pixel LED koplampen",
          "Elektrisch vouwbare buitenspiegels",
          "Trekhaak 3500 kg",
        ],
      },
      {
        categorie: "Interieur",
        items: [
          "Windsor leder bekleding",
          "Elektrische stoelen voor met geheugenfunctie",
          "Meridian Surround geluidssysteem 700W",
          "Panoramisch glazen dak",
          "Verwarmde voor- en achterstoelen",
          "Geventileerde voorstoelen",
          "Head-Up Display",
          "Sfeerverlichting",
          "Koelkast in middenconsole",
        ],
      },
      {
        categorie: "Technologie",
        items: [
          "Pivi Pro infotainment",
          "Apple CarPlay / Android Auto",
          "Wireless charging",
          "3D Surround camera",
          "Adaptieve cruise control",
          "Clear Exit Monitor",
          "Activity Key",
        ],
      },
      {
        categorie: "Rijdynamiek",
        items: [
          "Terrain Response 2 systeem",
          "All-Terrain Progress Control",
          "Electronic Air Suspension",
          "Electronic Active Rear Locking Differential",
          "Wade Sensing systeem",
          "8-traps ZF automaat",
          "Permanent 4WD met laaggeleidingsbak",
        ],
      },
    ],
  },
];
