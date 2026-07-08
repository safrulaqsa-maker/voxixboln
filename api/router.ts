import { authRouter } from "./auth-router";
import { chatRouter } from "./chat-router";
import { modelRouter } from "./model-router";
import { projectRouter } from "./project-router";
import { presetRouter } from "./preset-router";
import { settingsRouter } from "./settings-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  chat: chatRouter,
  model: modelRouter,
  project: projectRouter,
  preset: presetRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
