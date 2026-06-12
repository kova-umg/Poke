import { useEffect, useState } from "react"
import type { Pokemon } from "../lib/types"
import { fetchGen1Pokemon } from "../lib/api"

interface UsePokemonState {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
  reload: () => void
}

/** Carga (una sola vez) los 151 Pokémon de la primera generación. */
export function useGen1Pokemon(): UsePokemonState {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchGen1Pokemon()
        if (!cancelled) setPokemon(data)
      } catch (err) {
        console.log("[v0] Error cargando Pokémon:", err)
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Ocurrió un error al cargar los Pokémon.",
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [attempt])

  return {
    pokemon,
    loading,
    error,
    reload: () => setAttempt((a) => a + 1),
  }
}
