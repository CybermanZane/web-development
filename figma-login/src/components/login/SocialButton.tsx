import { ReactNode } from 'react'

export function SocialButton({ provider, icon }: { provider: string; icon: ReactNode }) {
  return <button type="button" className="flex h-[35px] w-full items-center justify-center gap-3 rounded-[7px] bg-[#f1f7f8] text-[11px] font-medium text-[#40506a] transition hover:bg-[#e7f1f3]" aria-label={`Sign in with ${provider}`}>{icon}<span>Sign in with {provider}</span></button>
}
