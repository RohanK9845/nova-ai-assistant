
import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import ChatMessage from './ChatMessage'


export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  onSuggestionSelect: (text: string) => void
}

function ChatArea({
  messages,
  isLoading,
  onSuggestionSelect,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  })
}, [messages, isLoading])
  if (messages.length > 0) {
    return (
      <div className="conversation-container">
        <div className="conversation-messages">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}

          {isLoading && (
            <div className="chat-message assistant-message">
              <div className="message-avatar">
                <Sparkles size={18} />
              </div>

              <div className="message-content">
                <span className="message-author">NOVA</span>
                <p className="typing-indicator">NOVA is thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  }

  return (
    <div className="welcome-content">
      <div className="welcome-icon">
        <Sparkles size={30} />
      </div>

      <p className="welcome-eyebrow">
        YOUR PERSONAL AI ASSISTANT
      </p>

      <h1>
        Hello, welcome to <span>NOVA.</span>
      </h1>

      <p className="welcome-description">
        Your ideas, knowledge and productivity — all in one place.
        What would you like to explore today?
      </p>

      <div className="suggestion-grid">
        <button
          className="suggestion-card"
          onClick={() => onSuggestionSelect('Help me brainstorm a new project')}
        >
          <span className="suggestion-icon">✦</span>
          <span className="suggestion-title">Brainstorm ideas</span>
          <span className="suggestion-description">
            Explore ideas and solve problems
          </span>
        </button>

        <button
          className="suggestion-card"
          onClick={() => onSuggestionSelect('Help me understand a complex topic')}
        >
          <span className="suggestion-icon">⌘</span>
          <span className="suggestion-title">Learn something</span>
          <span className="suggestion-description">
            Understand complex topics
          </span>
        </button>

        <button
          className="suggestion-card"
          onClick={() => onSuggestionSelect('Help me write something')}
        >
          <span className="suggestion-icon">✎</span>
          <span className="suggestion-title">Write something</span>
          <span className="suggestion-description">
            Create, improve and refine text
          </span>
        </button>

        <button
          className="suggestion-card"
          onClick={() => onSuggestionSelect('Help me analyze my documents')}
        >
          <span className="suggestion-icon">▤</span>
          <span className="suggestion-title">Analyze documents</span>
          <span className="suggestion-description">
            Extract insights from your files
          </span>
        </button>
      </div>
    </div>
  )
}

export default ChatArea
