import EyeIcon from './EyeIcon'
import LogoMark from './LogoMark'

function AuthForm({
  isRegister,
  showPassword,
  showConfirmPassword,
  submitted,
  registrationSuccess,
  loading,
  error,
  onModeChange,
  onPasswordVisibilityChange,
  onConfirmPasswordVisibilityChange,
  onSubmit,
}) {
  return (
    <section className="grid min-h-screen place-items-center px-[30px] py-[55px] max-[780px]:box-border max-[780px]:px-[22px] max-[780px]:py-8 max-[420px]:px-[18px] max-[420px]:py-[25px]">
      <div className="w-full max-w-[430px]">
        <div className="mb-[62px] hidden max-[780px]:block max-[420px]:mb-[45px]">
          <a className="inline-flex items-center gap-[11px] font-space text-2xl font-bold leading-none tracking-[-.8px] text-[#17362f] no-underline" href="/" aria-label="Chatbe home">
            <LogoMark />
            <span>chatbe</span>
          </a>
        </div>

        <div className="mb-[27px]">
          <p className="mb-[13px] text-[11px] font-bold uppercase tracking-[2px] text-[#e48f4b]">{isRegister ? 'Start your journey' : 'Welcome back'}</p>
          <h2 className="mb-2 font-space text-[32px] font-semibold leading-[1.15] tracking-[-1.3px] text-[#18332e] max-[420px]:text-[28px]">{isRegister ? 'Create your account' : 'Sign in to Chatbe'}</h2>
          <p className="m-0 text-sm text-[#82908c]">{isRegister ? 'A better way to connect starts here.' : 'Good to see you again. Let’s pick up where you left off.'}</p>
        </div>

        <div className="mb-[27px] flex gap-[5px] rounded-[9px] border border-[#e8ebe7] bg-[#f4f6f3] p-1" role="tablist" aria-label="Authentication mode">
          <button className={`flex-1 cursor-pointer rounded-md border-0 p-[10px] font-dm text-xs font-semibold ${!isRegister ? 'bg-white text-[#193832] shadow-[0_2px_6px_rgba(24,51,46,.08)]' : 'bg-transparent text-[#8a9691]'}`} onClick={() => onModeChange('login')} role="tab" aria-selected={!isRegister}>Sign in</button>
          <button className={`flex-1 cursor-pointer rounded-md border-0 p-[10px] font-dm text-xs font-semibold ${isRegister ? 'bg-white text-[#193832] shadow-[0_2px_6px_rgba(24,51,46,.08)]' : 'bg-transparent text-[#8a9691]'}`} onClick={() => onModeChange('register')} role="tab" aria-selected={isRegister}>Create account</button>
        </div>

        <form onSubmit={onSubmit}>
          {isRegister && (
            <div className="mb-[18px]">
              <label className="mb-2 block text-xs font-bold text-[#37504a]" htmlFor="name">Your name</label>
              <input className="box-border w-full rounded-[7px] border border-[#dfe5e1] bg-white px-[14px] py-[13px] text-sm text-[#18332e] outline-none transition focus:border-[#e8a05f] focus:shadow-[0_0_0_3px_rgba(232,160,95,.13)] placeholder:text-[#b0bbb7]" id="name" name="name" type="text" placeholder="How should we call you?" required />
            </div>
          )}

          <div className="mb-[18px]">
            <label className="mb-2 block text-xs font-bold text-[#37504a]" htmlFor="email">Email address</label>
            <input className="box-border w-full rounded-[7px] border border-[#dfe5e1] bg-white px-[14px] py-[13px] text-sm text-[#18332e] outline-none transition focus:border-[#e8a05f] focus:shadow-[0_0_0_3px_rgba(232,160,95,.13)] placeholder:text-[#b0bbb7]" id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="mb-[18px]">
            <div className="mb-2 flex justify-between text-xs font-bold text-[#37504a]">
              <label htmlFor="password">Password</label>
              {!isRegister && <a className="text-[11px] font-normal text-[#d98643] no-underline" href="#forgot-password">Forgot password?</a>}
            </div>
            <div className="relative">
              <input className="box-border w-full rounded-[7px] border border-[#dfe5e1] bg-white px-[14px] py-[13px] pr-[45px] text-sm text-[#18332e] outline-none transition focus:border-[#e8a05f] focus:shadow-[0_0_0_3px_rgba(232,160,95,.13)] placeholder:text-[#b0bbb7]" id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} minLength="8" required />
              <button type="button" className="absolute right-1 top-1 h-[35px] w-[35px] cursor-pointer border-0 bg-transparent text-[#9aa8a3]" onClick={onPasswordVisibilityChange} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="mb-[18px]">
              <label className="mb-2 block text-xs font-bold text-[#37504a]" htmlFor="confirm-password">Confirm password</label>
              <div className="relative">
                <input className="box-border w-full rounded-[7px] border border-[#dfe5e1] bg-white px-[14px] py-[13px] pr-[45px] text-sm text-[#18332e] outline-none transition focus:border-[#e8a05f] focus:shadow-[0_0_0_3px_rgba(232,160,95,.13)] placeholder:text-[#b0bbb7]" id="confirm-password" name="password2" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat your password" minLength="8" required />
                <button type="button" className="absolute right-1 top-1 h-[35px] w-[35px] cursor-pointer border-0 bg-transparent text-[#9aa8a3]" onClick={onConfirmPasswordVisibilityChange} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>
          )}

          {isRegister ? (
            <label className="mb-[21px] mt-0.5 flex cursor-pointer items-start gap-[9px] text-[11px] leading-[1.5] text-[#83908c]">
              <input className="mt-0.5 accent-[#e6914f]" type="checkbox" required />
              <span>I agree to the <a className="text-[#d98643] no-underline" href="#terms">Terms of Service</a> and <a className="text-[#d98643] no-underline" href="#privacy">Privacy Policy</a>.</span>
            </label>
          ) : (
            <label className="mb-[21px] mt-0.5 flex cursor-pointer items-start gap-[9px] text-[11px] leading-[1.5] text-[#83908c]">
              <input className="mt-0.5 accent-[#e6914f]" type="checkbox" />
              <span>Keep me signed in</span>
            </label>
          )}

          <button className="w-full cursor-pointer rounded-[7px] border-0 bg-[#e6914f] p-[14px] font-dm text-[13px] font-bold text-white shadow-[0_7px_15px_rgba(230,145,79,.2)] transition hover:-translate-y-px hover:bg-[#d9823e] disabled:cursor-wait disabled:opacity-70" type="submit" disabled={loading}>
            {loading ? 'Connecting...' : isRegister ? 'Create my account' : 'Continue to Chatbe'}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
          {error && <p className="my-[11px] text-center text-xs text-[#b94b42]" role="alert">{error}</p>}
          {registrationSuccess && <p className="my-[11px] text-center text-xs text-[#39836b]" role="status">Your account is ready. Please sign in.</p>}
          {submitted && !registrationSuccess && <p className="my-[11px] text-center text-xs text-[#39836b]" role="status">You’re signed in. Welcome back.</p>}
        </form>

        <div className="my-[25px] flex items-center gap-[11px] text-[10px] text-[#adb7b3] before:h-px before:flex-1 before:bg-[#e6eae7] after:h-px after:flex-1 after:bg-[#e6eae7]"><span>or continue with</span></div>
        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[7px] border border-[#dfe5e1] bg-white p-3 font-dm text-xs font-semibold text-[#536660]" type="button"><span className="font-[Arial] text-[17px] font-bold text-[#4285f4]">G</span> Continue with Google</button>

        <p className="mt-[25px] text-center text-xs text-[#84908c]">
          {isRegister ? 'Already have an account?' : 'New to Chatbe?'}
          <button className="ml-[5px] cursor-pointer border-0 bg-transparent p-0 font-dm text-xs font-bold text-[#d98643]" onClick={() => onModeChange(isRegister ? 'login' : 'register')}>{isRegister ? 'Sign in' : 'Create an account'}</button>
        </p>
        <p className="mt-[58px] text-center text-[10px] text-[#b3bcb8] max-[420px]:mt-10">© 2025 Chatbe, Inc. Made for meaningful conversations.</p>
      </div>
    </section>
  )
}

export default AuthForm
