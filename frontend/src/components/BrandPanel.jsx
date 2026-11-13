import LogoMark from './LogoMark'

function BrandPanel() {
  return (
    <section className="relative hidden min-h-screen items-center overflow-hidden bg-[#172e2a] px-[clamp(38px,6vw,98px)] py-12 text-white min-[781px]:flex">
      <div className="relative z-10 mx-auto w-full max-w-[440px]">
        <a className="inline-flex items-center gap-[11px] font-space text-2xl font-bold leading-none tracking-[-.8px] text-inherit no-underline" href="/" aria-label="Chatbe home">
          <LogoMark />
          <span>chatbe</span>
        </a>

        <div className="mt-[clamp(100px,17vh,185px)]">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#f2a35e]">Your conversations, elevated</p>
          <h1 className="my-[18px] mb-6 font-space text-[clamp(42px,5vw,68px)] font-semibold leading-[1.02] tracking-[-3.2px] text-[#f8f6f1]">Make space for<br /><em className="not-italic text-[#f2a35e]">better ideas.</em></h1>
          <p className="max-w-[350px] text-[15px] leading-[1.75] text-[#b7c8c0]">
            Chatbe brings your people, ideas, and everyday conversations together in one calm, focused space.
          </p>
        </div>

        <div className="mt-[clamp(75px,12vh,135px)] flex items-center gap-4 text-[13px] leading-[1.55] text-[#dae3de]">
          <div className="flex pl-2" aria-hidden="true">
            <span className="relative ml-[-8px] grid h-[31px] w-[31px] place-items-center rounded-full border-2 border-[#172e2a] bg-[#b77c65] text-[8px] font-bold">AM</span>
            <span className="relative ml-[-8px] grid h-[31px] w-[31px] place-items-center rounded-full border-2 border-[#172e2a] bg-[#6f8998] text-[8px] font-bold">JR</span>
            <span className="relative ml-[-8px] grid h-[31px] w-[31px] place-items-center rounded-full border-2 border-[#172e2a] bg-[#9c7d9d] text-[8px] font-bold">SK</span>
            <span className="relative ml-[-8px] grid h-[31px] w-[31px] place-items-center rounded-full border-2 border-[#172e2a] bg-[#f2a35e] text-[8px] font-bold text-[#243932]">+</span>
          </div>
          <p className="m-0">Join 12,000+ curious minds<br /><span className="text-[#83a096]">already chatting on Chatbe</span></p>
        </div>
      </div>
      <div className="absolute right-[-310px] top-[-105px] h-[510px] w-[510px] rounded-full border border-[rgba(242,163,94,.12)]" />
      <div className="absolute bottom-[-180px] left-[-250px] h-[370px] w-[370px] rounded-full border border-[rgba(242,163,94,.12)]" />
      <div className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(135deg,transparent_20%,#000_65%)]" />
    </section>
  )
}

export default BrandPanel
