import { Suspense } from "react";
import AanbodClient from "./AanbodClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aanbod | JG Mobility",
  description: "Bekijk ons huidige aanbod van premium auto's.",
};

export default function AanbodPage() {
  return (
    <Suspense>
      <AanbodClient />
    </Suspense>
  );
}
