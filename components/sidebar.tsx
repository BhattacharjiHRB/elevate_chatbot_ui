'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useChat, Conversation } from '@/context/chat-context'
import {
  Plus,
  Trash2,
  Settings,
  LogOut,
  MoreVertical,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    clearHistory,
  } = useChat()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNewChat = () => {
    createConversation()
    onClose?.()
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    onClose?.()
  }

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id)
    setShowDeleteConfirm(null)
  }

  const formattedDate = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInMs = now.getTime() - messageDate.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInHours < 1) return 'Today'
    if (diffInHours < 24) return 'Today'
    if (diffInDays < 7) return 'This week'
    if (diffInDays < 30) return 'This month'
    return messageDate.toLocaleDateString()
  }

  // Group conversations by date
  const groupedConversations: Record<string, Conversation[]> = {}
  conversations.forEach((conv) => {
    const dateGroup = formattedDate(conv.updatedAt)
    if (!groupedConversations[dateGroup]) {
      groupedConversations[dateGroup] = []
    }
    groupedConversations[dateGroup].push(conv)
  })

  const dateGroups = ['Today', 'This week', 'This month']

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/50 bg-background transition-all duration-300 ease-out lg:static lg:translate-x-0 shadow-xl lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between transition-all duration-300',
          isCollapsed ? 'px-2 py-4' : 'px-5 py-5'
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Image
                src="/assets/elevate.png"
                alt="Elevate Intelligence Logo"
                width={100}
                height={100}
              />
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {isCollapsed && (
              <div className="w-8 h-8 rounded-md  flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary transition-colors h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-secondary transition-colors h-8 w-8"
              onClick={onClose}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className={cn(
          'transition-all duration-300',
          isCollapsed ? 'px-2 py-3' : 'px-4 py-4'
        )}>
          <Button
            onClick={handleNewChat}
            className={cn(
              'w-full gap-2 rounded-lg bg-[#0072BC] hover:bg-[#0072BC]/50 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md',
              isCollapsed && 'justify-center'
            )}
            variant="default"
            title={isCollapsed ? 'New chat' : undefined}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!isCollapsed && 'New Chat'}
          </Button>
        </div>

        {/* Conversation List */}
        <div className={cn(
          'flex-1 overflow-y-auto space-y-4 transition-all duration-300',
          isCollapsed ? 'px-2 py-2' : 'px-3 py-2'
        )}>
          {conversations.length === 0 ? (
            <div className={cn(
              'text-center',
              isCollapsed ? 'px-1 py-4' : 'px-2 py-4'
            )}>
              <MessageSquare className={cn(
                'text-muted-foreground/40 mb-2',
                isCollapsed ? 'h-6 w-6 mx-auto' : 'h-8 w-8 mx-auto'
              )} />
              {!isCollapsed && (
                <p className="text-xs text-muted-foreground">
                  No conversations yet
                </p>
              )}
            </div>
          ) : (
            dateGroups.map((group) => (
              groupedConversations[group] && groupedConversations[group].length > 0 && (
                <div key={group}>
                  {!isCollapsed && (
                    <p className="px-2 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest opacity-60">
                      {group}
                    </p>
                  )}
                  <div className={cn(
                    'space-y-2 transition-all duration-300',
                    isCollapsed && 'space-y-1'
                  )}>
                    {groupedConversations[group].map((conversation) => (
                      <div
                        key={conversation.id}
                        className="group relative flex items-center gap-2"
                        title={isCollapsed ? conversation.title : undefined}
                      >
                        <button
                          onClick={() => handleSelectConversation(conversation)}
                          className={cn(
                            'rounded-lg transition-all duration-200 text-left',
                            isCollapsed 
                              ? 'flex-1 p-2 flex justify-center'
                              : 'flex-1 px-3 py-2.5',
                            'hover:bg-secondary',
                            currentConversation?.id === conversation.id
                              ? 'bg-[#00AEEF] text-primary-foreground shadow-md hover:bg-[#00AEEF]/50'
                              : 'text-foreground'
                          )}
                          title={conversation.title}
                        >
                          {isCollapsed ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <span className="line-clamp-1 text-sm">
                              {conversation.title}
                            </span>
                          )}
                        </button>

                        {!isCollapsed && (
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <Button 
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-secondary"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            }>
                              
                            </DropdownMenuTrigger>
                              
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() =>
                                  setShowDeleteConfirm(conversation.id)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        {/* Delete Confirmation Modal - Moved to bottom */}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className={cn(
          'border-t border-border/50 space-y-2 transition-all duration-300 bg-background/50 backdrop-blur-sm',
          isCollapsed ? 'px-2 py-3' : 'px-3 py-4'
        )}>
          <Button
            variant="ghost"
            className={cn(
              'text-foreground hover:bg-secondary transition-colors',
              isCollapsed 
                ? 'w-full h-9 p-0 justify-center'
                : 'w-full justify-start gap-2'
            )}
            onClick={clearHistory}
            disabled={conversations.length === 0}
            title={isCollapsed ? 'Clear history' : undefined}
          >
            <Trash2 className="h-4 w-4" />
            {!isCollapsed && 'Clear history'}
          </Button>
          
          <Button 
            variant="ghost" 
            className={cn(
              'text-foreground hover:bg-secondary transition-colors',
              isCollapsed 
                ? 'w-full h-9 p-0 justify-center'
                : 'w-full justify-start gap-2'
            )}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && 'Settings'}
          </Button>
          
          <Button 
            variant="ghost" 
            className={cn(
              'text-destructive hover:bg-destructive/10 hover:text-red-600 transition-colors',
              isCollapsed 
                ? 'w-full h-9 p-0 justify-center'
                : 'w-full justify-start gap-2'
            )}
            title={isCollapsed ? 'Sign out' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && 'Sign out'}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={(open: any) => !open && setShowDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {showDeleteConfirm && conversations.find(c => c.id === showDeleteConfirm) && (
              <p className="text-sm font-medium text-foreground bg-muted/50 rounded-lg p-3">
                "{conversations.find(c => c.id === showDeleteConfirm)?.title}"
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-2 p-4 sm:gap-0">
            <div className="flex flex-1 items-center gap-2 text-sm text-muted-foreground">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (showDeleteConfirm) {
                    handleDeleteConversation(showDeleteConfirm)
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
