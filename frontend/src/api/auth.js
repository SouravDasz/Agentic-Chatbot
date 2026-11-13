const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function sendRequest(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((error) => error.msg).join(', ')
      : data.detail

    throw new Error(detail || 'Request failed')
  }

  return data
}

export function registerUser(name, email, password, password2) {
  return sendRequest('/auth/register', {
    name,
    email,
    password,
    password2,
  })
}

export function loginUser(email, password) {
  return sendRequest('/auth/login', {
    email,
    password,
  })
}
