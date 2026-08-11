export default function Loading() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-black/10 dark:bg-white/10" />
      <div className="h-24 rounded-xl bg-black/10 dark:bg-white/10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-black/10 dark:bg-white/10" />
        ))}
      </div>
    </div>
  )
}
