import type { Pokemon } from "../lib/types"
import { getTypeInfo } from "../lib/pokemon-types"
import { TypeBadge } from "./type-badge"

interface PokemonCardProps {
  pokemon: Pokemon
  onClick: (pokemon: Pokemon) => void
}

/** Tarjeta con la información resumida de un Pokémon. */
export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const primaryColor = getTypeInfo(pokemon.types[0]).color

  return (
    <button
      type="button"
      onClick={() => onClick(pokemon)}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="absolute right-3 top-3 text-sm font-bold text-muted-foreground">
        #{pokemon.id.toString().padStart(3, "0")}
      </span>

      <div
        className="flex h-32 w-full items-center justify-center rounded-xl"
        style={{ backgroundColor: `${primaryColor}1a` }}
      >
        <img
          src={pokemon.image || "/placeholder.svg"}
          alt={`Ilustración de ${pokemon.name}`}
          loading="lazy"
          className="h-28 w-28 object-contain transition-transform group-hover:scale-110"
        />
      </div>

      <h2 className="mt-3 text-base font-bold capitalize text-card-foreground">
        {pokemon.name}
      </h2>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </button>
  )
}
