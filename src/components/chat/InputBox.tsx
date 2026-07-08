import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Loader2 } from "lucide-react";

interface InputBoxProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function InputBox({ onSend, isLoading, disabled }: InputBoxProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || isLoading || disabled) return;
    onSend(message.trim());
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="liquid-glass rounded-2xl px-4 py-3 flex items-end gap-3">
        <button
          className="p-2 rounded-xl hover:bg-[#EAE0C8]/10 transition-colors flex-shrink-0 mb-0.5"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5 text-[#8A8A95]" />
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Select or create a chat to start..." : "Ketik pesan Anda..."}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 bg-transparent text-sm text-[#EAE0C8] placeholder-[#8A8A95] focus:outline-none resize-none max-h-[200px] py-2 leading-relaxed disabled:opacity-50"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!message.trim() || isLoading || disabled}
          className={`p-2.5 rounded-xl flex-shrink-0 mb-0.5 transition-all ${
            message.trim() && !isLoading && !disabled
              ? "gold-gradient shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              : "bg-[#2A2A35]"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-[#0A0A0F] animate-spin" />
          ) : (
            <Send
              className={`w-5 h-5 ${
                message.trim() && !disabled
                  ? "text-[#0A0A0F]"
                  : "text-[#8A8A95]"
              }`}
            />
          )}
        </motion.button>
      </div>
      <p className="text-[10px] text-[#8A8A95]/50 text-center mt-2">
        Genesis AI dapat membuat kesalahan. Verifikasi informasi penting.
      </p>
    </motion.div>
  );
}
