import type { Pokemon, PokemonApiResponse, PokemonListResponse } from "./types"

const BASE_URL = "https://pokeapi.co/api/v2"
/** La primera generación abarca los Pokémon del #1 al #151. */
export const GEN1_COUNT = 151

/** Extrae el id numérico de una URL de la PokeAPI. */
function getIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean)
  return Number(parts[parts.length - 1])
}

function findStat(data: PokemonApiResponse, name: string): number {
  return data.stats.find((s) => s.stat.name === name)?.base_stat ?? 0
}

/** Normaliza la respuesta cruda de la API al modelo resumido de la UI. */
function normalizePokemon(data: PokemonApiResponse): Pokemon {
  const image =
    data.sprites.other?.["official-artwork"]?.front_default ??
    data.sprites.front_default ??
    ""

  return {
    id: data.id,
    name: data.name,
    image,
    types: data.types.map((t) => t.type.name),
    height: data.height / 10, // decímetros -> metros
    weight: data.weight / 10, // hectogramos -> kilogramos
    abilities: data.abilities.map((a) => a.ability.name),
    stats: {
      hp: findStat(data, "hp"),
      attack: findStat(data, "attack"),
      defense: findStat(data, "defense"),
      speed: findStat(data, "speed"),
    },
  }
}

/** Obtiene el detalle de un único Pokémon por nombre o id. */
export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!res.ok) {
    throw new Error(`No se pudo cargar el Pokémon "${nameOrId}" (${res.status})`)
  }
  const data: PokemonApiResponse = await res.json()
  return normalizePokemon(data)
}

/**
 * Obtiene los 151 Pokémon de la primera generación.
 * Primero pide la lista y luego el detalle de cada uno en paralelo.
 */
export async function fetchGen1Pokemon(): Promise<Pokemon[]> {
  const listRes = await fetch(`${BASE_URL}/pokemon?limit=${GEN1_COUNT}&offset=0`)
  if (!listRes.ok) {
    throw new Error(`No se pudo cargar la lista de Pokémon (${listRes.status})`)
  }
  const list: PokemonListResponse = await listRes.json()

  const detailed = await Promise.all(
    list.results.map((item) => fetchPokemon(getIdFromUrl(item.url))),
  )

  return detailed.sort((a, b) => a.id - b.id)
}
