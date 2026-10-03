/**
 * Losse controle van lib/lease.ts — draaien met: npx tsx lib/lease.check.ts
 *
 * De verwachte bedragen komen rechtstreeks uit de calculator van In Lease Auto's
 * (calculator.inleaseautos.nl/?dealer_id=13504&price=…&marge=…, standaardinstellingen).
 * Wijkt er één af, dan heeft In Lease zijn tarieven aangepast: werk lib/lease.ts bij.
 */

import assert from "node:assert/strict";
import { leaseMaandbedrag } from "./lease";

const marge = (prijs: number) => ({ prijs, btw: "Marge" });
const btwAuto = (prijs: number) => ({ prijs, btw: "BTW" });

assert.equal(leaseMaandbedrag(marge(20000)), 374, "€ 20.000 marge");
assert.equal(leaseMaandbedrag(btwAuto(36300)), 509, "€ 36.300 btw-auto (btw vooraf)");
assert.equal(leaseMaandbedrag(marge(8000)), 149, "€ 8.000 marge");
assert.equal(leaseMaandbedrag(marge(45000)), 777, "€ 45.000 marge (lage rente)");

assert.equal(leaseMaandbedrag(marge(4950)), null, "onder de drempel geen lease");
assert.equal(leaseMaandbedrag({ ...marge(20000), verkocht: true }), null, "verkocht: geen lease");
assert.equal(leaseMaandbedrag({ ...marge(20000), leaseMogelijk: false }), null, "uitgezet in dashboard");

console.log("lib/lease.ts — alle controles geslaagd.");
