'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  setCurrentConversation: (conversation: Conversation) => void
  createConversation: () => Conversation
  deleteConversation: (id: string) => void
  addMessage: (message: Message) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  clearHistory: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)

  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    return newConversation
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }, [currentConversation?.id])

  const addMessage = useCallback(
    (message: Message) => {
      if (!currentConversation) return

      const updatedConversation: Conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, message],
        updatedAt: new Date(),
      }

      // Update title based on first message
      if (updatedConversation.messages.length === 1 && message.role === 'user') {
        updatedConversation.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
      }

      setCurrentConversation(updatedConversation)
      setConversations((prev) =>
        prev.map((c) => (c.id === updatedConversation.id ? updatedConversation : c))
      )
    },
    [currentConversation]
  )

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date() }
          : c
      )
    )
    if (currentConversation?.id === id) {
      setCurrentConversation((prev) =>
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      )
    }
  }, [currentConversation?.id])

  const clearHistory = useCallback(() => {
    setConversations([])
    setCurrentConversation(null)
  }, [])

  const value: ChatContextType = {
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    addMessage,
    updateConversation,
    clearHistory,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
