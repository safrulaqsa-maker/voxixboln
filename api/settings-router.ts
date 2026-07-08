import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getUserSettings, upsertUserSettings } from "./queries/settings";

export const settingsRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    return getUserSettings(ctx.user.id);
  }),

  update: authedQuery
    .input(z.object({
      theme: z.enum(["dark", "light"]).optional(),
      defaultModel: z.string().optional(),
      defaultMode: z.string().optional(),
      fontSize: z.enum(["small", "medium", "large"]).optional(),
      language: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await upsertUserSettings({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),
});
