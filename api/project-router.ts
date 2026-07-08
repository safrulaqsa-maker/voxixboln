import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { createProject, getProjectsByUser, getProjectById, updateProject, deleteProject } from "./queries/projects";

export const projectRouter = createRouter({
  create: authedQuery
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      tags: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await createProject({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId), ...input };
    }),

  list: authedQuery.query(async ({ ctx }) => {
    return getProjectsByUser(ctx.user.id);
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return getProjectById(input.id, ctx.user.id);
    }),

  update: authedQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      tags: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateProject(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteProject(input.id, ctx.user.id);
      return { success: true };
    }),
});
