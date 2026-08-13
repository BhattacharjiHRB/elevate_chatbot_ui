# Elevate AI Chat UI

A modern, responsive chat interface for AI chatbot conversations, built with Next.js, TypeScript, React, and Tailwind CSS. The UI is inspired by Claude's web interface with a focus on user experience and responsiveness.

## Features

### 🎨 Modern UI Design

- Clean, intuitive interface similar to Claude Web
- Smooth animations and transitions
- Dark mode support (with next-themes)
- Professional color scheme and typography

### 📱 Fully Responsive Design

- **Mobile**: Optimized for small screens with collapsible sidebar
- **Tablet**: Adjusted layout for medium screens
- **Desktop**: Full-featured interface with persistent sidebar
- Touch-friendly buttons and controls

### 💬 Chat Features

- **Chat History**: Persistent conversation history organized by date
- **Multiple Conversations**: Create and switch between different conversations
- **Message Management**: Delete conversations and clear entire history
- **Real-time Messages**: See messages appear with smooth animations
- **Loading States**: Visual feedback while waiting for responses
- **Message Actions**: Copy assistant messages, thumbs up/down feedback

### 🎯 User Experience

- **Auto-scrolling**: Messages automatically scroll to the latest
- **Auto-resize Textarea**: Input grows as you type (max 200px)
- **Character Counter**: Track message length (0/4000)
- **Empty State**: Helpful prompts when starting a new conversation
- **Mobile Menu**: Toggle sidebar on mobile with hamburger menu
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

### 🏗️ State Management

- **React Context API**: Centralized state management for chat
- **Conversation Grouping**: Organize history by Today, This week, This month
- **Auto-title Generation**: First message becomes conversation title

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with ChatProvider
│   ├── page.tsx             # Home page with ChatLayout
│   └── globals.css          # Global styles
├── components/
│   ├── chat-area.tsx        # Message display area
│   ├── chat-input.tsx       # Message input component
│   ├── chat-layout.tsx      # Main layout component
│   ├── header.tsx           # Top navigation header
│   ├── sidebar.tsx          # Chat history sidebar
│   └── ui/
│       ├── button.tsx       # Button component
│       ├── dropdown-menu.tsx # Dropdown menu component
│       ├── message.tsx      # Message primitives
│       └── message-scroller.tsx # Scroller component
├── context/
│   └── chat-context.tsx     # Chat state management
├── hooks/
│   └── use-mobile.ts        # Mobile detection hook
└── lib/
    └── utils.ts             # Utility functions
```

## Component Overview

### ChatLayout

Main container component that orchestrates all sub-components.

- Manages sidebar visibility
- Handles message sending logic
- Coordinates state updates

### Sidebar

Left navigation panel with:

- New chat button
- Conversation history (grouped by date)
- Delete conversation options
- Settings and logout buttons

### Header

Top navigation bar with:

- Conversation title and message count
- Mobile menu toggle
- New chat button
- More actions dropdown

### ChatArea

Message display area with:

- Auto-scrolling to latest message
- User and assistant message styling
- Loading animation
- Empty state with suggestions

### ChatInput

Message input component with:

- Auto-resizing textarea
- Send button with keyboard support
- Character counter
- Attach button (placeholder)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## Technologies Used

- **Next.js 16.3.0** - React framework with server-side rendering
- **React 19.2.8** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **next-themes** - Dark mode support
- **sonner** - Toast notifications (ready to use)
- **zod** - Schema validation

## Customization

### Changing the AI Response

Currently, the app shows mock responses. To integrate with a real API:

1. Update the `handleSendMessage` function in `chat-layout.tsx`:

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ message: content }),
});
const data = await response.json();
```

2. Create an API route at `app/api/chat/route.ts`

### Styling

- Modify Tailwind classes directly in components
- Update CSS variables in `globals.css` for theme colors
- Use the existing Tailwind configuration

### Adding Features

- **Persistence**: Add localStorage or database integration to `useChat` hook
- **Authentication**: Wrap `ChatLayout` with auth provider
- **Voice**: Integrate Web Speech API for voice input/output
- **File Upload**: Implement file attachment handling
- **Markdown**: Add markdown rendering for assistant messages

## State Management

The app uses React Context API for state management via `ChatProvider`:

```typescript
// Access chat state
const {
  conversations,
  currentConversation,
  createConversation,
  addMessage,
  deleteConversation,
  clearHistory,
} = useChat();
```

### Available Actions

- `createConversation()` - Start a new chat
- `addMessage(message)` - Add a message to current conversation
- `deleteConversation(id)` - Remove a conversation
- `setCurrentConversation(conversation)` - Switch conversations
- `clearHistory()` - Delete all conversations
- `updateConversation(id, updates)` - Update conversation details

## Responsive Breakpoints

- **Mobile**: < 640px (sm) - Single column, collapsible sidebar
- **Tablet**: 640px - 1024px (md, lg) - Responsive adjustments
- **Desktop**: ≥ 1024px (lg) - Full sidebar with all features

## Performance Optimizations

- ✅ Server-side rendering with Next.js
- ✅ Efficient re-renders with React Context
- ✅ Lazy loading of conversations
- ✅ Memoized callbacks to prevent unnecessary updates
- ✅ CSS animations for smooth transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Message search functionality
- [ ] Export conversations as PDF
- [ ] User authentication
- [ ] Conversation sharing
- [ ] Message editing and deletion
- [ ] Typing indicators
- [ ] Message reactions
- [ ] Code highlighting
- [ ] Image uploads
- [ ] Voice chat support

## Troubleshooting

### Sidebar not closing on mobile

Ensure you're clicking outside the sidebar or using the close button.

### Messages not appearing

Check that the current conversation is selected in the sidebar.

### Styling issues

Clear `.next` folder and rebuild: `rm -rf .next && npm run dev`

## Contributing

When adding new features:

1. Keep components focused and reusable
2. Use TypeScript for type safety
3. Follow the existing code style
4. Test responsive behavior
5. Update this README with new features

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, create a GitHub issue or contact the development team.
