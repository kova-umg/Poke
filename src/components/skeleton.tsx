/** Tarjeta de carga (esqueleto) mientras se obtienen los datos. */
export function PokemonCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center rounded-2xl border border-border bg-card p-4">
      <div className="h-32 w-full rounded-xl bg-muted" />
      <div className="mt-3 h-4 w-20 rounded bg-muted" />
      <div className="mt-2 flex gap-1.5">
        <div className="h-5 w-12 rounded-full bg-muted" />
        <div className="h-5 w-12 rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function PokemonGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  )
}
