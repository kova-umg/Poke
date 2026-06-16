import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TypeBadge } from "./type-badge"

describe("TypeBadge", () => {
  it("muestra la etiqueta en español para un tipo conocido", () => {
    render(<TypeBadge type="water" />)

    expect(screen.getByText("Agua")).toBeInTheDocument()
  })

  it("muestra el nombre crudo para tipos desconocidos", () => {
    render(<TypeBadge type="unknown" />)

    expect(screen.getByText("unknown")).toBeInTheDocument()
  })
})
