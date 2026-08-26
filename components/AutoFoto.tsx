"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Een autofoto die niet stukgaat als de opslag hem niet levert.
 *
 * WAAROM DIT ER IS
 * De foto's staan bij een opslagdienst buiten de website. Gaat daar iets mis — de opslag
 * geblokkeerd, een bestand weg, een storing — dan kreeg de bezoeker het kapotte-plaatje
 * icoontje van de browser te zien. Op een pagina waar je auto's verkoopt is dat het
 * slechtst denkbare beeld: het lijkt alsof de hele site niet werkt, en dan gaat iemand
 * niet alsnog bellen.
 *
 * Deze component valt in dat geval terug op precies dezelfde weergave als een auto die
 * nog helemaal geen foto's heeft: het donkere vlak met de merkletters. Dat oogt bewust,
 * niet stuk. De auto blijft vindbaar, de prijs blijft staan, en het scheelt de bezoeker
 * niets.
 *
 * De terugval geldt per foto. Doet foto 3 het niet, dan blijven 1, 2 en 4 gewoon staan.
 */
export default function AutoFoto({
  src,
  alt,
  merk,
  sizes,
  className = "object-cover",
  priority = false,
  lui = false,
  /** Hoe groot de merkletters in het terugvalvlak zijn. Klein voor duimnagels. */
  tekstGrootte = 180,
}: {
  src: string | undefined;
  alt: string;
  /** Waar de merkletters vandaan komen als de foto het niet doet. */
  merk: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  lui?: boolean;
  tekstGrootte?: number;
}) {
  const [mislukt, setMislukt] = useState(false);

  if (!src || mislukt) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#001337" }}
        aria-label={alt}
      >
        <span
          className="font-bold select-none leading-none"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: tekstGrootte,
            color: "rgba(255,255,255,0.06)",
          }}
        >
          {(merk || "JG").slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      // priority en loading sluiten elkaar uit; alleen de een of de ander meegeven.
      {...(priority ? { priority: true } : lui ? { loading: "lazy" as const } : {})}
      onError={() => setMislukt(true)}
    />
  );
}
