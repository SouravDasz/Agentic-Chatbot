import { useEffect, useState } from 'react'
import { loginUser, registerUser } from './api/auth'
import AuthForm from './components/AuthForm'
import BrandPanel from './components/BrandPanel'
import ChatDashboard from './components/ChatDashboard'
import LandingPage from './components/LandingPage'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!pathname.startsWith('/chat') || localStorage.getItem('chatbe_access_token')) {
      return
    }

    window.history.replaceState({}, '', '/auth')
    setPathname('/auth')
  }, [pathname])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(false)
    setRegistrationSuccess(false)
    setError('')
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = mode === 'register'
        ? await registerUser(
          formData.get('name'),
          email,
          password,
          formData.get('password2'),
        )
        : await loginUser(email, password)

      if (response.access_token) {
        localStorage.setItem('chatbe_access_token', response.access_token)
        localStorage.setItem('chatbe_user_name', response.name)
      }

      if (mode === 'login') {
        window.history.pushState({}, '', '/chat')
        setPathname('/chat')
        return
      }

      setMode('login')
      setRegistrationSuccess(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }

  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setSubmitted(false)
    setRegistrationSuccess(false)
    setError('')
  }

  function openAuth() {
    const nextPath = localStorage.getItem('chatbe_access_token') ? '/chat' : '/auth'
    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }

  if (pathname.startsWith('/chat')) {
    if (!localStorage.getItem('chatbe_access_token')) {
      return null
    }

    return <ChatDashboard />
  }

  if (pathname === '/') {
    return <LandingPage onGetStarted={openAuth} />
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#fbfaf8] min-[781px]:grid-cols-[minmax(390px,42%)_1fr]">
      <BrandPanel />
      <AuthForm
        isRegister={mode === 'register'}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        submitted={submitted}
        registrationSuccess={registrationSuccess}
        loading={loading}
        error={error}
        onModeChange={switchMode}
        onPasswordVisibilityChange={() => setShowPassword(!showPassword)}
        onConfirmPasswordVisibilityChange={() => setShowConfirmPassword(!showConfirmPassword)}
        onSubmit={handleSubmit}
      />
    </main>
  )
}

export default App
