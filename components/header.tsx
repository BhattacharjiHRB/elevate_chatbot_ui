'use client'

import { useChat } from '@/context/chat-context'
import { Button } from '@/components/ui/button'
import { Menu, Plus, MoreVertical, Trash, Trash2, Share, Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function Header({ onMenuClick, isSidebarOpen = true }: HeaderProps) {
  const { currentConversation, createConversation } = useChat()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left: Menu and Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-secondary"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold truncate text-foreground">
              {currentConversation?.title || 'Elevate AI Chat'}
            </h1>
            {currentConversation && (
              <p className="text-xs text-muted-foreground truncate">
                {currentConversation.messages.length} messages
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => createConversation()}
            className="hidden sm:inline-flex hover:bg-secondary transition-colors"
            title="New conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button 
                variant="ghost" 
                size="icon" 
                data-dropdown-trigger
                className="hover:bg-secondary transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            }>
              
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete 
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
