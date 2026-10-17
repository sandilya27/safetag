"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ChatState = { open: boolean; setOpen: (open: boolean) => void };

const ChatContext = createContext<ChatState>({ open: false, setOpen: () => {} });

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <ChatContext.Provider value={{ open, setOpen }}>{children}</ChatContext.Provider>;
}

export const useChat = () => useContext(ChatContext);
