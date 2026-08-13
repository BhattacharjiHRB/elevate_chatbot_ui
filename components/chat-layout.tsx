'use client'

import React, { useState, useEffect } from 'react'
import { useChat, Message } from '@/context/chat-context'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { ChatArea } from '@/components/chat-area'
import { ChatInput } from '@/components/chat-input'

export function ChatLayout() {
  const {
    currentConversation,
    createConversation,
    addMessage,
  } = useChat()

  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Create initial conversation on mount
  useEffect(() => {
    if (!currentConversation) {
      createConversation()
    }
  }, [currentConversation, createConversation])

  // Close sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setIsLoading(true)

    try {
      // Simulate API call - replace with real API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock response
      const responses = [
        'That\'s a great question! Let me think about that...',
        'I appreciate your input. Here\'s my perspective...',
        'Interesting point! I\'d like to clarify a few things...',
        'I understand what you\'re asking. Based on that...',
        'That\'s a thoughtful question. In my experience...',
      ]

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        content: randomResponse,
        role: 'assistant',
        timestamp: new Date(),
      }

      addMessage(assistantMessage)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Messages Area */}
        <ChatArea
          messages={currentConversation?.messages || []}
          isLoading={isLoading}
        />

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!currentConversation}
        />
      </div>
    </div>
  )
}
