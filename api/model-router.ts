import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export interface AIModel {
  id: string;
  name: string;
  category: string;
  description: string;
  parameters: string;
  contextWindow: string;
  recommended?: boolean;
  emoji: string;
}

const models: AIModel[] = [
  // Kategori 1 — General Purpose (10)
  { id: "genesis-7b", name: "Genesis 7B", category: "General Purpose", description: "Model flagship, seimbang cepat & pintar", parameters: "7B", contextWindow: "8K", recommended: true, emoji: "⭐" },
  { id: "genesis-13b", name: "Genesis 13B", category: "General Purpose", description: "Lebih dalam, reasoning lebih kuat", parameters: "13B", contextWindow: "16K", emoji: "🧠" },
  { id: "genesis-33b", name: "Genesis 33B", category: "General Purpose", description: "Kelas enterprise, konteks 32K", parameters: "33B", contextWindow: "32K", recommended: true, emoji: "🏢" },
  { id: "mistral-7b", name: "Mistral 7B", category: "General Purpose", description: "Cepat, efisien, bagus untuk percakapan umum", parameters: "7B", contextWindow: "8K", emoji: "⚡" },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", category: "General Purpose", description: "MoE 8 ahli, performa setara 70B", parameters: "47B", contextWindow: "32K", recommended: true, emoji: "🔥" },
  { id: "llama-3-8b", name: "Llama 3 8B", category: "General Purpose", description: "Model Meta terbaru, serbaguna", parameters: "8B", contextWindow: "8K", emoji: "🦙" },
  { id: "llama-3-70b", name: "Llama 3 70B", category: "General Purpose", description: "Model besar Meta, reasoning superior", parameters: "70B", contextWindow: "128K", emoji: "🦙" },
  { id: "qwen-2-7b", name: "Qwen 2 7B", category: "General Purpose", description: "Model Alibaba, multilingual", parameters: "7B", contextWindow: "32K", emoji: "🌐" },
  { id: "yi-34b", name: "Yi 34B", category: "General Purpose", description: "Model 01.AI, konteks 200K", parameters: "34B", contextWindow: "200K", emoji: "📜" },
  { id: "deepseek-67b", name: "DeepSeek 67B", category: "General Purpose", description: "Model DeepSeek, reasoning matematika kuat", parameters: "67B", contextWindow: "16K", emoji: "🔢" },
  // Kategori 2 — Coding Specialist (20)
  { id: "deepseek-coder-33b", name: "DeepSeek Coder 33B", category: "Coding", description: "Raja koding, semua bahasa pemrograman", parameters: "33B", contextWindow: "16K", recommended: true, emoji: "💻" },
  { id: "code-llama-34b", name: "Code Llama 34B", category: "Coding", description: "Spesialis kode dari Meta", parameters: "34B", contextWindow: "16K", emoji: "🦙" },
  { id: "starcoder-2-15b", name: "StarCoder 2 15B", category: "Coding", description: "BigCode project, 600+ bahasa", parameters: "15B", contextWindow: "16K", emoji: "⭐" },
  { id: "wizard-coder-33b", name: "Wizard Coder 33B", category: "Coding", description: "Pelatihan khusus algoritma & struktur data", parameters: "33B", contextWindow: "16K", emoji: "🧙" },
  { id: "magic-coder-7b", name: "Magic Coder 7B", category: "Coding", description: "Cepat, bagus untuk prototyping", parameters: "7B", contextWindow: "8K", emoji: "✨" },
  { id: "phind-34b", name: "Phind 34B", category: "Coding", description: "Code + web search reasoning", parameters: "34B", contextWindow: "16K", emoji: "🔍" },
  { id: "sql-coder-7b", name: "SQL Coder 7B", category: "Coding", description: "Spesialis SQL, ERD, optimasi query", parameters: "7B", contextWindow: "8K", emoji: "🗄️" },
  { id: "bash-coder-7b", name: "Bash Coder 7B", category: "Coding", description: "Shell scripting, DevOps, sysadmin", parameters: "7B", contextWindow: "8K", emoji: "🖥️" },
  { id: "python-dev-13b", name: "Python Dev 13B", category: "Coding", description: "Python expert: Django, FastAPI, Flask, ML", parameters: "13B", contextWindow: "16K", emoji: "🐍" },
  { id: "frontend-dev-7b", name: "Frontend Dev 7B", category: "Coding", description: "React, Vue, Angular, Tailwind, TypeScript", parameters: "7B", contextWindow: "8K", emoji: "⚛️" },
  { id: "rust-engineer-7b", name: "Rust Engineer 7B", category: "Coding", description: "Rust systems programming", parameters: "7B", contextWindow: "8K", emoji: "🦀" },
  { id: "go-dev-7b", name: "Go Dev 7B", category: "Coding", description: "Go backend & microservices", parameters: "7B", contextWindow: "8K", emoji: "🐹" },
  { id: "java-architect-13b", name: "Java Architect 13B", category: "Coding", description: "Spring Boot, enterprise Java", parameters: "13B", contextWindow: "16K", emoji: "☕" },
  { id: "cpp-master-7b", name: "C++ Master 7B", category: "Coding", description: "C++ performa tinggi, embedded", parameters: "7B", contextWindow: "8K", emoji: "⚙️" },
  { id: "swift-dev-7b", name: "Swift Dev 7B", category: "Coding", description: "iOS/macOS development", parameters: "7B", contextWindow: "8K", emoji: "🍎" },
  { id: "kotlin-android-7b", name: "Kotlin Android 7B", category: "Coding", description: "Android native development", parameters: "7B", contextWindow: "8K", emoji: "🤖" },
  { id: "solidity-smart-7b", name: "Solidity Smart 7B", category: "Coding", description: "Smart contracts, Web3, blockchain", parameters: "7B", contextWindow: "8K", emoji: "⛓️" },
  { id: "devops-engineer-7b", name: "DevOps Engineer 7B", category: "Coding", description: "Docker, K8s, Terraform, CI/CD", parameters: "7B", contextWindow: "8K", emoji: "🚀" },
  { id: "security-auditor-13b", name: "Security Auditor 13B", category: "Coding", description: "Code review, vulnerability scanning", parameters: "13B", contextWindow: "16K", emoji: "🔒" },
  { id: "database-guru-7b", name: "Database Guru 7B", category: "Coding", description: "PostgreSQL, MySQL, MongoDB, Redis", parameters: "7B", contextWindow: "8K", emoji: "🗃️" },
  // Kategori 3 — Reasoning & Thinking (15)
  { id: "genesis-think-33b", name: "Genesis Think 33B", category: "Reasoning", description: "Model reasoning lambat-tapi-dalam", parameters: "33B", contextWindow: "32K", emoji: "🤔" },
  { id: "deepseek-r1-7b", name: "DeepSeek R1 7B", category: "Reasoning", description: "Chain-of-thought native", parameters: "7B", contextWindow: "8K", emoji: "🔗" },
  { id: "qwen-qwq-32b", name: "Qwen QwQ 32B", category: "Reasoning", description: "Qwen dengan reasoning panjang", parameters: "32B", contextWindow: "32K", emoji: "❓" },
  { id: "reflection-70b", name: "Reflection 70B", category: "Reasoning", description: "Self-reflection & correction loop", parameters: "70B", contextWindow: "128K", emoji: "🪞" },
  { id: "auto-gpt-agent-13b", name: "Auto-GPT Agent 13B", category: "Reasoning", description: "Agentic AI, task decomposition", parameters: "13B", contextWindow: "16K", emoji: "🤖" },
  { id: "logic-pro-7b", name: "Logic Pro 7B", category: "Reasoning", description: "Logika formal, matematika diskrit", parameters: "7B", contextWindow: "8K", emoji: "🧮" },
  { id: "theorem-prover-7b", name: "Theorem Prover 7B", category: "Reasoning", description: "Pembuktian teorema matematika", parameters: "7B", contextWindow: "8K", emoji: "📐" },
  { id: "strategy-mind-13b", name: "Strategy Mind 13B", category: "Reasoning", description: "Game theory, strategic planning", parameters: "13B", contextWindow: "16K", emoji: "♟️" },
  { id: "decision-tree-33b", name: "Decision Tree 33B", category: "Reasoning", description: "Analisis keputusan multi-kriteria", parameters: "33B", contextWindow: "32K", emoji: "🌳" },
  { id: "puzzle-solver-7b", name: "Puzzle Solver 7B", category: "Reasoning", description: "Teka-teki, puzzle logika", parameters: "7B", contextWindow: "8K", emoji: "🧩" },
  { id: "riddle-master-7b", name: "Riddle Master 7B", category: "Reasoning", description: "Tebak-tebakan & lateral thinking", parameters: "7B", contextWindow: "8K", emoji: "❓" },
  { id: "debate-champion-13b", name: "Debate Champion 13B", category: "Reasoning", description: "Argumentasi & debat", parameters: "13B", contextWindow: "16K", emoji: "🎤" },
  { id: "philosophy-deep-33b", name: "Philosophy Deep 33B", category: "Reasoning", description: "Filsafat, etika, metafisika", parameters: "33B", contextWindow: "32K", emoji: "📚" },
  { id: "ethics-advisor-7b", name: "Ethics Advisor 7B", category: "Reasoning", description: "Dilema etis & moral reasoning", parameters: "7B", contextWindow: "8K", emoji: "⚖️" },
  { id: "future-forecaster-13b", name: "Future Forecaster 13B", category: "Reasoning", description: "Prediksi tren & analisis masa depan", parameters: "13B", contextWindow: "16K", emoji: "🔮" },
  // Kategori 4 — Creative & Writing (15)
  { id: "genesis-writer-33b", name: "Genesis Writer 33B", category: "Creative", description: "Novel, cerpen, skenario film", parameters: "33B", contextWindow: "32K", recommended: true, emoji: "✍️" },
  { id: "poet-laureate-7b", name: "Poet Laureate 7B", category: "Creative", description: "Puisi dalam 50+ bahasa", parameters: "7B", contextWindow: "8K", emoji: "🌹" },
  { id: "screenwriter-13b", name: "Screenwriter 13B", category: "Creative", description: "Format skenario Hollywood", parameters: "13B", contextWindow: "16K", emoji: "🎬" },
  { id: "copywriter-pro-7b", name: "Copywriter Pro 7B", category: "Creative", description: "Copywriting, sales page, iklan", parameters: "7B", contextWindow: "8K", emoji: "📢" },
  { id: "storyteller-7b", name: "Storyteller 7B", category: "Creative", description: "Dongeng, cerita anak, fabel", parameters: "7B", contextWindow: "8K", emoji: "📖" },
  { id: "horror-master-7b", name: "Horror Master 7B", category: "Creative", description: "Cerita horor & thriller psikologis", parameters: "7B", contextWindow: "8K", emoji: "👻" },
  { id: "romance-author-13b", name: "Romance Author 13B", category: "Creative", description: "Novel romantis & drama", parameters: "13B", contextWindow: "16K", emoji: "💕" },
  { id: "sci-fi-world-33b", name: "Sci-Fi World 33B", category: "Creative", description: "World-building sci-fi & fantasy", parameters: "33B", contextWindow: "32K", emoji: "🚀" },
  { id: "comedy-writer-7b", name: "Comedy Writer 7B", category: "Creative", description: "Stand-up, sketsa komedi", parameters: "7B", contextWindow: "8K", emoji: "😂" },
  { id: "song-lyricist-7b", name: "Song Lyricist 7B", category: "Creative", description: "Lirik lagu semua genre", parameters: "7B", contextWindow: "8K", emoji: "🎵" },
  { id: "rpg-narrator-13b", name: "RPG Narrator 13B", category: "Creative", description: "Narasi RPG, dungeon master", parameters: "13B", contextWindow: "16K", emoji: "🎲" },
  { id: "dialogue-crafter-7b", name: "Dialogue Crafter 7B", category: "Creative", description: "Dialog realistis untuk film/game", parameters: "7B", contextWindow: "8K", emoji: "💬" },
  { id: "essay-master-13b", name: "Essay Master 13B", category: "Creative", description: "Esai akademik & opini", parameters: "13B", contextWindow: "16K", emoji: "📝" },
  { id: "speech-writer-7b", name: "Speech Writer 7B", category: "Creative", description: "Pidato politik, motivasi, pernikahan", parameters: "7B", contextWindow: "8K", emoji: "🎙️" },
  { id: "translator-poetic-7b", name: "Translator Poetic 7B", category: "Creative", description: "Terjemahan dengan sentuhan puitis", parameters: "7B", contextWindow: "8K", emoji: "🌐" },
  // Kategori 5 — Technical & Science (15)
  { id: "math-genius-33b", name: "Math Genius 33B", category: "Technical", description: "Matematika tingkat PhD", parameters: "33B", contextWindow: "32K", emoji: "🧮" },
  { id: "physics-pro-7b", name: "Physics Pro 7B", category: "Technical", description: "Fisika teoretis & terapan", parameters: "7B", contextWindow: "8K", emoji: "⚛️" },
  { id: "chemistry-lab-7b", name: "Chemistry Lab 7B", category: "Technical", description: "Kimia organik & anorganik", parameters: "7B", contextWindow: "8K", emoji: "🧪" },
  { id: "biology-expert-13b", name: "Biology Expert 13B", category: "Technical", description: "Biologi molekuler, genetika", parameters: "13B", contextWindow: "16K", emoji: "🧬" },
  { id: "medical-ai-33b", name: "Medical AI 33B", category: "Technical", description: "Kedokteran, diagnosis, farmakologi", parameters: "33B", contextWindow: "32K", emoji: "🏥" },
  { id: "legal-analyst-13b", name: "Legal Analyst 13B", category: "Technical", description: "Hukum, kontrak, regulasi", parameters: "13B", contextWindow: "16K", emoji: "⚖️" },
  { id: "finance-guru-7b", name: "Finance Guru 7B", category: "Technical", description: "Keuangan, investasi, akuntansi", parameters: "7B", contextWindow: "8K", emoji: "💰" },
  { id: "economics-pro-13b", name: "Economics Pro 13B", category: "Technical", description: "Ekonomi makro & mikro", parameters: "13B", contextWindow: "16K", emoji: "📈" },
  { id: "engineering-design-7b", name: "Engineering Design 7B", category: "Technical", description: "Teknik mesin, sipil, elektro", parameters: "7B", contextWindow: "8K", emoji: "🔧" },
  { id: "data-scientist-33b", name: "Data Scientist 33B", category: "Technical", description: "Analisis data, statistik, ML", parameters: "33B", contextWindow: "32K", emoji: "📊" },
  { id: "cybersecurity-13b", name: "Cybersecurity 13B", category: "Technical", description: "Keamanan siber, pentesting", parameters: "13B", contextWindow: "16K", emoji: "🛡️" },
  { id: "network-engineer-7b", name: "Network Engineer 7B", category: "Technical", description: "Jaringan komputer, protokol", parameters: "7B", contextWindow: "8K", emoji: "🌐" },
  { id: "cloud-architect-13b", name: "Cloud Architect 13B", category: "Technical", description: "AWS, GCP, Azure, multi-cloud", parameters: "13B", contextWindow: "16K", emoji: "☁️" },
  { id: "blockchain-dev-7b", name: "Blockchain Dev 7B", category: "Technical", description: "Web3, DeFi, NFT, smart contracts", parameters: "7B", contextWindow: "8K", emoji: "₿" },
  { id: "iot-engineer-7b", name: "IoT Engineer 7B", category: "Technical", description: "Internet of Things, embedded", parameters: "7B", contextWindow: "8K", emoji: "📡" },
  // Kategori 6 — Multilingual & Culture (13)
  { id: "indonesian-expert-7b", name: "Indonesian Expert 7B", category: "Multilingual", description: "Ahli bahasa & budaya Indonesia", parameters: "7B", contextWindow: "8K", emoji: "🇮🇩" },
  { id: "japanese-master-7b", name: "Japanese Master 7B", category: "Multilingual", description: "Bahasa & budaya Jepang", parameters: "7B", contextWindow: "8K", emoji: "🇯🇵" },
  { id: "chinese-scholar-13b", name: "Chinese Scholar 13B", category: "Multilingual", description: "Mandarin klasik & modern", parameters: "13B", contextWindow: "16K", emoji: "🇨🇳" },
  { id: "arabic-linguist-7b", name: "Arabic Linguist 7B", category: "Multilingual", description: "Bahasa Arab fusha & dialek", parameters: "7B", contextWindow: "8K", emoji: "🇸🇦" },
  { id: "hindi-guru-7b", name: "Hindi Guru 7B", category: "Multilingual", description: "Bahasa Hindi & Sanskerta", parameters: "7B", contextWindow: "8K", emoji: "🇮🇳" },
  { id: "french-elite-7b", name: "French Elite 7B", category: "Multilingual", description: "Bahasa Prancis akademik", parameters: "7B", contextWindow: "8K", emoji: "🇫🇷" },
  { id: "german-engineer-7b", name: "German Engineer 7B", category: "Multilingual", description: "Bahasa Jerman teknis", parameters: "7B", contextWindow: "8K", emoji: "🇩🇪" },
  { id: "spanish-poet-7b", name: "Spanish Poet 7B", category: "Multilingual", description: "Spanyol sastra & percakapan", parameters: "7B", contextWindow: "8K", emoji: "🇪🇸" },
  { id: "korean-wave-7b", name: "Korean Wave 7B", category: "Multilingual", description: "Bahasa & budaya Korea", parameters: "7B", contextWindow: "8K", emoji: "🇰🇷" },
  { id: "polyglot-33b", name: "Polyglot 33B", category: "Multilingual", description: "100+ bahasa dalam satu model", parameters: "33B", contextWindow: "32K", recommended: true, emoji: "🌍" },
  { id: "cultural-analyst-13b", name: "Cultural Analyst 13B", category: "Multilingual", description: "Analisis lintas budaya", parameters: "13B", contextWindow: "16K", emoji: "🌏" },
  { id: "ancient-languages-7b", name: "Ancient Languages 7B", category: "Multilingual", description: "Latin, Yunani Kuno, Sansekerta", parameters: "7B", contextWindow: "8K", emoji: "📜" },
  { id: "sign-language-ai-7b", name: "Sign Language AI 7B", category: "Multilingual", description: "Deskripsi bahasa isyarat", parameters: "7B", contextWindow: "8K", emoji: "🤟" },
  // Kategori 7 — Special Utilities (10)
  { id: "summarizer-pro-7b", name: "Summarizer Pro 7B", category: "Utilities", description: "Ringkasan teks panjang", parameters: "7B", contextWindow: "8K", emoji: "📋" },
  { id: "sentiment-analyst-7b", name: "Sentiment Analyst 7B", category: "Utilities", description: "Analisis sentimen & emosi", parameters: "7B", contextWindow: "8K", emoji: "😊" },
  { id: "fact-checker-13b", name: "Fact Checker 13B", category: "Utilities", description: "Verifikasi fakta & klaim", parameters: "13B", contextWindow: "16K", emoji: "✅" },
  { id: "seo-expert-7b", name: "SEO Expert 7B", category: "Utilities", description: "SEO, keyword research, meta tags", parameters: "7B", contextWindow: "8K", emoji: "📈" },
  { id: "prompt-engineer-7b", name: "Prompt Engineer 7B", category: "Utilities", description: "Membantu membuat prompt optimal", parameters: "7B", contextWindow: "8K", emoji: "🎯" },
  { id: "resume-builder-7b", name: "Resume Builder 7B", category: "Utilities", description: "CV & cover letter profesional", parameters: "7B", contextWindow: "8K", emoji: "📄" },
  { id: "diet-planner-7b", name: "Diet Planner 7B", category: "Utilities", description: "Rencana diet & nutrisi", parameters: "7B", contextWindow: "8K", emoji: "🥗" },
  { id: "workout-coach-7b", name: "Workout Coach 7B", category: "Utilities", description: "Program latihan & fitness", parameters: "7B", contextWindow: "8K", emoji: "💪" },
  { id: "travel-planner-13b", name: "Travel Planner 13B", category: "Utilities", description: "Itinerary perjalanan lengkap", parameters: "13B", contextWindow: "16K", emoji: "✈️" },
  { id: "interview-coach-7b", name: "Interview Coach 7B", category: "Utilities", description: "Simulasi wawancara kerja", parameters: "7B", contextWindow: "8K", emoji: "🎤" },
];

export const modelRouter = createRouter({
  list: publicQuery.query(() => {
    return models;
  }),

  getById: publicQuery
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const model = models.find((m) => m.id === input.id);
      return model || null;
    }),

  getByCategory: publicQuery
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return models.filter((m) => m.category === input.category);
    }),

  getCategories: publicQuery.query(() => {
    const categories = [...new Set(models.map((m) => m.category))];
    return categories;
  }),
});
