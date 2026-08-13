'use client'

import React, { useEffect, useRef } from 'react'
import { Message } from '@/context/chat-context'
import { cn } from '@/lib/utils'
import { Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react'

interface ChatAreaProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatArea({
  messages,
  isLoading = false,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)

      setTimeout(() => {
        setCopiedId(null)
      }, 1500)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  /*
   * Empty chat
   */
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4">
        <div className="w-full max-w-2xl py-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Elevate Intelligence
            </h2>

            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              How can I help you today?
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              className="rounded-xl border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium">
                ✨ Ask a question
              </p>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Get instant answers and explanations
              </p>
            </button>

            <button
              type="button"
              className="rounded-xl border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium">
                🛠 Our services
              </p>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Learn more about what we offer
              </p>
            </button>

            <button
              type="button"
              className="rounded-xl border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium">
                ⚙️ Microsoft support
              </p>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Get help with Microsoft products and services
              </p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-10">

          {messages.map((message) => {
            const isUser = message.role === 'user'

            return (
              <div
                key={message.id}
                className={cn(
                  'group flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300',
                  isUser
                    ? 'justify-end'
                    : 'justify-start'
                )}
              >
                {isUser ? (
                  /*
                   * USER MESSAGE
                   */
                  <div className="flex max-w-[85%] flex-col items-end sm:max-w-[75%]">
                    <div className="rounded-3xl rounded-br-md bg-muted px-4 py-3 text-[15px] leading-7 text-foreground sm:px-5">
                      <p className="whitespace-pre-wrap wrap-break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  /*
                   * AI MESSAGE
                   */
                  <div className="flex w-full bg-accen gap-3 sm:gap-4">

                    {/* AI Avatar */}
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5821F] text-sm text-white shadow-sm">
                      🤖
                    </div>

                    {/* AI Content */}
                    <div className="min-w-0 flex-1">

                      {/* AI Name */}
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          Elevate Intelligence
                        </span>
                      </div>

                      {/* Message */}
                      <div className="max-w-3xl">
                        <div className="whitespace-pre-wrap wrap-break-words text-[15px] bg-amber-50 rounded-2xl p-4 leading-7 text-foreground sm:text-[16px] sm:leading-7">
                          {message.content}
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className={cn(
                          'mt-3 flex items-center gap-0.5',
                          'opacity-100 sm:opacity-0',
                          'transition-opacity duration-200',
                          'sm:group-hover:opacity-100'
                        )}
                      >
                        {/* Copy */}
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              message.content,
                              message.id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Copy"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>

                        {/* Like */}
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Good response"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>

                        {/* Dislike */}
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Bad response"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* AI Loading */}
          {isLoading && (
            <div className="flex w-full gap-3 sm:gap-4 animate-in fade-in duration-200">

              {/* AI Avatar */}
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5821F] text-sm text-white">
                🤖
              </div>

              {/* Typing indicator */}
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Elevate Intelligence
                </span>

                <div className="flex items-center gap-1.5 pt-1">
                  <span
                    className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: '-0.3s' }}
                  />

                  <span
                    className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: '-0.15s' }}
                  />

                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
                  />
                </div>
              </div>
            </div>
          )}

          <div
            ref={messagesEndRef}
            className="h-px"
          />
        </div>
      </div>
    </div>
  )
}