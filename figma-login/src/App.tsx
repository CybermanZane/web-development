import { LoginCard } from './components/login/LoginCard'
import { FloralPanel, MobileFloralPanel } from './components/login/FloralPanel'

export default function App() {
  return (
    <main className="min-h-screen bg-[#080b0d] px-4 py-8 sm:grid sm:place-items-center sm:p-12">
      <section className="relative mx-auto flex w-full max-w-[1182px] overflow-hidden rounded-[30px] bg-white sm:min-h-[780px] sm:items-center">
        <div className="w-full px-7 py-12 sm:w-[51.2%] sm:px-[13.9%] sm:py-16">
          <MobileFloralPanel />
          <LoginCard />
        </div>

        <FloralPanel />
      </section>
    </main>
  )
}