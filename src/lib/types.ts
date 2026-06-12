export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  results: PokemonListItem[]
}

export interface PokemonTypeSlot {
  slot: number
  type: { name: string; url: string }
}

export interface PokemonStat {
  base_stat: number
  stat: { name: string }
}

export interface PokemonSprites {
  front_default: string | null
  other?: {
    ["official-artwork"]?: {
      front_default: string | null
    }
  }
}

export interface PokemonAbility {
  ability: { name: string }
  is_hidden: boolean
}

/** Respuesta cruda de la PokeAPI para un Pokémon individual. */
export interface PokemonApiResponse {
  id: number
  name: string
  height: number
  weight: number
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  sprites: PokemonSprites
  abilities: PokemonAbility[]
}

/** Modelo normalizado y resumido que usa la UI. */
export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
  height: number // en metros
  weight: number // en kilogramos
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}
