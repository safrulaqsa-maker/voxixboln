import { useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { trpc } from "@/providers/trpc";
import WelcomeMessage from "./WelcomeMessage";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";

export default function ChatContainer() {
  const {
    activeChatId,
    messages,
    isLoading,
    addMessage,
    setIsLoading,
    setMessages,
  } = useChatStore();
  const { model, mode, temperature } = useSettingsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  // Query messages for active chat
  trpc.chat.getMessages.useQuery(
    { chatId: activeChatId || 0 },
    {
      enabled: !!activeChatId,
      refetchInterval: isLoading ? 1000 : false,
      select: (data) => {
        setMessages(
          data.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
            tokenCount: m.tokenCount || 0,
            createdAt: m.createdAt,
          }))
        );
        return data;
      },
    }
  );

  const sendCompletion = trpc.chat.sendCompletion.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      if (activeChatId) {
        utils.chat.getMessages.invalidate({ chatId: activeChatId });
      }
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (message: string) => {
    if (!activeChatId) return;

    addMessage({
      id: Date.now(),
      role: "user",
      content: message,
      createdAt: new Date(),
    });

    sendCompletion.mutate({
      chatId: activeChatId,
      message,
      model,
      mode,
      temperature,
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6">
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                index={i}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 px-4">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
                </div>
                <span className="text-xs text-[#8A8A95]">
                  Genesis AI sedang berpikir...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2">
        <InputBox
          onSend={handleSend}
          isLoading={isLoading}
          disabled={!activeChatId}
        />
      </div>
    </div>
  );
}
