import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Cpu,
  RotateCcw,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { useSettingsStore, modeLabels, type AIMode } from "@/store/settingsStore";
import { trpc } from "@/providers/trpc";
import { Slider } from "@/components/ui/slider";

export default function SettingsPanel() {
  const {
    model,
    mode,
    temperature,
    maxTokens,
    contextWindow,
    systemPrompt,
    settingsPanelOpen,
    setSettingsPanelOpen,
    setModel,
    setMode,
    setTemperature,
    setMaxTokens,
    setContextWindow,
    setSystemPrompt,
    resetSystemPrompt,
  } = useSettingsStore();

  const [modelSearch, setModelSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: models } = trpc.model.list.useQuery();
  const { data: categories } = trpc.model.getCategories.useQuery();
  const createPreset = trpc.preset.create.useMutation();

  const contextOptions = ["4K", "8K", "16K", "32K", "128K", "200K"];

  const filteredModels = models?.filter((m) => {
    const matchesSearch =
      !modelSearch ||
      m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(modelSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSavePreset = () => {
    const config = JSON.stringify({
      model,
      mode,
      temperature,
      maxTokens,
      contextWindow,
      systemPrompt,
    });
    createPreset.mutate(
      {
        name: `${modeLabels[mode].label} Mode`,
        configJson: config,
      },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        },
      }
    );
  };

  if (!settingsPanelOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setSettingsPanelOpen(true)}
        className="fixed right-3 top-3 z-50 p-2 rounded-xl liquid-glass hover:bg-[#EAE0C8]/10 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
      </motion.button>
    );
  }

  return (
    <motion.aside
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-[320px] liquid-glass z-40 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A35]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#D4AF37]" />
          <span className="font-heading text-lg font-semibold text-[#EAE0C8]">
            AI Settings
          </span>
        </div>
        <button
          onClick={() => setSettingsPanelOpen(false)}
          className="p-1.5 rounded-lg hover:bg-[#EAE0C8]/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-[#8A8A95]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-6">
        {/* Model Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A95]">
            Model
          </h3>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  selectedCategory === "All"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                    : "bg-[#13131A] text-[#8A8A95] border border-[#2A2A35] hover:border-[#D4AF37]/30"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                      : "bg-[#13131A] text-[#8A8A95] border border-[#2A2A35] hover:border-[#D4AF37]/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A95]" />
            <input
              type="text"
              placeholder="Search 98 models..."
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#13131A] border border-[#2A2A35] rounded-xl text-xs text-[#EAE0C8] placeholder-[#8A8A95] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>

          {/* Model List */}
          <div className="max-h-[200px] overflow-y-auto scrollbar-thin space-y-1 pr-1">
            <AnimatePresence>
              {filteredModels?.map((m) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setModel(m.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                    model === m.id
                      ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "bg-[#13131A]/50 border border-transparent hover:border-[#2A2A35]"
                  }`}
                >
                  <span className="text-sm">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs font-medium truncate ${
                          model === m.id ? "text-[#D4AF37]" : "text-[#EAE0C8]"
                        }`}
                      >
                        {m.name}
                      </p>
                      {m.recommended && (
                        <Sparkles className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#8A8A95] truncate">
                      {m.parameters} · {m.contextWindow}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A95]">
            Mode
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.entries(modeLabels) as [AIMode, typeof modeLabels.smart][]).map(
              ([key, { label, emoji, description }]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl text-left transition-all ${
                    mode === key
                      ? "bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                      : "bg-[#13131A]/50 border border-transparent hover:border-[#2A2A35]"
                  }`}
                >
                  <span className="text-sm">{emoji}</span>
                  <span
                    className={`text-[11px] font-medium ${
                      mode === key ? "text-[#D4AF37]" : "text-[#EAE0C8]"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[9px] text-[#8A8A95] leading-tight">
                    {description}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A95]">
            Parameters
          </h3>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[#EAE0C8]">Temperature</label>
              <span className="text-xs text-[#D4AF37] font-mono">
                {temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={0}
              max={2}
              step={0.1}
              className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_.bg-primary]:bg-[#D4AF37]"
            />
            <div className="flex justify-between text-[9px] text-[#8A8A95]">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[#EAE0C8]">Max Tokens</label>
              <span className="text-xs text-[#D4AF37] font-mono">
                {maxTokens}
              </span>
            </div>
            <Slider
              value={[maxTokens]}
              onValueChange={([v]) => setMaxTokens(v)}
              min={256}
              max={8192}
              step={256}
              className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_.bg-primary]:bg-[#D4AF37]"
            />
          </div>

          {/* Context Window */}
          <div className="space-y-2">
            <label className="text-xs text-[#EAE0C8]">Context Window</label>
            <div className="flex flex-wrap gap-1">
              {contextOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setContextWindow(opt)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    contextWindow === opt
                      ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                      : "bg-[#13131A] text-[#8A8A95] border border-[#2A2A35] hover:border-[#D4AF37]/20"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A95]">
              System Prompt
            </h3>
            <button
              onClick={resetSystemPrompt}
              className="p-1 rounded hover:bg-[#EAE0C8]/10 transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-3 h-3 text-[#8A8A95]" />
            </button>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-[#13131A] border border-[#2A2A35] rounded-xl text-xs text-[#EAE0C8] placeholder-[#8A8A95] focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none font-body leading-relaxed"
          />
        </div>

        {/* Save Preset */}
        <button
          onClick={handleSavePreset}
          disabled={createPreset.isPending}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#13131A] border border-[#2A2A35] hover:border-[#D4AF37]/40 rounded-xl text-sm text-[#EAE0C8] transition-all hover:bg-[#D4AF37]/5"
        >
          <Bookmark className="w-4 h-4 text-[#D4AF37]" />
          {saveSuccess ? "Saved!" : createPreset.isPending ? "Saving..." : "Save as Preset"}
        </button>
      </div>
    </motion.aside>
  );
}
