import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AIMode =
  | "smart"
  | "normal"
  | "coding"
  | "thinking"
  | "creative"
  | "analysis"
  | "conversation"
  | "academic"
  | "security"
  | "multilingual";

export interface AISettings {
  model: string;
  mode: AIMode;
  temperature: number;
  maxTokens: number;
  contextWindow: string;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
}

const defaultSystemPrompts: Record<AIMode, string> = {
  smart: "Anda adalah asisten AI yang sangat cerdas. Berikan respons mendalam, analitis, dan terstruktur dengan bahasa profesional.",
  normal: "Anda adalah asisten AI yang helpful. Berikan respons seimbang antara kecepatan dan kualitas, langsung dan ringkas.",
  coding: "Anda adalah expert programmer. Berikan kode production-ready dengan best practices, error handling, komentar, dan contoh penggunaan.",
  thinking: "Pikirkan langkah demi langkah. Uraikan setiap langkah, pertimbangkan berbagai sudut pandang, verifikasi, dan berikan kesimpulan.",
  creative: "Anda adalah kreator kreatif. Berikan ide imaginative, out of the box, ekspresif, dan eksplorasi ide tidak konvensional.",
  analysis: "Anda adalah analis data. Berikan analisis data-driven, terstruktur, dengan tabel, bullet points, dan kategorisasi.",
  conversation: "Anda adalah teman berbincang yang santai namun informatif. Gunakan bahasa percakapan yang natural dan ramah.",
  academic: "Anda adalah akademisi. Berikan respons formal, siap kutipan, dengan definisi istilah dan kerangka teoritis.",
  security: "Anda adalah security auditor. Identifikasi kerentanan, berikan CVE references, dan rekomendasi perbaikan.",
  multilingual: "Anda adalah poliglot. Deteksi bahasa pengguna dan balas dalam bahasa yang sama dengan nuansa budaya yang tepat.",
};

export const modeLabels: Record<AIMode, { label: string; emoji: string; description: string }> = {
  smart: { label: "Pintar", emoji: "🧠", description: "Deep reasoning, verbose, analitis" },
  normal: { label: "Biasa", emoji: "⚡", description: "Balance speed & quality, ringkas" },
  coding: { label: "Koding", emoji: "💻", description: "Code-focused, production-ready" },
  thinking: { label: "Thinking", emoji: "🤔", description: "Step-by-step chain-of-thought" },
  creative: { label: "Kreatif", emoji: "🎨", description: "Imaginative, out of the box" },
  analysis: { label: "Analisis", emoji: "📊", description: "Data-driven, structured" },
  conversation: { label: "Percakapan", emoji: "🗣️", description: "Casual, conversational" },
  academic: { label: "Akademik", emoji: "📝", description: "Formal, citation-ready" },
  security: { label: "Keamanan", emoji: "🔒", description: "Security audit mode" },
  multilingual: { label: "Multibahasa", emoji: "🌍", description: "Auto-detect language" },
};

interface SettingsState extends AISettings {
  theme: "dark" | "light";
  sidebarOpen: boolean;
  settingsPanelOpen: boolean;

  setModel: (model: string) => void;
  setMode: (mode: AIMode) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setContextWindow: (window: string) => void;
  setSystemPrompt: (prompt: string) => void;
  resetSystemPrompt: () => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleSidebar: () => void;
  toggleSettingsPanel: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsPanelOpen: (open: boolean) => void;
  getSystemPromptForMode: () => string;
}

const defaultSettings: AISettings = {
  model: "genesis-7b",
  mode: "smart",
  temperature: 0.7,
  maxTokens: 4096,
  contextWindow: "8K",
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: defaultSystemPrompts.smart,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      theme: "dark",
      sidebarOpen: true,
      settingsPanelOpen: true,

      setModel: (model) => set({ model }),
      setMode: (mode) =>
        set({
          mode,
          systemPrompt: defaultSystemPrompts[mode],
        }),
      setTemperature: (temperature) => set({ temperature }),
      setMaxTokens: (maxTokens) => set({ maxTokens }),
      setContextWindow: (contextWindow) => set({ contextWindow }),
      setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
      resetSystemPrompt: () =>
        set({ systemPrompt: defaultSystemPrompts[get().mode] }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSettingsPanel: () =>
        set((state) => ({ settingsPanelOpen: !state.settingsPanelOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
      getSystemPromptForMode: () => defaultSystemPrompts[get().mode],
    }),
    {
      name: "genesis-settings",
      partialize: (state) => ({
        model: state.model,
        mode: state.mode,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        contextWindow: state.contextWindow,
        theme: state.theme,
        systemPrompt: state.systemPrompt,
        topP: state.topP,
        frequencyPenalty: state.frequencyPenalty,
        presencePenalty: state.presencePenalty,
      }),
    }
  )
);
