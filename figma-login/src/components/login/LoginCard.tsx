import { FormEvent, useState } from 'react'
import { Mail } from 'lucide-react'
import { FormField } from './FormField'
import { SocialButton } from './SocialButton'

export function LoginCard() {
  const [message, setMessage] = useState('')
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('Signed in successfully.')
  }

  return (
    <div className="mx-auto w-full max-w-[265px] text-[#101a2d] sm:max-w-[266px]">
      <header className="mb-8">
        <h1 className="text-[23px] font-semibold leading-tight tracking-[-0.7px]">Welcome Back</h1>
        <p className="mt-4 text-[12px] leading-[1.8] text-[#34405a]">Today is a new day. It's your day. You shape it.<br />Sign in to start managing your projects.</p>
      </header>
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField id="email" label="Email" type="email" placeholder="Example@email.com" autoComplete="email" />
        <FormField id="password" label="Password" type="password" placeholder="At least 8 characters" autoComplete="current-password" />
        <div className="pt-0.5 text-right"><a className="text-[11px] font-medium text-[#2559ee] hover:underline" href="#forgot">Forgot Password?</a></div>
        <button className="mt-2 h-9 w-full rounded-[7px] bg-[#153442] text-[12px] font-medium text-white transition hover:bg-[#20495b]" type="submit">Sign in</button>
      </form>
      {message && <p className="mt-2 text-center text-[11px] text-emerald-700" role="status">{message}</p>}
      <div className="my-9 flex items-center gap-3 text-[11px] text-[#526174]"><span className="h-px flex-1 bg-[#e5e9ee]" />Or<span className="h-px flex-1 bg-[#e5e9ee]" /></div>
      <div className="space-y-3">
        <SocialButton provider="Google" icon={<Mail className="h-4 w-4 text-[#4285f4]" />} />
        <SocialButton provider="Facebook" icon={<span className="grid h-[19px] w-[19px] place-items-center rounded-full bg-[#1877f2] text-[14px] font-bold text-white">f</span>} />
      </div>
      <p className="mt-9 text-center text-[12px] text-[#3f4a61]">Don't you have an account? <a className="font-medium text-[#2559ee] hover:underline" href="#signup">Sign up</a></p>
      <p className="mt-24 text-center text-[11px] text-[#a6b1ca]">© 2023 ALL RIGHTS RESERVED</p>
    </div>
  )
}
