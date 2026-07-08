import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  index: number;
}

export default function MessageBubble({ role, content, index }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-[#2A2A35]"
            : "gold-gradient"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-[#EAE0C8]" />
        ) : (
          <Bot className="w-4 h-4 text-[#0A0A0F]" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-5 py-4 rounded-2xl ${
            isUser
              ? "bg-[#1A1A24] border border-[#2A2A35] text-[#EAE0C8]"
              : "liquid-glass-light text-[#EAE0C8]"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:text-[#EAE0C8] prose-headings:font-heading prose-headings:text-[#D4AF37] prose-strong:text-[#EAE0C8] prose-code:text-[#D4AF37] prose-code:bg-[#0A0A0F] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0A0A0F]/80 prose-pre:border prose-pre:border-[#2A2A35] prose-blockquote:border-l-[#D4AF37] prose-blockquote:text-[#8A8A95] prose-a:text-[#D4AF37] prose-li:text-[#EAE0C8] prose-table:text-[#EAE0C8]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
