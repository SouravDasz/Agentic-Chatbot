const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    localStorage.removeItem('chatbe_access_token')
    localStorage.removeItem('chatbe_user_name')
    window.location.replace('/auth')
    return
  }

  if (!response.ok) {
    throw new Error(data.detail || fallbackMessage)
  }

  return data
}

export async function createChat(token) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseResponse(response, 'Unable to create a conversation')
}

export async function getConversations(token) {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseResponse(response, 'Unable to load conversations')
}

export async function sendMessage(token, chatId, message) {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  return parseResponse(response, 'Unable to send message')
}
