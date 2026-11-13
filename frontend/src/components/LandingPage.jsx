import LogoMark from './LogoMark'

function LandingPage({ onGetStarted }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#172e2a] text-[#f8f6f1]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
        <a className="inline-flex items-center gap-[11px] font-space text-2xl font-bold leading-none tracking-[-.8px] text-[#f8f6f1] no-underline" href="/" aria-label="Chatbe home">
          <LogoMark />
          <span>chatbe</span>
        </a>
        <button className="cursor-pointer rounded-[7px] border border-[#55736a] bg-transparent px-[15px] py-[9px] font-dm text-xs font-semibold text-[#dae3de] transition hover:border-[#f2a35e] hover:text-[#f2a35e]" type="button" onClick={onGetStarted}>
          Sign in
        </button>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-95px)] w-full max-w-7xl items-center gap-14 px-6 pb-16 pt-12 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:px-16 lg:pb-24 lg:pt-0">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-[#e48f4b]">Your conversations, elevated</p>
          <h1 className="mb-6 max-w-[680px] font-space text-[clamp(46px,7vw,86px)] font-semibold leading-[.98] tracking-[-4px] text-[#f8f6f1]">
            Make space for <span className="text-[#f2a35e]">better ideas.</span>
          </h1>
          <p className="mb-9 max-w-[490px] text-base leading-8 text-[#b7c8c0] sm:text-lg">
            Chatbe brings your people, ideas, and everyday conversations together in one calm, focused space.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="cursor-pointer rounded-[7px] border-0 bg-[#e6914f] px-6 py-4 font-dm text-sm font-bold text-white shadow-[0_10px_24px_rgba(230,145,79,.24)] transition hover:-translate-y-0.5 hover:bg-[#d9823e]" type="button" onClick={onGetStarted}>
              Get started <span className="ml-2 text-lg" aria-hidden="true">→</span>
            </button>
            <span className="text-xs text-[#83a096]">Free to start · No credit card required</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[rgba(242,163,94,.3)]" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-[rgba(242,163,94,.25)]" />
          <div className="relative rounded-[22px] border border-[#e8ebe7] bg-white p-5 shadow-[0_24px_70px_rgba(24,51,46,.1)] sm:p-7">
            <div className="mb-8 flex items-center justify-between border-b border-[#eef1ee] pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17362f] text-white"><LogoMark /></span>
                <div>
                  <p className="m-0 font-space text-sm font-semibold text-[#18332e]">Good morning, Alex</p>
                  <p className="m-0 text-xs text-[#9aa8a3]">What are you thinking about?</p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#e6914f]" />
            </div>
            <div className="space-y-4">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-[#f7ede4] p-4 text-sm leading-6 text-[#536660]">Help me find a fresh perspective on my project.</div>
              <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-[#f1f5f2] p-4 text-sm leading-6 text-[#536660]">Let’s explore it together. Start by telling me what you want to make possible.</div>
            </div>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#dfe5e1] p-2 pl-4 text-sm text-[#adb8b4]">
              <span className="flex-1">Share what’s on your mind...</span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e6914f] text-lg text-white">↑</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-32 top-1/4 h-[520px] w-[520px] rounded-full bg-[#f2a35e]/[.1] blur-3xl" />
      </section>
    </main>
  )
}

export default LandingPage
