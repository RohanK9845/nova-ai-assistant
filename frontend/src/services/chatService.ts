
import API from './api'

export interface ChatResponse {
  status: string
  reply: string
}

export const sendChatMessage = async (
  message: string
): Promise<string> => {
  const response = await API.post<ChatResponse>('/chat', {
    message,
  })

  return response.data.reply
}
