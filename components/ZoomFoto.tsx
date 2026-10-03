"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

/**
 * Een foto in de vergroting waarop je kunt inzoomen.
 *
 * WAAROM
 * Een koper wil krasjes, banden en het interieur van dichtbij zien. De vergroting liet de
 * foto alleen groter zien; inzoomen kon niet, en op de telefoon ving de overlay het
 * knijpen af. Nu kan het op elke manier die mensen gewend zijn:
 *   • tikken of klikken op een plek → inzoomen op die plek, nog een keer → terug;
 *   • knijpen met twee vingers (telefoon) of scrollen met het muiswiel (computer);
 *   • ingezoomd slepen om rond te kijken;
 *   • de + en − knoppen onderin, voor wie liever drukt.
 * Niet ingezoomd veegt een veeg naar links of rechts naar de volgende of vorige foto.
 *
 * Remount per foto (key={src} bij de aanroeper): dan begint elke foto weer op 100%
 * zonder dat hier iets teruggezet hoeft te worden.
 *
 * Bewust zonder bibliotheek: pointer-events doen muis, pen en vingers in één keer.
 */

const MAX = 4;
const KLIK_ZOOM = 2.5;

type Punt = { x: number; y: number };

export default function ZoomFoto({
  src,
  alt,
  onVorige,
  onVolgende,
}: {
  src: string;
  alt: string;
  onVorige: () => void;
  onVolgende: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState<Punt>({ x: 0, y: 0 });
  // Tijdens slepen/knijpen geen animatie: de foto moet je vinger direct volgen.
  const [bezig, setBezig] = useState(false);
  const vakRef = useRef<HTMLDivElement>(null);

  // Vingers/muis die nu op de foto staan, en waar het gebaar begon.
  const pointers = useRef(new Map<number, Punt>());
  const begin = useRef<{ zoom: number; pos: Punt; afstand: number; punt: Punt; bewogen: boolean } | null>(null);

  /** Ingezoomd mag je niet verder schuiven dan de rand van de foto. */
  const binnenRand = (p: Punt, z: number): Punt => {
    const vak = vakRef.current?.getBoundingClientRect();
    if (!vak) return p;
    const maxX = ((z - 1) * vak.width) / 2;
    const maxY = ((z - 1) * vak.height) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, p.x)), y: Math.max(-maxY, Math.min(maxY, p.y)) };
  };

  /** Plek op het scherm → afstand tot het midden van de foto. */
  const tovMidden = (clientX: number, clientY: number): Punt => {
    const vak = vakRef.current!.getBoundingClientRect();
    return { x: clientX - (vak.left + vak.width / 2), y: clientY - (vak.top + vak.height / 2) };
  };

  /**
   * Zoomen rond een punt, zodat wat onder je vinger of muis staat daar blijft staan.
   * Een punt c op het scherm hoort bij fotopunt (c − pos) / zoom; dat moet na het zoomen
   * nog steeds onder c liggen.
   */
  const zoomRond = (nieuw: number, c: Punt, vanZoom = zoom, vanPos = pos) => {
    const z = Math.max(1, Math.min(MAX, nieuw));
    const p = { x: c.x - ((c.x - vanPos.x) * z) / vanZoom, y: c.y - ((c.y - vanPos.y) * z) / vanZoom };
    setZoom(z);
    setPos(z === 1 ? { x: 0, y: 0 } : binnenRand(p, z));
  };

  // Muiswiel. Los gekoppeld omdat React wheel-events passief maakt, en dan kan het
  // scrollen van de pagina erachter niet worden tegengehouden.
  useEffect(() => {
    const vak = vakRef.current;
    if (!vak) return;
    const wiel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRond(zoom * (e.deltaY < 0 ? 1.2 : 1 / 1.2), tovMidden(e.clientX, e.clientY));
    };
    vak.addEventListener("wheel", wiel, { passive: false });
    return () => vak.removeEventListener("wheel", wiel);
  });

  const afstand = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const midden = () => {
    const [a, b] = [...pointers.current.values()];
    return tovMidden((a.x + b.x) / 2, (a.y + b.y) / 2);
  };

  const omlaag = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setBezig(true);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    begin.current = {
      zoom,
      pos,
      afstand: pointers.current.size === 2 ? afstand() : 0,
      punt: { x: e.clientX, y: e.clientY },
      // Een tweede vinger maakt er een knijpgebaar van, nooit een tik.
      bewogen: pointers.current.size > 1,
    };
  };

  const beweeg = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !begin.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const b = begin.current;

    if (pointers.current.size === 2 && b.afstand > 0) {
      zoomRond((b.zoom * afstand()) / b.afstand, midden(), b.zoom, b.pos);
      return;
    }
    const dx = e.clientX - b.punt.x;
    const dy = e.clientY - b.punt.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) b.bewogen = true;
    if (zoom > 1) setPos(binnenRand({ x: b.pos.x + dx, y: b.pos.y + dy }, zoom));
  };

  const omhoog = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const b = begin.current;
    if (!b || pointers.current.size > 0) return;
    setBezig(false);
    begin.current = null;

    const dx = e.clientX - b.punt.x;
    if (!b.bewogen) {
      // Tik/klik: inzoomen op die plek, of terug naar het geheel.
      zoomRond(zoom > 1 ? 1 : KLIK_ZOOM, tovMidden(e.clientX, e.clientY));
    } else if (zoom === 1 && Math.abs(dx) > 50) {
      if (dx < 0) onVolgende();
      else onVorige();
    }
  };

  const knop = (richting: 1 | -1) => (e: React.MouseEvent) => {
    e.stopPropagation();
    zoomRond(zoom + richting * 0.75, { x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
      <div
        ref={vakRef}
        className="relative overflow-hidden select-none"
        style={{ touchAction: "none", cursor: zoom > 1 ? "grab" : "zoom-in" }}
        onPointerDown={omlaag}
        onPointerMove={beweeg}
        onPointerUp={omhoog}
        onPointerCancel={omhoog}
      >
        {/* Ingezoomd vraagt hij een grotere variant op ("250vw"), anders wordt het
            inzoomen alleen een vergroting van dezelfde pixels. */}
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          sizes={zoom > 1 ? "250vw" : "90vw"}
          priority
          draggable={false}
          className="block w-auto h-auto max-w-[90vw] max-h-[78vh] md:max-h-[82vh] object-contain rounded-none"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
            transition: bezig ? "none" : "transform 180ms ease-out",
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={knop(-1)}
          disabled={zoom <= 1}
          aria-label="Uitzoomen"
          className="w-10 h-10 flex items-center justify-center rounded-none transition-colors hover:bg-white/20 disabled:opacity-30"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <Minus size={16} color="white" />
        </button>
        <span className="w-14 text-center text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={knop(1)}
          disabled={zoom >= MAX}
          aria-label="Inzoomen"
          className="w-10 h-10 flex items-center justify-center rounded-none transition-colors hover:bg-white/20 disabled:opacity-30"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <Plus size={16} color="white" />
        </button>
      </div>
    </div>
  );
}
