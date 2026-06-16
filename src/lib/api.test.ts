import { afterEach, describe, expect, it, vi } from "vitest"
import type { PokemonApiResponse } from "./types"
import { fetchGen1Pokemon, fetchPokemon, GEN1_COUNT } from "./api"

function mockPokemonResponse(
  overrides: Partial<PokemonApiResponse> = {},
): PokemonApiResponse {
  return {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    sprites: {
      front_default: "https://example.com/pikachu.png",
      other: {
        "official-artwork": {
          front_default: "https://example.com/pikachu-art.png",
        },
      },
    },
    types: [{ slot: 1, type: { name: "electric", url: "" } }],
    abilities: [{ ability: { name: "static" }, is_hidden: false }],
    stats: [
      { base_stat: 35, stat: { name: "hp" } },
      { base_stat: 55, stat: { name: "attack" } },
      { base_stat: 40, stat: { name: "defense" } },
      { base_stat: 90, stat: { name: "speed" } },
    ],
    ...overrides,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("fetchPokemon", () => {
  it("normaliza altura, peso y stats de la respuesta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockPokemonResponse(),
      }),
    )

    const pokemon = await fetchPokemon("pikachu")

    expect(pokemon).toEqual({
      id: 25,
      name: "pikachu",
      image: "https://example.com/pikachu-art.png",
      types: ["electric"],
      height: 0.4,
      weight: 6,
      abilities: ["static"],
      stats: {
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90,
      },
    })
  })

  it("usa front_default si no hay artwork oficial", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () =>
          mockPokemonResponse({
            sprites: {
              front_default: "https://example.com/fallback.png",
            },
          }),
      }),
    )

    const pokemon = await fetchPokemon(25)

    expect(pokemon.image).toBe("https://example.com/fallback.png")
  })

  it("lanza error cuando la API responde con fallo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )

    await expect(fetchPokemon("missingno")).rejects.toThrow(
      'No se pudo cargar el Pokémon "missingno" (404)',
    )
  })
})

describe("fetchGen1Pokemon", () => {
  it("obtiene y ordena los Pokémon de la primera generación", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          count: 2,
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
            { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          mockPokemonResponse({
            id: 1,
            name: "bulbasaur",
            types: [{ slot: 1, type: { name: "grass", url: "" } }],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          mockPokemonResponse({
            id: 4,
            name: "charmander",
            types: [{ slot: 1, type: { name: "fire", url: "" } }],
          }),
      })

    vi.stubGlobal("fetch", fetchMock)

    const pokemon = await fetchGen1Pokemon()

    expect(fetchMock).toHaveBeenCalledWith(
      `https://pokeapi.co/api/v2/pokemon?limit=${GEN1_COUNT}&offset=0`,
    )
    expect(pokemon).toHaveLength(2)
    expect(pokemon.map((p) => p.name)).toEqual(["bulbasaur", "charmander"])
  })

  it("lanza error si falla la carga de la lista", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(fetchGen1Pokemon()).rejects.toThrow(
      "No se pudo cargar la lista de Pokémon (500)",
    )
  })
})
