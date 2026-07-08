import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createProject(data: schema.InsertProject) {
  const result = await getDb().insert(schema.projects).values(data);
  return result;
}

export async function getProjectsByUser(userId: number) {
  return getDb()
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.userId, userId))
    .orderBy(schema.projects.updatedAt);
}

export async function getProjectById(id: number, userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.projects)
    .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, userId)))
    .limit(1);
  return rows.at(0);
}

export async function updateProject(id: number, userId: number, data: Partial<schema.InsertProject>) {
  await getDb()
    .update(schema.projects)
    .set(data)
    .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, userId)));
}

export async function deleteProject(id: number, userId: number) {
  await getDb()
    .delete(schema.projects)
    .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, userId)));
}
