
import { Paperclip, ArrowUp, LoaderCircle } from 'lucide-react'

interface MessageComposerProps {
  message: string
  onMessageChange: (text: string) => void
  onSend: () => void
  isLoading: boolean
}

function MessageComposer({
  message,
  onMessageChange,
  onSend,
  isLoading,
}: MessageComposerProps) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (message.trim() && !isLoading) {
        onSend()
      }
    }
  }

  return (
    <div className="composer-container">
      <div className="composer">
        <textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message NOVA..."
          rows={2}
          disabled={isLoading}
        />

        <div className="composer-actions">
          <button
            className="attachment-button"
            title="Attach file"
            type="button"
            disabled
          >
            <Paperclip size={19} />
          </button>

          <button
            className="send-button"
            disabled={!message.trim() || isLoading}
            onClick={onSend}
            title={isLoading ? 'NOVA is thinking...' : 'Send message'}
            type="button"
          >
            {isLoading ? (
              <LoaderCircle size={19} className="loading-icon" />
            ) : (
              <ArrowUp size={19} />
            )}
          </button>
        </div>
      </div>

      <p className="composer-disclaimer">
        NOVA can make mistakes. Verify important information.
      </p>
    </div>
  )
}

export default MessageComposer
