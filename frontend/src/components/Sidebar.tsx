
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Settings,
  PanelLeftClose,
  ChevronDown,
} from 'lucide-react'

import type { Conversation } from '../services/chatService'

interface SidebarProps {
  onNewChat: () => void
  conversations: Conversation[]
  activeConversationId: number | null
  onSelectConversation: (id: number) => void
}

function Sidebar({
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>
          <span>NOVA</span>
        </div>

        <button className="icon-button" title="Collapse sidebar">
          <PanelLeftClose size={19} />
        </button>
      </div>

      <button className="new-chat-button" onClick={onNewChat}>
        <Plus size={18} />
        <span>New conversation</span>
      </button>

      <div className="sidebar-search">
        <Search size={17} />
        <input placeholder="Search conversations" />
        <span className="shortcut">⌘ K</span>
      </div>

      <div className="sidebar-section">
        <p className="section-label">WORKSPACE</p>

        <button className="nav-item active">
          <MessageSquare size={18} />
          <span>All conversations</span>
        </button>
      </div>

      <div className="history-section">
        <p className="section-label">RECENT</p>

        {conversations.length === 0 ? (
          <div className="history-empty">
            Your conversations will appear here.
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`nav-item history-item ${
                activeConversationId === conversation.id ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
              title={conversation.title}
            >
              <MessageSquare size={17} />
              <span>{conversation.title}</span>
            </button>
          ))
        )}
      </div>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="profile">
          <div className="avatar">R</div>

          <div className="profile-info">
            <span className="profile-name">My Account</span>
            <span className="profile-plan">Personal workspace</span>
          </div>

          <ChevronDown size={16} />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
