# API Integration Guide

This guide shows how to connect the Elevate AI Chat UI to a real backend API.

## Overview

The chat UI is currently using mock responses. To integrate with a real API:

1. Create a backend endpoint that accepts messages and returns AI responses
2. Update the ChatLayout component to call your API
3. Handle errors and loading states gracefully

## Step 1: Create Backend API Route

### Option A: Using Next.js API Route (Recommended for quick setup)

Create `app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Option 1: Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });

    // Option 2: Call your custom backend
    // const customResponse = await fetch('http://your-backend.com/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message }),
    // })
    //
    // const customData = await customResponse.json()
    // return NextResponse.json({ message: customData.response })
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
```

### Option B: Using External Backend

If you have your own backend server:

Create `app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ message: data.response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
```

## Step 2: Set Environment Variables

Create `.env.local` in the project root:

```bash
# For OpenAI
OPENAI_API_KEY=sk_test_your_key_here

# For custom backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_API_KEY=your_api_key_here
```

## Step 3: Update ChatLayout Component

Edit `components/chat-layout.tsx` and replace the mock response section:

### Before (Mock Response):

```typescript
const handleSendMessage = async (content: string) => {
  if (!currentConversation) return;

  const userMessage: Message = {
    id: `msg-${Date.now()}-${Math.random()}`,
    content,
    role: "user",
    timestamp: new Date(),
  };

  addMessage(userMessage);
  setIsLoading(true);

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses = [
      "That's a great question!",
      "I appreciate your input...",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      content: randomResponse,
      role: "assistant",
      timestamp: new Date(),
    };

    addMessage(assistantMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### After (Real API):

```typescript
const handleSendMessage = async (content: string) => {
  if (!currentConversation) return;

  const userMessage: Message = {
    id: `msg-${Date.now()}-${Math.random()}`,
    content,
    role: "user",
    timestamp: new Date(),
  };

  addMessage(userMessage);
  setIsLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content,
        conversationId: currentConversation.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    const data = await response.json();

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      content: data.message,
      role: "assistant",
      timestamp: new Date(),
    };

    addMessage(assistantMessage);
  } catch (error) {
    console.error("Error sending message:", error);

    // Optional: Show error message to user
    const errorMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      content: "Sorry, I encountered an error. Please try again.",
      role: "assistant",
      timestamp: new Date(),
    };
    addMessage(errorMessage);
  } finally {
    setIsLoading(false);
  }
};
```

## Step 4: Add Error Handling

Improve error handling in `components/chat-area.tsx`:

```typescript
// Add error state handling
interface ChatAreaProps {
  messages: Message[]
  isLoading?: boolean
  error?: string | null
}

// In render:
{error && (
  <div className="mx-auto max-w-4xl px-4 py-4">
    <div className="rounded-lg bg-destructive/10 p-3 text-destructive">
      <p className="text-sm font-medium">Error</p>
      <p className="text-xs mt-1">{error}</p>
    </div>
  </div>
)}
```

## Step 5: Handle Conversation Context (Optional)

If your backend supports multi-turn conversations:

Update the API route to include conversation history:

```typescript
// In app/api/chat/route.ts
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...conversationHistory.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: message },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return NextResponse.json({
      message: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
```

And update ChatLayout to pass history:

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: content,
    conversationHistory: currentConversation.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  }),
});
```

## Step 6: Add Request Validation (Optional)

Use Zod for validation in `app/api/chat/route.ts`:

```typescript
import { z } from "zod";

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const { message, conversationId } = ChatRequestSchema.parse(body);

    // ... rest of your code
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }
    // ... handle other errors
  }
}
```

## Example Backend Implementations

### Python Flask Backend

```python
from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)
client = OpenAI(api_key="your-key")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}]
    )

    return jsonify({
        "response": response.choices[0].message.content
    })

if __name__ == '__main__':
    app.run(debug=True, port=8000)
```

### Node.js Express Backend

```typescript
import express from "express";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY }),
);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ response: response.data.choices[0].message?.content });
  } catch (error) {
    res.status(500).json({ error: "Failed to process message" });
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));
```

## Testing the Integration

1. Start your backend/API service
2. Update environment variables
3. Run development server: `npm run dev`
4. Send a test message
5. Check browser console for errors
6. Verify response appears in chat

## Debugging Tips

1. **Check Network Tab**: Inspect API requests/responses in DevTools
2. **Server Logs**: Monitor backend logs for errors
3. **Browser Console**: Look for client-side errors
4. **Test API Directly**: Use Postman or curl to test endpoint independently
5. **Add Logging**: Log requests/responses for debugging

```typescript
// Add to chat API route
console.log("Incoming message:", message);
console.log("API Response:", data);
```

## Rate Limiting & Best Practices

Add rate limiting to prevent abuse:

```typescript
// Use a package like rate-limiter-flexible
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

export async function POST(request: NextRequest) {
  try {
    // Get user IP (simple approach)
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    await rateLimiter.consume(ip);
    // ... rest of logic
  } catch (error) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
}
```

## Security Considerations

1. **Never expose API keys client-side**: Keep keys in `.env.local`
2. **Validate input**: Always sanitize user messages
3. **Use HTTPS**: In production, always use secure connections
4. **Add authentication**: Require user login for API access
5. **Log appropriately**: Don't log sensitive data
6. **Add CORS**: Restrict API access if needed

```typescript
// In Next.js API route, CORS is handled automatically
// For external APIs, add:
const headers = new Headers();
headers.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
```

---

**Next Steps**: Test your integration, monitor performance, and iterate!
