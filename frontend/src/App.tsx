
import { useEffect, useState } from 'react'

import Sidebar from './components/Sidebar'
import ChatArea, { type Message } from './components/ChatArea'
import MessageComposer from './components/MessageComposer'
import ThemeToggle from './components/ThemeToggle'

import { checkBackendHealth } from './services/healthService'

import {
  createConversation,
  getConversations,
  getConversationMessages,
  sendChatMessage,
  type Conversation,
} from './services/chatService'

import './App.css'

type ConnectionStatus = 'checking' | 'connected' | 'disconnected'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('checking')

  const isDark = theme === 'dark'

  // Initialize the application
  useEffect(() => {
    let isMounted = true

    const initializeApp = async () => {
      try {
        await checkBackendHealth()

        if (isMounted) {
          setConnectionStatus('connected')
        }

        const savedConversations = await getConversations()

        if (!isMounted) return

        setConversations(savedConversations)

        if (savedConversations.length > 0) {
          const latestConversation = savedConversations[0]

          const savedMessages = await getConversationMessages(
            latestConversation.id
          )

          if (!isMounted) return

          setConversationId(latestConversation.id)

          setMessages(
            savedMessages.map((item) => ({
              id: item.id.toString(),
              role: item.role,
              content: item.content,
            }))
          )
        }
      } catch (error) {
        console.error('NOVA initialization failed:', error)

        if (isMounted) {
          setConnectionStatus('disconnected')
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false)
        }
      }
    }

    initializeApp()

    return () => {
      isMounted = false
    }
  }, [])

  // Select an existing conversation
  const handleSelectConversation = async (id: number) => {
    if (isLoading || isInitializing) return

    setIsLoading(true)
    setMessage('')
    setMessages([])
    setConversationId(id)

    try {
      const savedMessages = await getConversationMessages(id)

      setMessages(
        savedMessages.map((item) => ({
          id: item.id.toString(),
          role: item.role,
          content: item.content,
        }))
      )
    } catch (error) {
      console.error('Could not load conversation:', error)

      setMessages([
        {
          id: 'load-error',
          role: 'assistant',
          content: 'Could not load this conversation. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Send a message
  const handleSendMessage = async () => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || isLoading || isInitializing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage,
    }

    setMessages((previous) => [...previous, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      let activeConversationId = conversationId

      // Create a new database conversation if needed
      if (activeConversationId === null) {
        const newConversation = await createConversation()

        activeConversationId = newConversation.id

        setConversationId(newConversation.id)

        setConversations((previous) => [
          newConversation,
          ...previous,
        ])
      }

      const reply = await sendChatMessage(
        trimmedMessage,
        activeConversationId
      )

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: reply,
      }

      setMessages((previous) => [...previous, assistantMessage])

      const updatedConversations = await getConversations()
      setConversations(updatedConversations)
    } catch (error) {
      console.error('Message sending failed:', error)

      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content:
          "I'm sorry, I couldn't generate a response. Please check your connection and try again.",
      }

      setMessages((previous) => [...previous, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Start a completely new chat
  const handleNewChat = () => {
    if (isLoading || isInitializing) return

    setMessage('')
    setMessages([])
    setConversationId(null)
  }

  return (
    <div className={`nova-app ${theme}`}>
      <Sidebar
        onNewChat={handleNewChat}
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>
              {conversationId === null
                ? 'New conversation'
                : conversations.find(
                    (item) => item.id === conversationId
                  )?.title || 'Conversation'}
            </strong>
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
            isLoading={isLoading || isInitializing}
          />
        </section>
      </main>
    </div>
  )
}

export default App
 