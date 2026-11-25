
import API from './api'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Conversation {
  id: number
  title: string
  created_at: string
  updated_at: string
}

interface ChatResponse {
  status: string
  conversation_id: number
  reply: string
  messages: {
    user: number
    assistant: number
  }
}

interface ConversationsResponse {
  status: string
  conversations: Conversation[]
}

interface CreateConversationResponse {
  status: string
  conversation: Conversation
}

interface MessagesResponse {
  status: string
  conversation_id: number
  messages: ChatMessage[]
}

export const createConversation = async (): Promise<Conversation> => {
  const response = await API.post<CreateConversationResponse>('/conversations')
  return response.data.conversation
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await API.get<ConversationsResponse>('/conversations')
  return response.data.conversations
}

export const getConversationMessages = async (
  conversationId: number
): Promise<ChatMessage[]> => {
  const response = await API.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`
  )
  return response.data.messages
}

export const sendChatMessage = async (
  message: string,
  conversationId: number
): Promise<string> => {
  const response = await API.post<ChatResponse>('/chat', {
    message,
    conversation_id: conversationId,
  })

  return response.data.reply
}
