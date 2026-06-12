import { TYPE_INFO } from "../lib/pokemon-types"

interface PokedexHeaderProps {
  query: string
  onQueryChange: (value: string) => void
  activeType: string | null
  onTypeChange: (type: string | null) => void
  availableTypes: string[]
  resultCount: number
}

/** Encabezado con el título, buscador y filtros por tipo. */
export function PokedexHeader({
  query,
  onQueryChange,
  activeType,
  onTypeChange,
  availableTypes,
  resultCount,
}: PokedexHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-5 w-5 rounded-full border-2 border-foreground bg-primary"
              aria-hidden="true"
            />
            <h1 className="text-xl font-extrabold tracking-tight text-card-foreground sm:text-2xl">
              Pokédex{" "}
              <span className="font-medium text-muted-foreground">
                — Primera Generación
              </span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {resultCount} de 151 Pokémon · datos de la PokeAPI
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar por nombre o número..."
              aria-label="Buscar Pokémon"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="Todos"
              active={activeType === null}
              onClick={() => onTypeChange(null)}
            />
            {availableTypes.map((type) => (
              <FilterChip
                key={type}
                label={TYPE_INFO[type]?.label ?? type}
                color={TYPE_INFO[type]?.color}
                active={activeType === type}
                onClick={() => onTypeChange(type)}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
        (active
          ? "text-white"
          : "bg-muted text-muted-foreground hover:bg-border")
      }
      style={active ? { backgroundColor: color ?? "var(--color-primary)" } : undefined}
    >
      {label}
    </button>
  )
}
