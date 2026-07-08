import { create } from "zustand";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  tokenCount?: number;
  createdAt: Date;
}

export interface Chat {
  id: number;
  title: string;
  modelUsed: string;
  mode: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  chats: Chat[];
  activeChatId: number | null;
  messages: ChatMessage[];
  isLoading: boolean;
  streamingContent: string;

  setChats: (chats: Chat[]) => void;
  setActiveChat: (id: number | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setIsLoading: (loading: boolean) => void;
  setStreamingContent: (content: string) => void;
  addChat: (chat: Chat) => void;
  removeChat: (id: number) => void;
  clearActiveChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  isLoading: false,
  streamingContent: "",

  setChats: (chats) => set({ chats }),
  setActiveChat: (id) => set({ activeChatId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
      }
      return { messages: msgs };
    }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setStreamingContent: (content) => set({ streamingContent: content }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== id),
      activeChatId: state.activeChatId === id ? null : state.activeChatId,
    })),
  clearActiveChat: () => set({ activeChatId: null, messages: [] }),
}));
