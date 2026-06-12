import { useEffect } from "react"
import type { Pokemon } from "../lib/types"
import { getTypeInfo } from "../lib/pokemon-types"
import { TypeBadge } from "./type-badge"

interface PokemonModalProps {
  pokemon: Pokemon | null
  onClose: () => void
}

const STAT_LABELS: { key: keyof Pokemon["stats"]; label: string }[] = [
  { key: "hp", label: "PS" },
  { key: "attack", label: "Ataque" },
  { key: "defense", label: "Defensa" },
  { key: "speed", label: "Velocidad" },
]

/** Ventana modal con el detalle ampliado de un Pokémon. */
export function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (pokemon) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [pokemon, onClose])

  if (!pokemon) return null

  const primaryColor = getTypeInfo(pokemon.types[0]).color

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${pokemon.name}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6" style={{ backgroundColor: primaryColor }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white transition-colors hover:bg-white/50"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {"\u00d7"}
            </span>
          </button>

          <span className="text-sm font-bold text-white/80">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
          <h2 className="text-2xl font-extrabold capitalize text-white">
            {pokemon.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="md" />
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={pokemon.image || "/placeholder.svg"}
              alt={`Ilustración de ${pokemon.name}`}
              className="h-40 w-40 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <InfoBox label="Altura" value={`${pokemon.height.toFixed(1)} m`} />
            <InfoBox label="Peso" value={`${pokemon.weight.toFixed(1)} kg`} />
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold text-card-foreground">
              Habilidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground"
                >
                  {ability.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold text-card-foreground">
              Estadísticas base
            </h3>
            <div className="flex flex-col gap-2">
              {STAT_LABELS.map(({ key, label }) => {
                const value = pokemon.stats[key]
                const pct = Math.min(100, (value / 200) * 100)
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-20 text-xs font-medium text-muted-foreground">
                      {label}
                    </span>
                    <span className="w-8 text-right text-xs font-bold text-card-foreground">
                      {value}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3 text-center">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-card-foreground">{value}</p>
    </div>
  )
}
