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

export async function getChatMessages(token, chatId) {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseResponse(response, 'Unable to load conversation messages')
}

export async function sendMessage(token, chatId, message, onEvent) {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (response.status === 401) {
    localStorage.removeItem('chatbe_access_token')
    localStorage.removeItem('chatbe_user_name')
    window.location.replace('/auth')
    return
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'Unable to send message')
  }

  if (!response.body) {
    throw new Error('Unable to stream the assistant response')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  function processEvent(rawEvent) {
    const eventLines = rawEvent.split(/\r?\n/)
    const eventName = eventLines
      .find((line) => line.startsWith('event:'))
      ?.slice(6)
      .trim()
    const data = eventLines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n')

    if (!eventName || !data) {
      return
    }

    const parsedData = JSON.parse(data)
    if (eventName === 'error') {
      throw new Error(parsedData.detail || 'Unable to send message')
    }

    onEvent?.(eventName, parsedData)
  }

  while (true) {
    const { value, done } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })

    let separatorIndex = buffer.search(/\r?\n\r?\n/)
    while (separatorIndex !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex)
      buffer = buffer.slice(separatorIndex).replace(/^\r?\n\r?\n/, '')
      processEvent(rawEvent)
      separatorIndex = buffer.search(/\r?\n\r?\n/)
    }

    if (done) {
      if (buffer.trim()) {
        processEvent(buffer)
      }
      break
    }
  }
}
