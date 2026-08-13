# 🏗️ Chat UI Component Architecture

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌────────────┐  ╔════════════════════════════════════════════════╗ │
│  │            │  ║                    HEADER                      ║ │
│  │ SIDEBAR    │  ║ [☰ Menu] Chat Title (X messages) [+] [...] ║ │
│  │            │  ╠════════════════════════════════════════════════╣ │
│  │ New Chat   │  ║                                                ║ │
│  │ ────────   │  ║                  CHAT AREA                    ║ │
│  │            │  ║                                                ║ │
│  │ Today      │  ║  👤 User message (blue)                       ║ │
│  │ ─────      │  ║                                                ║ │
│  │ Conv 1     │  ║  🤖 AI response (gray)                        ║ │
│  │ Conv 2     │  ║     [Copy] [👍] [👎]                          ║ │
│  │            │  ║                                                ║ │
│  │ Last Week  │  ║  👤 User message                              ║ │
│  │ ─────      │  ║                                                ║ │
│  │ Conv 3     │  ║  🤖 AI response                               ║ │
│  │            │  ║     [Copy] [👍] [👎]                          ║ │
│  │ Settings   │  ║                                                ║ │
│  │ Sign out   │  ╠════════════════════════════════════════════════╣ │
│  │            │  ║  [📎 Attach] [Type message here...] [🔗] 0/4000║ │
│  │            │  ║                                                ║ │
│  └────────────┘  ╚════════════════════════════════════════════════╝ │
│                                                                     │
│  [Mobile: Sidebar collapses on screens < 1024px]                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Tree

```
RootLayout (with ChatProvider)
│
└── ChatLayout
    ├── Sidebar (Chat History)
    │   ├── New Chat Button
    │   ├── Conversations grouped by date
    │   │   ├── Today
    │   │   │   ├── Conversation 1 (clickable)
    │   │   │   └── Conversation 2 (with delete option)
    │   │   └── This Week
    │   │       └── Conversation 3
    │   └── Footer Actions
    │       ├── Clear History
    │       ├── Settings
    │       └── Sign Out
    │
    ├── Header (Top Navigation)
    │   ├── Mobile Menu Toggle (visible on mobile only)
    │   ├── Conversation Title & Message Count
    │   ├── New Chat Button (hidden on mobile)
    │   └── More Actions Dropdown
    │
    ├── ChatArea (Messages Display)
    │   ├── Empty State (on first load)
    │   │   ├── Welcome message
    │   │   └── Quick action suggestions
    │   └── Message List
    │       ├── User Messages (right-aligned, blue)
    │       ├── Assistant Messages (left-aligned, gray)
    │       │   ├── Copy Button
    │       │   ├── Thumbs Up Button
    │       │   └── Thumbs Down Button
    │       └── Loading Animation (while waiting for response)
    │
    └── ChatInput (Message Input)
        ├── Auto-resizing Textarea
        ├── Send Button
        ├── Character Counter (shows 0/4000)
        └── Attach Button (UI only)
```

## State Flow

```
┌──────────────────────────────────────────┐
│         ChatContext Provider             │
│  (context/chat-context.tsx)              │
└──────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
    Sidebar      Header     ChatLayout
        │           │           │
        └─────────┬─────────────┘
                  │
            useChat() Hook
                  │
      ┌───────────┼───────────┐
      │           │           │
  ChatArea    ChatInput   Components
```

## Data Flow

```
User Types Message
        │
        ↓
ChatInput Component
        │
        ↓
handleSendMessage (ChatLayout)
        │
        ├─→ Add User Message to Context
        │   └─→ ChatArea re-renders with new message
        │
        ├─→ API Call (or mock response)
        │   └─→ Show loading animation
        │
        ├─→ Receive AI Response
        │   └─→ Add Assistant Message to Context
        │
        └─→ ChatArea auto-scrolls to latest message
```

## Component Responsibilities

### ChatLayout

- Coordinates all components
- Manages message sending flow
- Handles sidebar visibility toggle
- Orchestrates initial conversation creation

### Sidebar

- Displays all conversations
- Groups conversations by date
- Allows conversation selection and deletion
- Provides quick actions (new chat, settings)

### Header

- Shows current conversation title
- Provides mobile menu toggle
- Offers quick actions (new chat, more options)
- Displays message count

### ChatArea

- Displays all messages in conversation
- Auto-scrolls to latest message
- Shows loading animation during API calls
- Displays empty state with suggestions
- Provides message actions (copy, feedback)

### ChatInput

- Accepts user text input
- Auto-resizes textarea as user types
- Enforces character limit (0/4000)
- Handles keyboard shortcuts (Enter to send)
- Triggers message submission

### Context (useChat)

- Manages all conversations
- Tracks current conversation
- Provides conversation CRUD operations
- Automatically updates conversation titles

## Key Features by Component

| Feature             | Component              | How It Works                                    |
| ------------------- | ---------------------- | ----------------------------------------------- |
| Send Message        | ChatInput → ChatLayout | User types, presses Enter, message sent via API |
| Display Message     | ChatArea               | Re-renders when context updates                 |
| Auto-scroll         | ChatArea               | useEffect watches messages array                |
| Conversation Switch | Sidebar → Context      | Click conversation updates currentConversation  |
| New Chat            | Sidebar or Header      | Creates new conversation in context             |
| Delete Chat         | Sidebar                | Removes from conversations array                |
| Clear History       | Sidebar                | Clears all conversations                        |
| Mobile Menu         | Header → ChatLayout    | Toggles sidebar visibility state                |
| Loading State       | ChatArea & ChatLayout  | Shows animation during API call                 |
| Character Counter   | ChatInput              | Counts input length in real-time                |

## Event Flow

```
┌─────────────────────────────────────────────────┐
│ USER INTERACTIONS                               │
└─────────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
 Type Message   Select Conv     Mobile Menu
    │               │               │
    ↓               ↓               ↓
ChatInput      Sidebar        Header
    │               │               │
    ↓               ↓               ↓
onSendMessage  setCurrentConv  toggleSidebar
    │               │               │
    ↓               ↓               ↓
addMessage      Context         State
    │               │               │
    └───────────────┼───────────────┘
                    │
                    ↓
            Re-render Components
                    │
        ┌───────────┼───────────┐
        │           │           │
     ChatArea    Header      Sidebar
        │           │           │
        ↓           ↓           ↓
   UI Update   UI Update   UI Update
```

## Mobile Responsiveness

```
Mobile (< 640px)
├── Sidebar: Fixed, off-screen by default
├── Hamburger menu: Visible in header
├── Chat area: Full width
└── Toggle sidebar: Click menu or outside

Tablet (640px - 1024px)
├── Sidebar: Visible but narrower
├── Responsive spacing
├── Flexible layout
└── Touch-optimized

Desktop (≥ 1024px)
├── Sidebar: Always visible
├── Full-width chat area
├── All features visible
└── Mouse/trackpad optimized
```

## Props Passing

```
ChatLayout (no props - uses context)
    │
    ├─→ Sidebar
    │   └─ receives: (isOpen, onClose)
    │
    ├─→ Header
    │   └─ receives: (onMenuClick, isSidebarOpen)
    │
    ├─→ ChatArea
    │   └─ receives: (messages, isLoading)
    │
    └─→ ChatInput
        └─ receives: (onSendMessage, isLoading, disabled)

All components access context via useChat() hook
```

## Context Hooks Usage

```typescript
// In Sidebar
const {
  conversations, // Display all conversations
  currentConversation, // Highlight active conversation
  setCurrentConversation, // Handle conversation click
  createConversation, // New chat button
  deleteConversation, // Delete button
  clearHistory, // Clear all button
} = useChat();

// In Header
const {
  currentConversation, // Show title
  createConversation, // New chat button
} = useChat();

// In ChatArea
const {
  currentConversation, // Access messages array
} = useChat();

// In ChatLayout
const {
  currentConversation, // Get current conversation
  createConversation, // Initialize on mount
  addMessage, // Add sent/received messages
} = useChat();
```

## Message Lifecycle

```
1. User Types & Sends
   ├─ Message created with id, content, role='user'
   ├─ Message added to context
   └─ ChatArea updates and auto-scrolls

2. API Processing
   ├─ isLoading state = true
   ├─ Loading animation shown in ChatArea
   └─ API call made with message content

3. Response Received
   ├─ API returns ai_response
   ├─ isLoading state = false
   ├─ Assistant Message created with role='assistant'
   └─ Message added to context

4. Display Update
   ├─ ChatArea re-renders with new message
   ├─ Auto-scroll to bottom
   ├─ Conversation title updated (if first message)
   └─ Sidebar history refreshed
```

## Styling Strategy

```
CSS Framework: Tailwind CSS 4
├─ Responsive Classes
│  ├─ Mobile: base styles
│  ├─ sm: (640px+)
│  ├─ md: (768px+)
│  ├─ lg: (1024px+)
│  └─ xl: (1280px+)
│
├─ Component Variants
│  ├─ Button sizes (xs, sm, default, lg)
│  ├─ Button variants (default, outline, ghost)
│  └─ Custom color tokens
│
├─ Dark Mode
│  ├─ Automatic via next-themes
│  ├─ Dark variants: dark:bg-background
│  └─ CSS vars for theming
│
└─ Animations
   ├─ Slide in/out
   ├─ Fade in/out
   ├─ Bounce (loading dots)
   └─ Transitions on hover
```

---

This architecture ensures:
✅ **Maintainability** - Clear separation of concerns
✅ **Scalability** - Easy to add new features
✅ **Responsiveness** - Works on all devices
✅ **Performance** - Efficient re-rendering
✅ **Type Safety** - Full TypeScript support
