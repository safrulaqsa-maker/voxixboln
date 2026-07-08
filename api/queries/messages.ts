import { eq, asc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createMessage(data: schema.InsertMessage) {
  const result = await getDb().insert(schema.messages).values(data);
  return result;
}

export async function getMessagesByChat(chatId: number) {
  return getDb()
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.chatId, chatId))
    .orderBy(asc(schema.messages.createdAt));
}

export async function deleteMessagesByChat(chatId: number) {
  await getDb()
    .delete(schema.messages)
    .where(eq(schema.messages.chatId, chatId));
}
