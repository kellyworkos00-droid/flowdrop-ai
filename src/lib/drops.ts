import { mockDrops } from "@/lib/mocks/drops";
import type { DropItem } from "@/types/drop";

export async function getDrops(): Promise<DropItem[]> {
  // TODO: replace with real API call
  return Promise.resolve(mockDrops);
}

export async function getDropById(id: string): Promise<DropItem | undefined> {
  // TODO: replace with real API call
  return Promise.resolve(mockDrops.find((drop) => drop.id === id));
}
