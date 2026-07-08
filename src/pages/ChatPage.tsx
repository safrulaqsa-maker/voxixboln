import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { useChatStore } from "@/store/chatStore";
import ChatContainer from "@/components/chat/ChatContainer";

export default function ChatPage() {
  const { user } = useAuth();
  const { setChats, setActiveChat, activeChatId } = useChatStore();

  const { data: chatsData } = trpc.chat.list.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    if (chatsData) {
      const formatted = chatsData.map((c) => ({
        id: c.id,
        title: c.title,
        modelUsed: c.modelUsed,
        mode: c.mode,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));
      setChats(formatted);
      if (formatted.length > 0 && !activeChatId) {
        setActiveChat(formatted[0].id);
      }
    }
  }, [chatsData, setChats, setActiveChat, activeChatId]);

  return <ChatContainer />;
}
