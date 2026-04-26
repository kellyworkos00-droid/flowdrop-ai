"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DropCard } from "@/components/ui/drop-card";
import { getDrops } from "@/lib/drops";
import { useDropsStore } from "@/store/useDropsStore";

export default function DropsPage() {
  const { drops, selectDrop, setDrops } = useDropsStore();
  const query = useQuery({ queryKey: ["drops"], queryFn: getDrops });

  useEffect(() => {
    if (query.data) {
      setDrops(query.data);
    }
  }, [query.data, setDrops]);

  return (
    <section>
      <h2 className="mb-4 font-[var(--font-display)] text-[22px] font-semibold">My Drops</h2>
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} onClick={() => selectDrop(drop.id)} />
      ))}
    </section>
  );
}
