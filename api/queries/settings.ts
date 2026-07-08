import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function getUserSettings(userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.userSettings)
    .where(eq(schema.userSettings.userId, userId))
    .limit(1);
  return rows.at(0);
}

export async function upsertUserSettings(data: schema.InsertUserSetting) {
  const existing = await getUserSettings(data.userId);
  if (existing) {
    await getDb()
      .update(schema.userSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.userSettings.userId, data.userId));
  } else {
    await getDb().insert(schema.userSettings).values(data);
  }
}
