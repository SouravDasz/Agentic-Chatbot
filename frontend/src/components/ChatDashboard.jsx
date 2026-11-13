import { useState } from 'react'
import LogoMark from './LogoMark'

const suggestions = ['Help me brainstorm', 'Explain something', 'Write with me']

function ChatDashboard() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I’m ready when you are. What would you like to explore today?',
    },
  ])

  function handleLogout() {
    localStorage.removeItem('chatbe_access_token')
    window.history.pushState({}, '', '/')
    window.location.reload()
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: 'user', content: trimmedMessage },
      {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Thanks for sharing that. I’m ready to help you think it through.',
      },
    ])
    setMessage('')
  }

  return (
    <main className="flex min-h-screen bg-[#fbfaf8] font-dm text-[#18332e]">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#172e2a] px-5 py-7 text-white md:flex">
        <a className="mb-12 inline-flex items-center gap-[11px] font-space text-2xl font-bold leading-none tracking-[-.8px] text-white no-underline" href="/" aria-label="Chatbe home">
          <LogoMark />
          <span>chatbe</span>
        </a>

        <button className="mb-8 flex w-full items-center justify-center gap-2 rounded-[7px] border border-[#55736a] bg-[#f2a35e] px-4 py-3 text-sm font-bold text-[#243932] transition hover:bg-[#e6914f]" type="button" onClick={() => setMessages([])}>
          <span className="text-lg leading-none">+</span> New conversation
        </button>

        <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.8px] text-[#83a096]">Workspace</p>
        <nav className="space-y-1" aria-label="Workspace navigation">
          <a className="flex items-center gap-3 rounded-lg bg-[#28453e] px-3 py-3 text-sm text-[#f8f6f1] no-underline" href="#chat">
            <span className="text-[#f2a35e]">✦</span> Chat
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#b7c8c0] no-underline hover:bg-[#28453e] hover:text-white" href="#history">
            <span>◷</span> History
          </a>
        </nav>

        <div className="mt-auto border-t border-[#345149] pt-5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-[#b7c8c0] hover:bg-[#28453e] hover:text-white" type="button" onClick={handleLogout}>
            <span>↪</span> Log out
          </button>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e8ebe7] bg-white px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#17362f] text-white md:hidden"><LogoMark /></div>
            <div>
              <p className="m-0 font-space text-base font-semibold text-[#18332e]">New conversation</p>
              <p className="m-0 text-xs text-[#9aa8a3]">Chatbe workspace</p>
            </div>
          </div>
          <button className="rounded-[7px] border border-[#dfe5e1] bg-white px-[13px] py-2 text-xs font-semibold text-[#536660] hover:border-[#e6914f] hover:text-[#d98643] md:hidden" type="button" onClick={handleLogout}>Log out</button>
          <div className="hidden items-center gap-3 md:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f2a35e] text-xs font-bold text-[#243932]">A</span>
            <span className="text-sm font-semibold text-[#536660]">Alex</span>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12">
          <div className="mb-8 flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[#17362f] text-white"><LogoMark /></div>
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-[#e48f4b]">Your space to think out loud</p>
              <h1 className="font-space text-[clamp(28px,4vw,42px)] font-semibold leading-tight tracking-[-1.8px] text-[#18332e]">What&apos;s on your mind?</h1>
              <p className="mt-2 text-sm text-[#82908c]">Start a conversation and make space for better ideas.</p>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto pb-5">
            {messages.map((currentMessage) => (
              <div className={`flex ${currentMessage.role === 'user' ? 'justify-end' : 'justify-start'}`} key={currentMessage.id}>
                <p className={`m-0 max-w-[min(85%,560px)] rounded-2xl px-4 py-3 text-sm leading-6 ${currentMessage.role === 'user' ? 'rounded-br-sm bg-[#f7ede4] text-[#536660]' : 'rounded-bl-sm bg-white text-[#536660] shadow-[0_4px_16px_rgba(24,51,46,.05)]'}`}>
                  {currentMessage.content}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button className="cursor-pointer rounded-[20px] border border-[#e8ebe7] bg-transparent px-[13px] py-[9px] text-[11px] text-[#71807a] hover:border-[#e8a05f] hover:text-[#d98643]" type="button" key={suggestion} onClick={() => setMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
            <form className="flex gap-[10px] rounded-[10px] border border-[#dfe5e1] bg-white p-[7px] pl-[17px] shadow-[0_12px_30px_rgba(24,51,46,.06)]" onSubmit={handleSubmit}>
              <input className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#18332e] outline-none placeholder:text-[#adb8b4]" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share what’s on your mind..." aria-label="Message" />
              <button className="h-[35px] w-[35px] cursor-pointer rounded-[7px] border-0 bg-[#e6914f] text-xl leading-none text-white disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={!message.trim()} aria-label="Send message">↑</button>
            </form>
            <p className="mt-3 text-center text-[10px] text-[#adb8b4]">Chatbe can make mistakes. Check important information.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ChatDashboard
