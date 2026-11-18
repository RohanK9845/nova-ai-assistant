import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Settings,
  PanelLeftClose,
  ChevronDown,
} from 'lucide-react'

interface SidebarProps {
  onNewChat: () => void
}

function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <aside className="sidebar">

      {/* Brand */}
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

      {/* New conversation */}
      <button className="new-chat-button" onClick={onNewChat}>
        <Plus size={18} />
        <span>New conversation</span>
      </button>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={17} />
        <input placeholder="Search conversations" />
        <span className="shortcut">⌘ K</span>
      </div>

      {/* Navigation */}
      <div className="sidebar-section">
        <p className="section-label">WORKSPACE</p>

        <button className="nav-item active">
          <MessageSquare size={18} />
          <span>All conversations</span>
        </button>
      </div>

      {/* Recent conversations */}
      <div className="history-section">
        <p className="section-label">RECENT</p>

        <div className="history-empty">
          Your conversations will appear here.
        </div>
      </div>

      {/* Bottom navigation */}
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