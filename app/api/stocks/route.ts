import { type NextRequest, NextResponse } from "next/server"
import { mockStockData } from "@/lib/mock-data"

/**
 * Example API route for stock data
 * Replace this with your actual backend integration
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "25")
    const search = searchParams.get("search")
    const sector = searchParams.get("sector")
    const prediction = searchParams.get("prediction")
    const sortBy = searchParams.get("sortBy") || "symbol"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    // Filter mock data based on parameters
    let filteredData = mockStockData

    if (search) {
      const searchTerm = search.toLowerCase()
      filteredData = filteredData.filter(
        (stock) => stock.symbol.toLowerCase().includes(searchTerm) || stock.name.toLowerCase().includes(searchTerm),
      )
    }

    if (sector && sector !== "All Sectors") {
      filteredData = filteredData.filter((stock) => stock.sector === sector)
    }

    if (prediction && prediction !== "all") {
      filteredData = filteredData.filter((stock) => stock.prediction.direction === prediction)
    }

    // Sort data
    filteredData.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (sortBy.includes(".")) {
        const [parent, child] = sortBy.split(".")
        aValue = (a as any)[parent][child]
        bValue = (b as any)[parent][child]
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    // Paginate data
    const total = filteredData.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedData,
      success: true,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: [],
      },
      { status: 500 },
    )
  }
}
