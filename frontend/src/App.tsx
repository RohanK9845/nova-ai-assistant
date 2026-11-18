import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import MessageComposer from './components/MessageComposer'
import ThemeToggle from './components/ThemeToggle'



import './App.css'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [message, setMessage] = useState('')

  const isDark = theme === 'dark'

  return (
    <div className={`nova-app ${theme}`}>

      {/* Sidebar */}
      {/* Sidebar Component */}
<Sidebar
  onNewChat={() => {
    setMessage('')
  }}
/>

      {/* Main content */}
      <main className="main-content">

        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>New conversation</strong>
          </div>

          <ThemeToggle
  isDark={isDark}
  onToggle={() => setTheme(isDark ? 'light' : 'dark')}
/>
        </header>

        <section className="chat-area">

          <ChatArea onSuggestionSelect={setMessage} />

          {/* Message composer */}
        <MessageComposer
  message={message}
  onMessageChange={setMessage}
  onSend={() => {
    alert("We'll connect NOVA to its AI backend in a later milestone.")
  }}
/>

        </section>

      </main>
    </div>
  )
}

export default App