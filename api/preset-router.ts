import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { createPreset, getPresetsByUser, updatePreset, deletePreset } from "./queries/presets";

export const presetRouter = createRouter({
  create: authedQuery
    .input(z.object({
      name: z.string().min(1).max(255),
      configJson: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await createPreset({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId), ...input };
    }),

  list: authedQuery.query(async ({ ctx }) => {
    return getPresetsByUser(ctx.user.id);
  }),

  update: authedQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      configJson: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updatePreset(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deletePreset(input.id, ctx.user.id);
      return { success: true };
    }),
});
