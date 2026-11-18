import { Sparkles } from 'lucide-react'

interface ChatAreaProps {
  onSuggestionSelect: (text: string) => void
}

function ChatArea({ onSuggestionSelect }: ChatAreaProps) {
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