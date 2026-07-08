import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createPreset(data: schema.InsertPreset) {
  const result = await getDb().insert(schema.presets).values(data);
  return result;
}

export async function getPresetsByUser(userId: number) {
  return getDb()
    .select()
    .from(schema.presets)
    .where(eq(schema.presets.userId, userId))
    .orderBy(schema.presets.createdAt);
}

export async function updatePreset(id: number, userId: number, data: Partial<schema.InsertPreset>) {
  await getDb()
    .update(schema.presets)
    .set(data)
    .where(and(eq(schema.presets.id, id), eq(schema.presets.userId, userId)));
}

export async function deletePreset(id: number, userId: number) {
  await getDb()
    .delete(schema.presets)
    .where(and(eq(schema.presets.id, id), eq(schema.presets.userId, userId)));
}
