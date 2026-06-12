import { useMemo, useState } from "react"
import type { Pokemon } from "./lib/types"
import { useGen1Pokemon } from "./hooks/use-pokemon"
import { PokedexHeader } from "./components/pokedex-header"
import { PokemonCard } from "./components/pokemon-card"
import { PokemonModal } from "./components/pokemon-modal"
import { PokemonGridSkeleton } from "./components/skeleton"

export default function App() {
  const { pokemon, loading, error, reload } = useGen1Pokemon()
  const [query, setQuery] = useState("")
  const [activeType, setActiveType] = useState<string | null>(null)
  const [selected, setSelected] = useState<Pokemon | null>(null)

  // Tipos presentes en la primera generación (ordenados).
  const availableTypes = useMemo(() => {
    const set = new Set<string>()
    pokemon.forEach((p) => p.types.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [pokemon])

  // Filtrado por texto y por tipo.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pokemon.filter((p) => {
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.id.toString().padStart(3, "0").includes(q) ||
        p.id.toString() === q
      const matchesType = activeType === null || p.types.includes(activeType)
      return matchesQuery && matchesType
    })
  }, [pokemon, query, activeType])

  return (
    <div className="min-h-screen">
      <PokedexHeader
        query={query}
        onQueryChange={setQuery}
        activeType={activeType}
        onTypeChange={setActiveType}
        availableTypes={availableTypes}
        resultCount={loading ? 0 : filtered.length}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading && <PokemonGridSkeleton />}

        {!loading && error && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-base font-semibold text-card-foreground">
              No se pudieron cargar los Pokémon
            </p>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-base font-semibold text-card-foreground">
              Sin resultados
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              No hay Pokémon que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onClick={setSelected} />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground">
        Datos obtenidos de{" "}
        <a
          href="https://pokeapi.co"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          PokeAPI
        </a>
      </footer>

      <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
