'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, ImageIcon, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px'
    }
  }, [input])

  
const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(event.target.files || [])

  if (files.length === 0) return

  setSelectedFiles((prev) => [...prev, ...files])

  // Allows selecting the same file again later
  event.target.value = ''
}

const removeFile = (index: number) => {
  setSelectedFiles((prev) =>
    prev.filter((_, i) => i !== index)
  )
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim())
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="bg-background px-4 py-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Elevate AI..."
              disabled={isLoading || disabled}
              className={cn(
                'flex-1 rounded-xl border border-border bg-background px-4 py-3',
                'resize-none outline-none transition-all',
                'text-sm placeholder:text-muted-foreground',
                'focus:border-primary focus:ring-2 focus:ring-primary/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'max-h-50 min-h-11',
                'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'
              )}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || disabled}
              className="h-9 w-9 shrink-0 bg-[#F5821F] hover:bg-[#F5821F]/90 text-white"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>

          <div className="flex-1 items-center justify-between text-xs text-muted-foreground">
            <div className="space-y-3">

              {/* Selected files */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => {
                    const isImage = file.type.startsWith('image/')

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="group flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
                      >
                        {isImage ? (
                          <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}

                        <div className="max-w-45">
                          <p className="truncate text-xs font-medium">
                            {file.name}
                          </p>

                          <p className="text-[10px] text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Bottom controls */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">

                <div className="flex gap-2">

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="
                      image/*,
                      .pdf,
                      .doc,
                      .docx,
                      .xls,
                      .xlsx,
                      .csv,
                      .txt,
                      .ppt,
                      .pptx
                    "
                    onChange={handleFileChange}
                  />

                  {/* Upload button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-2"
                    disabled={isLoading || disabled}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />

                    <span className="hidden sm:inline">
                      Attach
                    </span>
                  </Button>

                </div>

                <span>
                  {input.length} / 400
                </span>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
