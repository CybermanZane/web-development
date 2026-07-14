export function FloralPanel() {
  return (
    <aside className="hidden w-[48.8%] py-5 pr-5 sm:block">
      <div
        className="h-full min-h-[740px] w-full rounded-[17px] bg-[url('/floral-art-v2.png')] bg-cover bg-center"
        aria-label="Flower arrangement artwork"
        role="img"
      />
    </aside>
  )
}

export function MobileFloralPanel() {
  return (
    <div
      className="mb-7 h-[145px] w-full rounded-[15px] bg-[url('/floral-art-v2.png')] bg-cover bg-center sm:hidden"
      aria-label="Flower arrangement artwork"
      role="img"
    />
  )
}