export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: number;
  excerpt: string;
  imageQuery: string;
  sections: {
    heading?: string;
    body: string;
    list?: string[];
    /**
     * Doorverwijzingen onder een sectie. `body` wordt als platte tekst gerenderd, dus
     * een link in een alinea is niet mogelijk — en een artikel over bedrijfswagens dat
     * niet naar de voorraad linkt, laat de lezer stranden. Vandaar dit veld: de
     * blogpagina zet er knoppen van onder de sectie.
     */
    links?: { label: string; href: string }[];
  }[];
  keywords: string[];
}

// LET OP: het eerste artikel in deze lijst is het uitgelichte artikel op /blog (zie
// `const [featured, ...rest] = blogPosts`). Daarom staat het koopgerichte artikel over
// bedrijfswagens vooraan: dat is waar JG Mobility op gevonden wil worden.
export const blogPosts: BlogPost[] = [
  {
    slug: "bedrijfswagen-kopen-barendrecht",
    title: "Bedrijfswagen kopen in Barendrecht: waar let je op?",
    date: "2026-10-01",
    category: "Bedrijfswagens",
    readTime: 6,
    imageQuery: "white delivery van cargo loading",
    excerpt:
      "BTW of marge, laadruimte, Euro-klasse, financial lease en inruil: de vijf dingen die bepalen of een bedrijfswagen bij je werk past — en wat ze je kosten als je ze verkeerd inschat.",
    sections: [
      {
        heading: "Begin bij het werk, niet bij de bus",
        body: "Een bedrijfswagen is gereedschap. Een bus die er goed uitziet maar waar je langste plaat niet in past, kost je elke week tijd. Begin daarom bij wat je vervoert: de langste en hoogste lading, het gewicht van een volle laadvloer, en of je er in de stad mee moet komen. Pas daarna kijk je naar merk, bouwjaar en prijs. In Barendrecht en de regio Rotterdam rijden de meeste ondernemers een Sprinter, Transit, Crafter, Master of Vito — niet omdat dat de mooiste bussen zijn, maar omdat er altijd onderdelen, kennis en opbouwers voor te vinden zijn.",
        links: [
          { label: "Bekijk onze bedrijfswagens", href: "/bedrijfswagens" },
        ],
      },
      {
        heading: "BTW-voertuig of marge-voertuig? Dit is het verschil",
        body: "Bij bedrijfswagens zie je twee soorten prijzen, en dat verschil is geen detail. Bij een BTW-voertuig staat de btw apart op de factuur. Ben je btw-plichtig ondernemer, dan vorder je die terug; de prijs exclusief btw is dus wat de bus je werkelijk kost. Bij een marge-voertuig is de btw al afgedragen en staat er geen btw op de factuur — die kun je dus ook niet terugvragen. Vergelijk daarom nooit een prijs exclusief btw met een margeprijs: dan lijkt de BTW-bus 21% goedkoper dan hij is, of de margeauto onnodig duur.",
        list: [
          "BTW-voertuig: btw apart op de factuur, terug te vorderen als je btw-plichtig bent",
          "Marge-voertuig: geen btw op de factuur, dus niets terug te vorderen",
          "Particulier of niet btw-plichtig? Dan rekent alleen het bedrag inclusief btw",
          "Bij ons staat bij elke bedrijfswagen welke van de twee het is, en wat de prijs exclusief btw is",
        ],
      },
      {
        heading: "Laadruimte en laadvermogen: meet het na",
        body: "Bestelbussen worden verkocht in lengte- en hoogtevarianten (L1 tot L4, H1 tot H3) en die maten verschillen per merk. Een L2H2 van het ene merk is niet dezelfde bus als een L2H2 van het andere. Meet dus wat jij vervoert en vergelijk dat met de werkelijke binnenmaten. Let daarnaast op het laadvermogen: dat is het maximumgewicht dat erin mag, en dat is de toegestane massa min het leeggewicht. Een bus met een zware opbouw of een dubbele cabine houdt soms honderden kilo's minder laadvermogen over dan je verwacht — en te zwaar geladen rijden is een boete én een veiligheidsrisico.",
        list: [
          "Binnenmaten van de laadruimte (lengte, breedte tussen de wielkasten, hoogte)",
          "Laadvermogen in kilo's, niet alleen de toegestane massa",
          "Trekgewicht, als je een aanhanger of machine moet trekken",
          "Zijdeur, trekhaak, laadvloerbescherming en bevestigingspunten",
        ],
      },
      {
        heading: "Euro-klasse en zero-emissiezones",
        body: "Steeds meer Nederlandse steden hebben een zero-emissiezone voor bestel- en vrachtauto's, met overgangsregelingen die afhangen van de Euro-klasse en het eerste registratiejaar van je bus. Of jij daar last van hebt, hangt dus niet af van de bus maar van waar je komt. Rijd je alleen in de regio en op bedrijventerreinen, dan is een nette diesel vaak nog jaren prima. Moet je dagelijks de binnenstad in, reken dan vóór de aankoop uit tot wanneer jouw Euro-klasse daar nog mag komen — en betrek dat in de prijs die je voor de bus wil betalen.",
        links: [
          { label: "Zero-emissiezones en je bedrijfswagen", href: "/bedrijfswagens/zero-emissiezones" },
        ],
      },
      {
        heading: "Technische staat: een bus is harder gelopen dan een auto",
        body: "Kilometerstanden bij bedrijfswagens zeggen minder dan bij personenauto's. Een bus met 200.000 km die netjes onderhouden snelwegkilometers heeft gemaakt, is vaak gezonder dan een bus met 120.000 stadskilometers vol koud starten en stationair draaien. Kijk daarom naar de onderhoudshistorie, wanneer de distributie en de koppeling zijn gedaan, de staat van de remmen en de uitlaatnabehandeling (roetfilter, EGR, AdBlue) en hoe de laadruimte eruitziet — dat laatste vertelt je hoe er met de bus is omgegaan. Vraag altijd de APK-historie op en laat je niet afschepen met 'hij loopt goed'.",
      },
      {
        heading: "Financial lease: de bus op de zaak",
        body: "De meeste ondernemers kopen een bedrijfswagen niet in één keer contant. Met financial lease betaal je maandelijks en ben je aan het einde van de looptijd eigenaar; de bus staat op je balans en je mag afschrijven. Bij een BTW-voertuig wordt de btw meestal in één keer betaald en daarna teruggevorderd. Wat een maandbedrag wordt, hangt af van het bedrag, de looptijd, je aanbetaling en de beoordeling van de leasemaatschappij — daarom noemen wij nooit een tarief zonder jouw gegevens. Wij verzorgen de aanvraag via onze partners en laten je vooraf zien wat de voorwaarden zijn.",
        links: [
          { label: "Financial lease aanvragen", href: "/financial-lease" },
        ],
      },
      {
        heading: "Je huidige auto of bus inruilen",
        body: "Heb je nog een auto of bus staan? Die kun je bij ons inruilen, zodat je niet eerst zelf hoeft te verkopen voordat je verder kunt. Wij taxeren je voertuig en verrekenen de waarde direct met de bedrijfswagen die je koopt: één afspraak, één aanspreekpunt, geen periode waarin je twee voertuigen hebt of helemaal geen. Een taxatie is gratis en vrijblijvend — ook als je uiteindelijk ergens anders koopt.",
        links: [
          { label: "Gratis inruilvoorstel aanvragen", href: "/diensten/inkoop-taxatie" },
        ],
      },
      {
        heading: "Samengevat",
        body: "Kijk eerst naar wat je vervoert en waar je komt, let daarna op BTW of marge en reken met het juiste bedrag, controleer laadvermogen en onderhoudshistorie, en regel de financiering en de inruil in één keer. Weet je niet welke bus bij je werk past? Bel of app Jimi op +31 6 21331374 — dan zoeken we mee, ook als de bus die je zoekt nu niet in onze voorraad staat.",
        links: [
          { label: "Bekijk onze bedrijfswagens", href: "/bedrijfswagens" },
          { label: "Contact opnemen", href: "/contact" },
        ],
      },
    ],
    keywords: [
      "bedrijfswagen kopen Barendrecht",
      "bedrijfswagen kopen Rotterdam",
      "bestelbus kopen Barendrecht",
      "bedrijfswagen BTW of marge",
      "laadvermogen bestelbus",
      "zero-emissiezone bestelauto",
      "financial lease bedrijfswagen",
    ],
  },
  {
    slug: "wat-is-consignatie",
    title: "Wat is consignatie? Zo werkt auto verkopen via JG Mobility",
    date: "2025-04-10",
    category: "Consignatie",
    readTime: 5,
    imageQuery: "car dealership handshake keys",
    excerpt:
      "Consignatie is de slimste manier om je auto te verkopen zonder gedoe. JG Mobility regelt alles — jij rijdt gewoon door totdat je auto verkocht is.",
    sections: [
      {
        heading: "Wat betekent consignatie?",
        body: "Consignatie is een verkoopmethode waarbij jij als eigenaar je auto in opdracht geeft aan JG Mobility. Jij rijdt gewoon door in je auto; wij verkopen hem voor je en regelen de presentatie, de bezichtigingen, de onderhandelingen en alle administratie. Jij hoeft er verder niets voor te doen.",
      },
      {
        // Dezelfde vier stappen als op /consignatie en /diensten/consignatie. Stonden
        // hier eerder als vijf stappen beschreven; dat leest als een ander proces.
        heading: "Hoe werkt het in de praktijk?",
        body: "Het begint met een gratis taxatie. We kijken samen naar de staat van je auto en bepalen een eerlijke, marktconforme vraagprijs. Daarna verzorgen wij professionele foto's, plaatsen we de auto op de grootste autoplatformen en begeleiden we alle potentiële kopers. Zodra er een koper is, handelen wij de overdracht netjes af.",
        list: [
          "Stap 1: Aanmelden & taxatie — je meldt je auto aan met foto's, wij bepalen samen de vraagprijs",
          "Stap 2: Fotografie & presentatie — jij rijdt gewoon door, wij verzorgen fotografie, advertentietekst en plaatsing op de grootste autoplatformen",
          "Stap 3: Wij verkopen — bezichtigingen, onderhandelingen en administratie",
          "Stap 4: Uitbetaling — je ontvangt het afgesproken bedrag, wij regelen kenteken en papieren",
        ],
      },
      {
        heading: "Consignatie vs. zelf verkopen",
        body: "Veel mensen proberen hun auto eerst zelf te verkopen via Marktplaats of Facebook. Dat klinkt aantrekkelijk, maar brengt veel gedoe met zich mee: tientallen berichten beantwoorden, onbekenden over de vloer, onderhandelen en al het papierwerk. Via JG Mobility heb je dat gedoe niet. Wij hebben het netwerk, de kennis en de ervaring om jouw auto snel en voor de beste prijs te verkopen.",
      },
      {
        heading: "Wat kost consignatie?",
        body: "Geen kosten vooraf: geen instapkosten en geen advertentiekosten. Onze vergoeding betaal je alleen bij een succesvolle verkoop. De exacte voorwaarden spreken we altijd persoonlijk af, zodat je precies weet waar je aan toe bent.",
      },
      {
        heading: "Klaar om te starten?",
        body: "Wil je weten wat jouw auto waard is? Neem vrijblijvend contact op voor een gratis taxatie. Wij zijn bereikbaar van maandag tot en met zondag, van 10:00 tot 21:00.",
        links: [
          { label: "Auto aanbieden voor consignatie", href: "/consignatie" },
          { label: "Zo werkt consignatie", href: "/diensten/consignatie" },
        ],
      },
    ],
    keywords: [
      "auto consignatie Barendrecht",
      "wat is consignatie auto",
      "auto verkopen via consignatie",
      "consignatie JG Mobility",
      "auto verkopen zonder gedoe",
    ],
  },
  {
    slug: "auto-verkopen-barendrecht",
    title: "Auto verkopen in Barendrecht: zo doe je dat slim in 2025",
    date: "2025-04-22",
    category: "Auto verkopen",
    readTime: 4,
    imageQuery: "luxury car parked street city",
    excerpt:
      "Wil je je auto verkopen in Barendrecht of de regio Rotterdam? Ontdek de slimste manieren en hoe JG Mobility je daarbij helpt.",
    sections: [
      {
        heading: "Auto's verkopen in de regio Rotterdam",
        body: "De regio Rotterdam — met steden als Barendrecht, Ridderkerk, Dordrecht en Spijkenisse — is een drukke automarkt. Er zijn veel aanbieders, maar ook veel kopers. Hoe zorg je ervoor dat jouw auto opvalt en snel verkocht wordt voor een goede prijs?",
      },
      {
        heading: "Je opties op een rij",
        body: "Er zijn grofweg drie manieren om je auto te verkopen:",
        list: [
          "Zelf via Marktplaats of Facebook Marketplace — maximale opbrengst mogelijk, maar veel tijd en gedoe",
          "Inruilen bij een dealer — snel en makkelijk, maar vaak ver onder de marktwaarde",
          "Consignatie via JG Mobility — de beste prijs, zonder het gedoe van zelf verkopen",
        ],
      },
      {
        heading: "Waarom JG Mobility de slimste keuze is",
        body: "Bij JG Mobility krijg je het beste van beide werelden. We halen een marktconforme verkoopprijs voor je auto — vergelijkbaar met wat je zelf zou kunnen bereiken — maar zonder dat jij alle moeite hoeft te doen. Geen vreemden over de vloer, geen eindeloos bellen en appen, geen gedoe met koopcontracten.",
      },
      {
        heading: "Snel geld? Direct inkoop is ook mogelijk",
        body: "Heb je geen tijd om te wachten? Dan kopen we je auto ook direct in. We maken dezelfde dag nog een eerlijk bod op basis van de actuele marktwaarde. Snel, transparant en betrouwbaar.",
      },
      {
        heading: "Gratis taxatie in Barendrecht en omgeving",
        body: "Benieuwd wat jouw auto waard is? JG Mobility biedt een gratis en vrijblijvende taxatie aan. We komen ook bij je langs in Rotterdam, Ridderkerk, Dordrecht of omgeving. Neem vandaag nog contact op.",
      },
    ],
    keywords: [
      "auto verkopen Barendrecht",
      "auto verkopen Rotterdam",
      "auto verkopen Ridderkerk",
      "auto verkopen Dordrecht",
      "auto inkoop Barendrecht",
      "auto inkoop Rotterdam",
    ],
  },
  {
    slug: "occasion-kopen-tips",
    title: "Occasion kopen: waar moet je op letten in 2025?",
    date: "2025-05-01",
    category: "Auto kopen",
    readTime: 6,
    imageQuery: "used car inspection mechanic",
    excerpt:
      "Een occasion kopen is spannend. Hoe weet je of je een eerlijke prijs betaalt en of de auto in goede staat is? Praktische tips van JG Mobility.",
    sections: [
      {
        heading: "De occasionmarkt in 2025",
        body: "De markt voor gebruikte auto's is de afgelopen jaren flink veranderd. Door hogere prijzen voor nieuwe auto's en lange levertijden is de vraag naar kwalitatieve occasions sterk gestegen. Dat maakt het extra belangrijk om goed te weten waar je op moet letten bij de aankoop.",
      },
      {
        heading: "Checklist: dit wil je weten voor je koopt",
        body: "Voordat je een handtekening zet, zijn er een aantal zaken die je absoluut moet checken:",
        list: [
          "Onderhoud: heeft de auto een volledige servicehistorie?",
          "NAP: is de kilometerstand aantoonbaar correct via Nationale Auto Pas?",
          "APK: hoe lang is de APK nog geldig?",
          "Technische staat: laat de auto nakijken door een onafhankelijk monteur",
          "RDW-check: controleer of de auto geen schadehistorie heeft",
          "Verkoper: koop bij een betrouwbare partij, niet anoniem via Marktplaats",
        ],
      },
      {
        heading: "Eerlijke prijs of risico?",
        body: "Een auto die veel goedkoper is dan vergelijkbare modellen is vaak geen koopje maar een risico. Let op auto's met onduidelijke historia, een te lage kilometerstand of verkopers die haastig zijn. Bij JG Mobility zijn al onze occasies zorgvuldig geselecteerd en gecontroleerd — je weet precies wat je koopt.",
      },
      {
        heading: "Proefrit altijd verplicht",
        body: "Koop nooit een auto zonder proefrit. Let tijdens de proefrit op ongewone geluiden, trillingen, hoe de koppeling aanvoelt en hoe de auto reageert bij optrekken en remmen. Vraag ook of alle elektronica en comfortfuncties werken.",
      },
      {
        heading: "Bekijk ons aanbod",
        body: "Op zoek naar een kwalitatieve occasion in Zuid-Holland? Bekijk het actuele aanbod van JG Mobility. Alle auto's zijn zorgvuldig geselecteerd en verkeren in uitstekende staat.",
      },
    ],
    keywords: [
      "occasion kopen Barendrecht",
      "occasion kopen Rotterdam",
      "gebruikte auto kopen tips",
      "tweedehands auto kopen",
      "betrouwbare occasion kopen",
      "occasion kopen checklist",
    ],
  },
  {
    slug: "auto-taxatie-waarde",
    title: "Auto taxatie: zo wordt de waarde van jouw auto bepaald",
    date: "2025-05-08",
    category: "Taxatie",
    readTime: 4,
    imageQuery: "car appraisal value luxury sedan",
    excerpt:
      "Wat is jouw auto echt waard? Ontdek welke factoren de taxatiewaarde bepalen en hoe JG Mobility tot een eerlijk bod komt.",
    sections: [
      {
        heading: "Wat is een auto taxatie?",
        body: "Een taxatie is een professionele waardebepaling van jouw auto. Op basis van meerdere factoren wordt bepaald wat jouw auto op dit moment op de markt waard is. Dit is de basis voor een eerlijk verkoopbod of voor het bepalen van een realistische vraagprijs bij consignatie.",
      },
      {
        heading: "Factoren die de waarde bepalen",
        body: "De waarde van een auto is afhankelijk van veel verschillende factoren:",
        list: [
          "Merk en model — populaire merken houden beter hun waarde",
          "Kilometerstand — hoe lager, hoe hoger de waarde",
          "Bouwjaar en leeftijd van de auto",
          "Onderhoud en servicehistorie",
          "Staat van de carrosserie (deuken, krassen, lakschade)",
          "Technische staat van motor, remmen en versnellingsbak",
          "Opties en extra's zoals navigatie, leder en panoramadak",
          "Brandstoftype — elektrisch en hybride scoren tegenwoordig goed",
          "Actuele marktvraag en seizoensinvloeden",
        ],
      },
      {
        heading: "Handelsprijs vs. consumentenprijs",
        body: "Er is een verschil tussen wat een handelaar betaalt (handelsprijs) en wat een consument normaal betaalt (verkoopprijs). Een dealer koopt in onder de marktprijs om ruimte te hebben voor kosten en marge. Bij JG Mobility streven we naar de beste balans: een eerlijk bod voor jou als verkoper én een eerlijke prijs voor de volgende eigenaar.",
      },
      {
        heading: "Gratis taxatie bij JG Mobility",
        body: "Je kunt bij JG Mobility altijd terecht voor een gratis en vrijblijvende taxatie. We kijken samen naar je auto, leggen uit hoe we tot ons bod komen en je beslist daarna zelf of je wilt verkopen of via consignatie wilt gaan. Geen druk, geen verrassingen.",
      },
    ],
    keywords: [
      "auto taxatie Barendrecht",
      "auto taxatie Rotterdam",
      "auto waarde bepalen",
      "gratis auto taxatie",
      "auto taxeren laten",
      "wat is mijn auto waard",
    ],
  },
  {
    slug: "autofinanciering-opties",
    title: "Autofinanciering: wat zijn jouw opties bij JG Mobility?",
    date: "2025-05-13",
    category: "Financiering",
    readTime: 5,
    imageQuery: "car financing contract signing",
    excerpt:
      "Droomauto gevonden maar wil je niet alles in één keer betalen? Ontdek de financieringsmogelijkheden bij JG Mobility in Barendrecht.",
    sections: [
      {
        heading: "Financiering voor je droomauto",
        body: "Een auto kopen is voor de meeste mensen een grote uitgave. Gelukkig hoef je niet altijd de volledige aankoopprijs in één keer te betalen. Bij JG Mobility denken we graag mee over een passende financieringsoplossing, zodat je toch in je droomauto kunt rijden.",
      },
      {
        heading: "Jouw financieringsopties",
        body: "Er zijn verschillende manieren om een auto te financieren:",
        list: [
          "Persoonlijke lening — je leent een vast bedrag en betaalt dit in vaste maandtermijnen terug. Eenvoudig en overzichtelijk.",
          "Doorlopend krediet — flexibeler dan een persoonlijke lening; je kunt extra aflossen of bijlenen.",
          "Financial lease — je betaalt maandelijks voor gebruik van de auto en wordt aan het einde eigenaar.",
          "Operational lease — alles-in-één maandelijkse betaling inclusief verzekering en onderhoud. Populair bij zakelijke rijders.",
        ],
      },
      {
        heading: "Particulier of zakelijk?",
        body: "Ben je een particuliere koper? Dan is een persoonlijke lening vaak de meest transparante keuze. Ben je zzp'er of rijd je de auto zakelijk? Dan kan financial of operational lease fiscaal aantrekkelijk zijn, omdat je de btw kunt terugvorderen en de leasekosten kunt aftrekken.",
      },
      {
        heading: "Tips voor slim financieren",
        body: "Een paar praktische tips als je overweegt te financieren:",
        list: [
          "Vergelijk altijd meerdere aanbieders op rente en voorwaarden",
          "Let op de totale kosten over de gehele looptijd, niet alleen de maandlast",
          "Houd rekening met bijkomende kosten: verzekering, onderhoud, wegenbelasting",
          "Kies een looptijd die past bij hoe lang je de auto wilt houden",
          "Leg niet meer dan 15–20% van je netto inkomen in een autolening",
        ],
      },
      {
        heading: "Laten we de mogelijkheden bespreken",
        body: "Wil je weten wat in jouw situatie de beste financieringsvorm is? Neem contact op met JG Mobility. We denken graag met je mee en koppelen je indien nodig aan onze financieringspartners.",
      },
    ],
    keywords: [
      "autofinanciering Barendrecht",
      "auto financieren Rotterdam",
      "auto lening particulier",
      "financial lease auto",
      "auto kopen op afbetaling",
      "zakelijke autofinanciering",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ];
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
