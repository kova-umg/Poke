import { getTypeInfo } from "../lib/pokemon-types"

interface TypeBadgeProps {
  type: string
  size?: "sm" | "md"
}

/** Etiqueta de color para un tipo de Pokémon. */
export function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const { label, color } = getTypeInfo(type)
  return (
    <span
      className={
        "inline-flex items-center rounded-full font-semibold text-white shadow-sm " +
        (size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm")
      }
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}
