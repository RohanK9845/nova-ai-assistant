import { Paperclip, ArrowUp } from 'lucide-react'

interface MessageComposerProps {
  message: string
  onMessageChange: (text: string) => void
  onSend: () => void
}

function MessageComposer({
  message,
  onMessageChange,
  onSend,
}: MessageComposerProps) {
  return (
    <div className="composer-container">
      <div className="composer">
        <textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Message NOVA..."
          rows={2}
        />

        <div className="composer-actions">
          <button className="attachment-button" title="Attach file">
            <Paperclip size={19} />
          </button>

          <button
            className="send-button"
            disabled={!message.trim()}
            onClick={onSend}
            title="Send message"
          >
            <ArrowUp size={19} />
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