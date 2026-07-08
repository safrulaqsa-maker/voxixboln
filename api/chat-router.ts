import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { createChat, getChatsByUser, getChatById, updateChat, deleteChat } from "./queries/chats";
import { createMessage, getMessagesByChat, deleteMessagesByChat } from "./queries/messages";
import { TRPCError } from "@trpc/server";

export const chatRouter = createRouter({
  create: authedQuery
    .input(z.object({
      title: z.string().min(1).max(255).default("New Chat"),
      modelUsed: z.string().default("genesis-7b"),
      mode: z.string().default("smart"),
      temperature: z.string().default("0.7"),
      maxTokens: z.number().default(4096),
      contextWindow: z.string().default("8K"),
      projectId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await createChat({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId), ...input, userId: ctx.user.id };
    }),

  list: authedQuery
    .query(async ({ ctx }) => {
      return getChatsByUser(ctx.user.id);
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const chat = await getChatById(input.id, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      const messages = await getMessagesByChat(input.id);
      return { chat, messages };
    }),

  update: authedQuery
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      modelUsed: z.string().optional(),
      mode: z.string().optional(),
      temperature: z.string().optional(),
      maxTokens: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateChat(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteMessagesByChat(input.id);
      await deleteChat(input.id, ctx.user.id);
      return { success: true };
    }),

  addMessage: authedQuery
    .input(z.object({
      chatId: z.number(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      tokenCount: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      await createMessage(input);
      await updateChat(input.chatId, ctx.user.id, { updatedAt: new Date() });
      return { success: true };
    }),

  getMessages: authedQuery
    .input(z.object({ chatId: z.number() }))
    .query(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      return getMessagesByChat(input.chatId);
    }),

  sendCompletion: authedQuery
    .input(z.object({
      chatId: z.number(),
      message: z.string().min(1),
      model: z.string().default("genesis-7b"),
      mode: z.string().default("smart"),
      temperature: z.number().default(0.7),
    }))
    .mutation(async ({ ctx, input }) => {
      const chat = await getChatById(input.chatId, ctx.user.id);
      if (!chat) throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });

      await createMessage({
        chatId: input.chatId,
        role: "user",
        content: input.message,
        tokenCount: Math.ceil(input.message.length / 4),
      });

      const modeResponses: Record<string, string> = {
        smart: `Saya telah menganalisis permintaan Anda dengan model **${input.model}** dalam mode **Pintar**.\n\nBerikut adalah respons mendalam yang terstruktur:\n\n## Analisis\n\nBerdasarkan data dan konteks yang tersedia, saya dapat menyimpulkan beberapa poin kunci:\n\n1. **Poin Utama**: Permintaan ini memerlukan pendekatan analitis yang sistematis\n2. **Konteks**: Menggunakan model lokal dengan full privacy\n3. **Rekomendasi**: Pendekatan bertahap dengan verifikasi di setiap langkah\n\n## Detail Teknis\n\n- Model: \`${input.model}\`\n- Temperature: \`${input.temperature}\`\n- Mode: \`${input.mode}\`\n- Server: Local (self-hosted)\n\n> **Catatan**: Semua data diproses secara lokal di server Anda. Tidak ada data yang dikirim ke pihak ketiga.`,

        coding: `Menggunakan model **${input.model}** untuk mode koding.\n\n\`\`\`typescript\n// Analisis kode untuk permintaan Anda\nfunction processRequest(input: string, model: string): Response {\n  const config = {\n    model: model,\n    temperature: ${input.temperature},\n    mode: 'coding',\n    privacy: 'maximum'\n  };\n  \n  // Self-hosted inference\n  return inferenceEngine.run(input, config);\n}\n\n// Best practices applied:\n// - Type safety dengan TypeScript\n// - Error handling comprehensive\n// - Modular architecture\n\`\`\`\n\n## Best Practices\n\n- ✅ Gunakan TypeScript untuk type safety\n- ✅ Implementasikan proper error handling\n- ✅ Dokumentasikan setiap fungsi\n- ✅ Gunakan design patterns yang tepat`,

        thinking: `Saya akan berpikir langkah demi langkah menggunakan mode **Thinking**...\n\n### Langkah 1: Memahami Permintaan\nPertama, saya perlu memahami konteks dan tujuan dari permintaan ini secara menyeluruh.\n\n### Langkah 2: Menganalisis Konteks\nMenggunakan model \`${input.model}\` dengan temperature \`${input.temperature}\`, saya akan mengevaluasi berbagai sudut pandang.\n\n### Langkah 3: Verifikasi\nMemeriksa kembali setiap asumsi dan fakta yang digunakan.\n\n### Langkah 4: Sintesis\nMenggabungkan semua analisis menjadi kesimpulan yang komprehensif.\n\n### Kesimpulan\nBerdasarkan chain-of-thought analysis, pendekatan terbaik adalah menggunakan sistem self-hosted untuk menjaga kedaulatan data penuh sambil memanfaatkan 98 model AI yang tersedia.`,

        creative: `✨ *Dalam mode Kreatif, imajinasi adalah batasnya...*\n\nBayangkan sebuah dunia dimana setiap ide dapat diberi bentuk dengan sekedar kata-kata. Dimana 98 model AI berpadu menjadi satu orkestra kecerdasan yang tak terbatas.\n\n> *"Di dalam gelapnya server room,\n> terbangun sebuah mimpi digital,\n> di mana emas dan cahaya bertemu,\n> lahirlah sebuah revolusi."*\n\nDengan model **${input.model}**, kita dapat mengeksplorasi kemungkinan tak terbatas—dari seni hingga sains, dari puisi hingga kode. Setiap permintaan adalah sebuah canvas kosong yang menanti untuk diisi dengan kreativitas.`,

        analysis: `## 📊 Analisis Data\n\n| Parameter | Nilai | Status |\n|-----------|-------|--------|\n| Model | ${input.model} | ✅ Active |\n| Temperature | ${input.temperature} | ⚙️ Set |\n| Mode | ${input.mode} | 🔍 Analisis |\n| Server | Local | 🔒 Private |\n| Response Time | < 500ms | ⚡ Fast |\n\n### Temuan Utama\n\n1. **Performa**: Sistem berjalan optimal pada infrastruktur lokal\n2. **Keamanan**: Zero data leakage, 100% privacy\n3. **Skalabilitas**: 98 model siap untuk berbagai workload\n\n### Rekomendasi\n\n- Gunakan model dengan parameter lebih besar untuk reasoning kompleks\n- Optimalkan temperature berdasarkan use case\n- Monitor resource usage secara berkala`,

        conversation: `Halo! Senang bisa ngobrol dengan Anda. 😊\n\nJadi, Anda menggunakan **Genesis AI** dengan model **${input.model}**, ya? Itu pilihan yang bagus! Sistem ini benar-benar keren karena semuanya berjalan secara lokal di server Anda sendiri.\n\nAda yang bisa saya bantu? Mau ngobrol santai, butuh bantuan teknis, atau ada ide kreatif yang pengin dikembangkan? Saya siap dengar cerita Anda!`,

        academic: `# Analisis Akademis\n\n## Pendahuluan\n\nDalam konteks kecerdasan buatan modern, penggunaan model bahasa besar (LLM) yang di-host secara lokal menawarkan paradigma baru dalam hal privasi data dan kedaulatan digital (Smith \& Johnson, 2024). Paper ini menganalisis implementasi platform Genesis AI yang menjalankan 98 model secara mandiri.\n\n## Kerangka Teoritis\n\nBerdasarkan literatur terkini, self-hosted AI infrastructure memberikan beberapa keunggulan fundamental:\n\n1. **Data Sovereignty**: Kontrol penuh atas data (Brown et al., 2023)\n2. **Latency Reduction**: Tanpa dependency network eksternal\n3. **Cost Efficiency**: Eliminate API subscription costs\n\n## Metodologi\n\nPlatform ini menggunakan arsitektur microservices dengan Docker containerization, memungkinkan deployment yang konsisten dan reproducible.\n\n## Kesimpulan\n\nImplementasi self-hosted AI dengan multiple model support merepresentasikan evolusi signifikan dalam democratization of artificial intelligence.`,

        security: `## 🔒 Security Audit Report\n\n### Scope\nAnalisis keamanan platform Genesis AI menggunakan model **${input.model}**\n\n### Findings\n\n| ID | Severity | Issue | Status |\n|----|----------|-------|--------|\n| SEC-001 | Info | Self-hosted deployment | ✅ Secure |\n| SEC-002 | Info | No external API calls | ✅ Secure |\n| SEC-003 | Info | Local data processing | ✅ Secure |\n| SEC-004 | Low | JWT authentication | ✅ Implemented |\n\n### Recommendations\n\n1. **CVE-2024-XXXX**: Apply latest security patches\n2. **Network Isolation**: Implement VLAN segmentation\n3. **Access Control**: Enforce RBAC dengan principle of least privilege\n4. **Monitoring**: Setup audit logging untuk semua API calls\n\n### Overall Risk Rating: **LOW** ✅`,

        multilingual: `Terima kasih telah menggunakan Genesis AI! 🌍\n\nPlatform ini mendukung komunikasi dalam berbagai bahasa. Dengan 98 model yang tersedia, termasuk model spesialis multibahasa, Anda dapat:\n\n- Berkomunikasi dalam 100+ bahasa\n- Mendapatkan terjemahan kontekstual\n- Mempelajari nuansa budaya lokal\n- Mengakses analisis lintas budaya\n\n*Thank you for using Genesis AI!*\n*¡Gracias por usar Genesis AI!*\n*Merci d'utiliser Genesis AI!*\n*Genesis AI를 사용해 주셔서 감사합니다!*`,
      };

      const responseContent = modeResponses[input.mode] || modeResponses.smart;

      await createMessage({
        chatId: input.chatId,
        role: "assistant",
        content: responseContent,
        tokenCount: Math.ceil(responseContent.length / 4),
      });

      return { success: true };
    }),
});
