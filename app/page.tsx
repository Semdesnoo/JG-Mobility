import { getAutos } from "@/lib/autos-db";
import HomeClient from "./HomeClient";

export const revalidate = 300;

export default async function Page() {
  const all = await getAutos();
  // Toon de 3 meest recente niet-verkochte auto's
  const autos = all.filter((a) => !a.verkocht).slice(0, 3);
  return <HomeClient autos={autos} />;
}
