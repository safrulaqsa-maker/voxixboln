import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Hexagon,
  Search,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { format } from "date-fns";

export default function Sidebar() {
  const { chats, activeChatId, setActiveChat, setMessages, addChat, removeChat } = useChatStore();
  const { theme, setTheme, sidebarOpen, setSidebarOpen } = useSettingsStore();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const createChat = trpc.chat.create.useMutation({
    onSuccess: (data) => {
      const newChat = {
        id: data.id,
        title: data.title,
        modelUsed: data.modelUsed,
        mode: data.mode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addChat(newChat);
      setActiveChat(data.id);
      setMessages([]);
    },
  });

  const deleteChat = trpc.chat.delete.useMutation({
    onSuccess: (_, vars) => {
      removeChat(vars.id);
      setDeletingId(null);
    },
  });

  const handleNewChat = () => {
    const settings = useSettingsStore.getState();
    createChat.mutate({
      title: "New Chat",
      modelUsed: settings.model,
      mode: settings.mode,
      temperature: String(settings.temperature),
      maxTokens: settings.maxTokens,
      contextWindow: settings.contextWindow,
    });
  };

  const handleSelectChat = async (id: number) => {
    if (activeChatId === id) return;
    setActiveChat(id);
    // Fetch messages via utils
    const msgs = await utils.chat.getMessages.fetch({ chatId: id });
    if (msgs) {
      setMessages(
        msgs.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
          tokenCount: m.tokenCount || 0,
          createdAt: m.createdAt,
        }))
      );
    }
  };

  const handleDeleteChat = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    deleteChat.mutate({ id });
  };

  const filteredChats = searchQuery
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  if (!sidebarOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setSidebarOpen(true)}
        className="fixed left-3 top-3 z-50 p-2 rounded-xl liquid-glass hover:bg-[#EAE0C8]/10 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
      </motion.button>
    );
  }

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-full w-[280px] liquid-glass z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2A2A35]">
        <div className="flex items-center gap-2 flex-1">
          <Hexagon className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
          <span className="font-heading text-xl font-semibold tracking-widest text-[#EAE0C8]">
            GENESIS
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg hover:bg-[#EAE0C8]/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#8A8A95]" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-3">
        <button
          onClick={handleNewChat}
          disabled={createChat.isPending}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 gold-gradient rounded-xl text-[#0A0A0F] font-semibold text-sm shimmer-hover transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {createChat.isPending ? "Creating..." : "New Chat"}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A95]" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#13131A] border border-[#2A2A35] rounded-xl text-sm text-[#EAE0C8] placeholder-[#8A8A95] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
          />
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        <AnimatePresence>
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => handleSelectChat(chat.id)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 ${
                activeChatId === chat.id
                  ? "bg-[#2A2A35] border-l-[3px] border-[#D4AF37]"
                  : "hover:bg-[#1A1A24] border-l-[3px] border-transparent"
              }`}
            >
              <MessageSquare
                className={`w-4 h-4 flex-shrink-0 ${
                  activeChatId === chat.id
                    ? "text-[#D4AF37]"
                    : "text-[#8A8A95]"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm truncate ${
                    activeChatId === chat.id
                      ? "text-[#EAE0C8] font-medium"
                      : "text-[#8A8A95]"
                  }`}
                >
                  {chat.title}
                </p>
                <p className="text-[10px] text-[#8A8A95] truncate">
                  {chat.modelUsed} · {format(new Date(chat.updatedAt), "MMM d")}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#C0392B]/20 transition-all"
              >
                {deletingId === chat.id ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 text-[#C0392B]" />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredChats.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-[#2A2A35] mx-auto mb-2" />
            <p className="text-xs text-[#8A8A95]">
              {searchQuery ? "No chats found" : "No chats yet"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A2A35] px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-[#EAE0C8]/10 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Moon className="w-4 h-4 text-[#D4AF37]" />
            )}
          </button>
          <button className="p-2 rounded-lg hover:bg-[#EAE0C8]/10 transition-colors">
            <Settings className="w-4 h-4 text-[#8A8A95]" />
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#2A2A35]">
            <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center">
              <span className="text-xs font-bold text-[#0A0A0F]">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#EAE0C8] truncate">{user.name || "User"}</p>
              <p className="text-[10px] text-[#8A8A95]">{user.role}</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg hover:bg-[#C0392B]/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#8A8A95]" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
