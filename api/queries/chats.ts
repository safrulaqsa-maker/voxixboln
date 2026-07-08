import { eq, desc, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createChat(data: schema.InsertChat) {
  const result = await getDb().insert(schema.chats).values(data);
  return result;
}

export async function getChatsByUser(userId: number) {
  return getDb()
    .select()
    .from(schema.chats)
    .where(eq(schema.chats.userId, userId))
    .orderBy(desc(schema.chats.updatedAt));
}

export async function getChatById(id: number, userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.chats)
    .where(and(eq(schema.chats.id, id), eq(schema.chats.userId, userId)))
    .limit(1);
  return rows.at(0);
}

export async function updateChat(id: number, userId: number, data: Partial<schema.InsertChat>) {
  await getDb()
    .update(schema.chats)
    .set(data)
    .where(and(eq(schema.chats.id, id), eq(schema.chats.userId, userId)));
}

export async function deleteChat(id: number, userId: number) {
  await getDb()
    .delete(schema.chats)
    .where(and(eq(schema.chats.id, id), eq(schema.chats.userId, userId)));
}
