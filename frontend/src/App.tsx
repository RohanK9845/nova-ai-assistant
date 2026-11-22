
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea, { type Message } from './components/ChatArea'
import MessageComposer from './components/MessageComposer'
import ThemeToggle from './components/ThemeToggle'
import { checkBackendHealth } from './services/healthService'
import { sendChatMessage } from './services/chatService'

import './App.css'

type ConnectionStatus = 'checking' | 'connected' | 'disconnected'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('checking')

  const isDark = theme === 'dark'

  useEffect(() => {
    let isMounted = true

    const checkConnection = async () => {
      try {
        await checkBackendHealth()

        if (isMounted) {
          setConnectionStatus('connected')
        }
      } catch {
        if (isMounted) {
          setConnectionStatus('disconnected')
        }
      }
    }

    checkConnection()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage,
    }

    setMessages((previous) => [...previous, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const reply = await sendChatMessage(trimmedMessage)

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: reply,
      }

      setMessages((previous) => [...previous, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: "I'm sorry, I couldn't generate a response. Please check your connection and try again.",
      }

      setMessages((previous) => [...previous, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    if (isLoading) return

    setMessage('')
    setMessages([])
  }

  return (
    <div className={`nova-app ${theme}`}>
      <Sidebar onNewChat={handleNewChat} />

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>New conversation</strong>
          </div>

          <div className="topbar-actions">
            <div className={`backend-status ${connectionStatus}`}>
              <span className="status-dot"></span>

              {connectionStatus === 'checking' && 'Connecting...'}
              {connectionStatus === 'connected' && 'Backend Connected'}
              {connectionStatus === 'disconnected' && 'Backend Offline'}
            </div>

            <ThemeToggle
              isDark={isDark}
              onToggle={() => setTheme(isDark ? 'light' : 'dark')}
            />
          </div>
        </header>

        <section className="chat-area">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onSuggestionSelect={setMessage}
          />

          <MessageComposer
            message={message}
            onMessageChange={setMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  )
}

export default App
