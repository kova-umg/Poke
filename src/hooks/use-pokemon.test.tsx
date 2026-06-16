import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Pokemon } from "../lib/types"
import { useGen1Pokemon } from "./use-pokemon"

const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: "bulbasaur",
    image: "https://example.com/1.png",
    types: ["grass", "poison"],
    height: 0.7,
    weight: 6.9,
    abilities: ["overgrow"],
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
  },
]

vi.mock("../lib/api", () => ({
  fetchGen1Pokemon: vi.fn(),
}))

import { fetchGen1Pokemon } from "../lib/api"

const mockedFetchGen1Pokemon = vi.mocked(fetchGen1Pokemon)

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useGen1Pokemon", () => {
  it("carga los Pokémon y deja de estar en loading", async () => {
    mockedFetchGen1Pokemon.mockResolvedValue(mockPokemon)

    const { result } = renderHook(() => useGen1Pokemon())

    expect(result.current.loading).toBe(true)
    expect(result.current.pokemon).toEqual([])
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pokemon).toEqual(mockPokemon)
    expect(result.current.error).toBeNull()
  })

  it("expone el mensaje de error cuando falla la carga", async () => {
    mockedFetchGen1Pokemon.mockRejectedValue(
      new Error("No se pudo cargar la lista de Pokémon (500)"),
    )

    const { result } = renderHook(() => useGen1Pokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pokemon).toEqual([])
    expect(result.current.error).toBe(
      "No se pudo cargar la lista de Pokémon (500)",
    )
  })

  it("permite reintentar la carga con reload", async () => {
    mockedFetchGen1Pokemon
      .mockRejectedValueOnce(new Error("Error temporal"))
      .mockResolvedValueOnce(mockPokemon)

    const { result } = renderHook(() => useGen1Pokemon())

    await waitFor(() => {
      expect(result.current.error).toBe("Error temporal")
    })

    result.current.reload()

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(mockPokemon)
    })

    expect(result.current.error).toBeNull()
    expect(mockedFetchGen1Pokemon).toHaveBeenCalledTimes(2)
  })
})
