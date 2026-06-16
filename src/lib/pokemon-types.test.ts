import { describe, expect, it } from "vitest"
import { getTypeInfo } from "./pokemon-types"

describe("getTypeInfo", () => {
  it("devuelve label y color para un tipo conocido", () => {
    expect(getTypeInfo("fire")).toEqual({
      label: "Fuego",
      color: "#e62829",
    })
  })

  it("usa fallback para tipos desconocidos", () => {
    expect(getTypeInfo("unknown")).toEqual({
      label: "unknown",
      color: "#9fa19f",
    })
  })
})
