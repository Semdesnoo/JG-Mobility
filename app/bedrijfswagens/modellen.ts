/**
 * De vijf bestelbussen waar een eigen pagina voor bestaat.
 *
 * WAAROM DEZE VIJF EN NIET MEER
 * Dit zijn de modellen waar in Nederland op gezocht wordt en waar wij regelmatig iets van
 * in de voorraad hebben. Een pagina per denkbare bestelbus zou tientallen pagina's
 * opleveren die allemaal hetzelfde zeggen en waar nooit iets op staat — daar helpt
 * niemand zich mee verder.
 *
 * WAAROM DE TEKST HIER STAAT EN NIET IN DE PAGINA
 * /bedrijfswagens linkt naar deze vijf pagina's en heeft dus dezelfde namen en slugs
 * nodig. Een page.tsx mag in de App Router niets anders exporteren dan wat Next
 * verwacht, dus kan de lijst daar niet uit komen.
 *
 * WAT HIER NIET IN STAAT
 * Geen prijzen, geen leasebedragen en geen beloftes over voorraad: wat er te koop staat
 * komt uit de database en wisselt per dag. De tekst gaat over het model zelf — waar hij
 * voor gebruikt wordt, in welke uitvoeringen hij bestaat en waar je bij een gebruikte op
 * let. Alles wat per bouwjaar of generatie verschilt staat er met een voorbehoud bij,
 * want een Sprinter uit 2012 is een andere bus dan een uit 2022.
 */

export type Bedrijfswagenmodel = {
  /** Het laatste deel van de URL: /bedrijfswagens/sprinter */
  slug: string;
  /** Volledige naam, zoals in de H1 en de paginatitel. */
  naam: string;
  /** Alleen het model, voor in een lopende zin. */
  kort: string;
  /**
   * Het meervoud, met de hand. Nederlands kent hier geen regel die je in code kunt
   * zetten: het is "Sprinters" maar "Vito's", en een `+ "s"` levert dus de helft van de
   * tijd een taalfout op in een kop.
   */
  meervoud: string;
  /**
   * Waarop in `auto.model` gezocht wordt om de voorraad bij dit model te vinden.
   * Hoofdletter-ongevoelig en als deel van de modelnaam: "Sprinter 316 CDI L2H2" hoort
   * bij de Sprinter.
   */
  sleutel: string;
  /** Eén alinea onder de H1. */
  samenvatting: string;
  /**
   * De meta-description. Met de hand geschreven en niet uit de samenvatting gesneden:
   * een afgekapte alinea leest in een zoekresultaat als een fout, en vijf pagina's met
   * dezelfde opbouw horen vijf verschillende beschrijvingen te hebben.
   */
  metaBeschrijving: string;
  /** Twee tot drie alinea's: gebruik, uitvoeringen, waar je op let. */
  paragrafen: string[];
};

export const bedrijfswagenmodellen: Bedrijfswagenmodel[] = [
  {
    slug: "sprinter",
    naam: "Mercedes-Benz Sprinter",
    kort: "Sprinter",
    meervoud: "Sprinters",
    sleutel: "sprinter",
    samenvatting:
      "De Sprinter is de bestelbus die u in vrijwel elke branche tegenkomt: van bouw en installatie tot koeriersdiensten en servicewagens. Dat maakt hem ook als occasion interessant — kennis, onderdelen en uitvoeringen zijn ruim beschikbaar.",
    metaBeschrijving:
      "Mercedes-Benz Sprinter kopen bij JG Mobility in Barendrecht. Welke lengtes en dakhoogtes er zijn, waar u bij een gebruikte Sprinter op let en wat er nu op voorraad staat.",
    paragrafen: [
      "De Sprinter wordt gekocht door bedrijven die er dagelijks mee werken: installateurs met een ingerichte laadruimte, koeriers die vooral volume nodig hebben, en ondernemers die er een werkplaats op wielen van maken. Hij is ook de basis van veel campers en servicebussen, wat betekent dat er altijd exemplaren met een flinke kilometerstand én exemplaren met een rustig verleden naast elkaar te koop staan. Welke van de twee u voor zich heeft, leest u aan de onderhoudshistorie af — niet aan de teller.",
      "Afhankelijk van generatie en bouwjaar is de Sprinter er in meerdere lengtes (doorgaans L1 tot L3, bij sommige jaren ook een extra lange uitvoering) en in meerdere dakhoogtes (H1 tot H3). Daarnaast bestaan er voorwiel-, achterwiel- en vierwielaangedreven varianten, en naast de gesloten bestelwagen ook chassis-cabines, bakwagens en kippers. De keuze zit vooral in de praktijk: een hoge opbouw rijdt een parkeergarage niet in, een lange bus is in de stad lastiger te keren, en het toegestane totaalgewicht bepaalt of u er met rijbewijs B in mag rijden. Weet daarom eerst wat er in moet en hoe u rijdt, en kies daarna de lengte en hoogte.",
      "Bij een gebruikte Sprinter kijkt u naar meer dan de motor. Loop de laadruimte na op doorgezakte vloerdelen en beschadigde wanden, test de schuifdeur een paar keer (rails en rollen krijgen de klappen bij intensief gebruik) en let op roestvorming rond wielkasten, deurnaden en achterportieren. Bij een bus die vooral korte stadsritten heeft gereden is de staat van het roetfilter een aandachtspunt. Vraag ook naar de emissieklasse: die bepaalt of u de zero-emissiezones nog in mag en tot wanneer.",
    ],
  },
  {
    slug: "master",
    naam: "Renault Master",
    kort: "Master",
    meervoud: "Masters",
    sleutel: "master",
    samenvatting:
      "De Renault Master is een van de ruimste bestelbussen in zijn klasse en jarenlang een vaste keuze voor wie veel volume nodig heeft tegen beperkte kosten per kuub.",
    metaBeschrijving:
      "Renault Master kopen bij JG Mobility in Barendrecht. Lengtes L1 tot L4, dakhoogtes, waar u bij een gebruikte Master op let en wat er nu op voorraad staat.",
    paragrafen: [
      "De Master is populair bij bedrijven die vooral ruimte kopen: verhuizers, groothandel, bouw en installatie. Door de meest voorkomende voorwielaandrijving zit de laadvloer relatief laag, wat inladen met de hand of met een steekwagen een stuk makkelijker maakt. Hij is jarenlang ook als Opel Movano en Nissan NV400 verkocht — in de praktijk dezelfde bus onder een ander logo, wat de keuze aan occasions en onderdelen vergroot.",
      "De Master is er in meerdere lengtes (L1 tot L4) en dakhoogtes (H1 tot H3), als gesloten bestelwagen en als chassis-cabine met bak of kipper. Welke uitvoering bij u past hangt af van wat u vervoert: lange materialen vragen een L3 of L4, rechtop kunnen staan in de laadruimte vraagt een H2 of hoger. Let bij de zwaardere varianten op het toegestane totaalgewicht in verband met uw rijbewijs, en bij een inrichting op het laadvermogen dat er na die inrichting nog overblijft.",
      "Bij een gebruikte Master zijn de aandachtspunten vooral de punten die bij elke hardwerkende bestelbus gelden: onderhoudshistorie, de staat van koppeling en versnellingsbak bij een bus die zwaar beladen heeft gereden, roestvorming rond de achterportieren en wielkasten, en de staat van laadvloer en wanden. Is er veel in de stad gereden, let dan op het roetfilter en de EGR. Vraag naar de emissieklasse en de datum eerste toelating als u de bus in een zero-emissiezone wilt gebruiken.",
    ],
  },
  {
    slug: "crafter",
    naam: "Volkswagen Crafter",
    kort: "Crafter",
    meervoud: "Crafters",
    sleutel: "crafter",
    samenvatting:
      "De Crafter is de grote bestelbus van Volkswagen: ruim, rijdt eerder als een personenauto dan als een vrachtwagen, en veel gekocht door ondernemers die er lange dagen in zitten.",
    metaBeschrijving:
      "Volkswagen Crafter kopen bij JG Mobility in Barendrecht. Het verschil tussen de generaties, waar u bij een gebruikte Crafter op let en wat er nu op voorraad staat.",
    paragrafen: [
      "De Crafter wordt vaak gekozen door bedrijven waarvoor de bus ook een werkplek is: bouw, installatie, servicediensten en koeriers die veel kilometers per dag maken. Rijcomfort en bediening liggen dicht bij wat u uit een personenauto kent, en de laadruimte is in de ruimere uitvoeringen groot genoeg om in te staan. Goed om te weten bij het vergelijken van occasions: de generatie tot ongeveer 2016 deelde zijn techniek met de Mercedes-Benz Sprinter van die jaren, terwijl de Crafter vanaf 2017 op een eigen platform staat (en als MAN TGE vrijwel identiek verkocht wordt). Dat zijn dus twee verschillende bussen onder dezelfde naam.",
      "Er zijn meerdere lengtes en dakhoogtes, en afhankelijk van bouwjaar en uitvoering voorwiel-, achterwiel- of vierwielaandrijving. Naast de gesloten bestelwagen bestaan er chassis-cabines en bakwagens. Kies de uitvoering op wat u vervoert en waar u komt: hoogte is handig tot u een parkeergarage of een krappe binnenstad in moet, lengte tot u moet keren. Controleer het toegestane totaalgewicht in verband met rijbewijs B, vooral bij een bus die al een inrichting heeft.",
      "Let bij een gebruikte Crafter op de onderhoudshistorie en op het verschil tussen de generaties: koopt u een exemplaar van voor 2017, dan gelden de aandachtspunten van de Sprinter uit die jaren. Loop verder de laadruimte na (vloer, wanden, sjorogen), test de schuifdeur, kijk naar roest rond deurnaden en wielkasten, en vraag bij een bus met veel stadskilometers naar het roetfilter. De emissieklasse en de datum eerste toelating bepalen wat u met de bus in een zero-emissiezone nog kunt.",
    ],
  },
  {
    slug: "transit",
    naam: "Ford Transit",
    kort: "Transit",
    meervoud: "Transits",
    sleutel: "transit",
    samenvatting:
      "De Transit is een van de meest verkochte bestelbussen van Europa en al decennia een werkbus voor alle branches. Let bij het vergelijken goed op welke Transit u voor zich heeft.",
    metaBeschrijving:
      "Ford Transit kopen bij JG Mobility in Barendrecht. Het verschil tussen Transit en Transit Custom, waar u bij een gebruikte op let en wat er nu op voorraad staat.",
    paragrafen: [
      "Transit is bij Ford een familie en niet één bus. De gewone Transit is de grote uitvoering voor wie volume en laadvermogen nodig heeft; de Transit Custom is het middelgrote model dat beter in de stad en in een parkeergarage past; daarnaast bestaan de kleinere Transit Connect en de Transit Courier. Dat is het eerste dat u bij een advertentie wilt weten, want tussen een Custom en een grote Transit zit een flink verschil in afmetingen, laadvermogen en rijgedrag. In onze voorraad noemen we altijd de volledige modelnaam, zodat u direct ziet welke het is.",
      "Afhankelijk van model en bouwjaar is de Transit er in meerdere lengtes en dakhoogtes, en met voorwiel-, achterwiel- of vierwielaandrijving — een combinatie die u bij veel concurrenten niet vindt. Achterwielaandrijving is in het voordeel bij zwaar en regelmatig volbeladen rijden en bij trekken; voorwielaandrijving geeft een lagere laadvloer. Naast de gesloten bestelwagen zijn er dubbele cabines, chassis-cabines en bakwagens. Kijk ook hier naar het toegestane totaalgewicht in verband met rijbewijs B.",
      "Bij een gebruikte Transit wilt u de onderhoudshistorie zien en weten waarvoor de bus gebruikt is: een koeriersbus met veel korte ritten vraagt andere aandacht dan een bus die snelwegkilometers heeft gemaakt. Controleer de laadvloer en de wanden, test de schuifdeur en de achterdeuren, let op roest rond wielkasten en deurnaden, en bij veel stadsgebruik op de staat van het roetfilter. Wilt u er een zero-emissiezone in rijden, vraag dan de emissieklasse en de datum eerste toelating op.",
    ],
  },
  {
    slug: "vito",
    naam: "Mercedes-Benz Vito",
    kort: "Vito",
    meervoud: "Vito's",
    sleutel: "vito",
    samenvatting:
      "De Vito is de middelgrote bestelwagen van Mercedes-Benz: compacter dan een Sprinter, met personenautocomfort, en daarmee de keuze voor wie vooral in en om de stad werkt.",
    metaBeschrijving:
      "Mercedes-Benz Vito kopen bij JG Mobility in Barendrecht. De drie lengtes, het verschil met de Tourer, waar u bij een gebruikte Vito op let en wat er nu op voorraad staat.",
    paragrafen: [
      "De Vito zit in de klasse waar de meeste servicebussen rijden: monteurs, installateurs, hoveniers en koeriers die de hele dag van adres naar adres gaan. Hij rijdt en parkeert als een grote personenauto, past met zijn beperkte hoogte onder vrijwel elke parkeergarageslagboom en heeft toch een laadruimte waar een Euro-pallet in kan. Er bestaat ook een personenuitvoering (Tourer) met ruiten en stoelen achterin; die wordt vaak voor personenvervoer of als grote gezinsauto gebruikt en is fiscaal en qua inrichting een ander verhaal dan de gesloten bestelwagen.",
      "De Vito is er doorgaans in drie lengtes (compact, lang en extra lang) met één dakhoogte, en afhankelijk van bouwjaar en uitvoering met voorwiel-, achterwiel- of vierwielaandrijving. Voor wie veel korte ritten maakt is de kortere uitvoering het handigst; wie lange materialen vervoert of een inrichting wil plaatsen zit beter op een lange versie. Let bij het vergelijken op het laadvermogen dat er na een eventuele inrichting overblijft, en op het trekgewicht als u er een aanhanger achter wilt hangen.",
      "Veel Vito's zijn ex-servicebussen en hebben daardoor een hoge kilometerstand bij een nog nette carrosserie. Vraag dus naar de onderhoudshistorie en kijk verder dan de buitenkant: gebruikssporen in de laadruimte en op het interieur, de werking van de schuifdeur(en), en de staat van het roetfilter bij een bus die vooral kort gereden heeft. Bij een Tourer loopt u ook de achterbanken, gordels en ruiten na. De emissieklasse bepaalt of u met de bus een zero-emissiezone in mag.",
    ],
  },
];

export function getBedrijfswagenmodel(slug: string): Bedrijfswagenmodel | undefined {
  return bedrijfswagenmodellen.find((m) => m.slug === slug);
}
