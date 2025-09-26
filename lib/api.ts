import type { StockData, FilterOptions, SortOptions, PaginationOptions } from "@/types/stock"

/**
 * API configuration and base URL
 * Update this to match your backend server URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

/**
 * API response wrapper interface
 */
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * API error class for handling backend errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status, errorData.code)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or parsing errors
    throw new ApiError(error instanceof Error ? error.message : "Network error", 0)
  }
}

/**
 * Stock data API service functions
 */
export const stockApi = {
  /**
   * Fetch stock data with filtering, sorting, and pagination
   */
  async getStocks(params: {
    filters?: FilterOptions
    sort?: SortOptions
    pagination?: Pick<PaginationOptions, "page" | "pageSize">
  }): Promise<ApiResponse<StockData[]>> {
    const searchParams = new URLSearchParams()

    // Add pagination parameters
    if (params.pagination) {
      searchParams.append("page", params.pagination.page.toString())
      searchParams.append("pageSize", params.pagination.pageSize.toString())
    }

    // Add sorting parameters
    if (params.sort) {
      searchParams.append("sortBy", params.sort.field)
      searchParams.append("sortOrder", params.sort.direction)
    }

    // Add filter parameters
    if (params.filters) {
      if (params.filters.search) {
        searchParams.append("search", params.filters.search)
      }
      if (params.filters.sector !== "All Sectors") {
        searchParams.append("sector", params.filters.sector)
      }
      if (params.filters.prediction !== "all") {
        searchParams.append("prediction", params.filters.prediction)
      }
      if (params.filters.priceRange.min > 0) {
        searchParams.append("minPrice", params.filters.priceRange.min.toString())
      }
      if (params.filters.priceRange.max < 1000) {
        searchParams.append("maxPrice", params.filters.priceRange.max.toString())
      }
      if (params.filters.changeRange.min > -10) {
        searchParams.append("minChange", params.filters.changeRange.min.toString())
      }
      if (params.filters.changeRange.max < 10) {
        searchParams.append("maxChange", params.filters.changeRange.max.toString())
      }
      if (params.filters.confidence.min > 0) {
        searchParams.append("minConfidence", params.filters.confidence.min.toString())
      }
      if (params.filters.confidence.max < 100) {
        searchParams.append("maxConfidence", params.filters.confidence.max.toString())
      }
      if (params.filters.dateRange.from) {
        searchParams.append("fromDate", params.filters.dateRange.from.toISOString())
      }
      if (params.filters.dateRange.to) {
        searchParams.append("toDate", params.filters.dateRange.to.toISOString())
      }
    }

    const queryString = searchParams.toString()
    const endpoint = `/stocks${queryString ? `?${queryString}` : ""}`

    return apiRequest<StockData[]>(endpoint)
  },

  /**
   * Get a single stock by symbol
   */
  async getStock(symbol: string): Promise<ApiResponse<StockData>> {
    return apiRequest<StockData>(`/stocks/${symbol}`)
  },

  /**
   * Get stock prediction history
   */
  async getStockHistory(
    symbol: string,
    timeframe: "1d" | "1w" | "1m" | "3m" | "1y" = "1m",
  ): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>(`/stocks/${symbol}/history?timeframe=${timeframe}`)
  },

  /**
   * Get available sectors
   */
  async getSectors(): Promise<ApiResponse<string[]>> {
    return apiRequest<string[]>("/stocks/sectors")
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<
    ApiResponse<{
      totalPredictions: number
      accuracyRate: number
      activeStocks: number
      marketTrend: number
    }>
  > {
    return apiRequest("/dashboard/stats")
  },
}

/**
 * Utility function to handle API errors in components
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input."
      case 401:
        return "Authentication required. Please log in."
      case 403:
        return "Access denied. You don't have permission for this action."
      case 404:
        return "Data not found. The requested resource doesn't exist."
      case 429:
        return "Too many requests. Please try again later."
      case 500:
        return "Server error. Please try again later."
      default:
        return error.message || "An unexpected error occurred."
    }
  }

  return "Network error. Please check your connection and try again."
}
