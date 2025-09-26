/**
 * Type definitions for stock data and predictions
 * Used throughout the application for type safety
 */

export interface StockData {
  id: string
  symbol: string
  name: string
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  prediction: StockPrediction
  sector: string
  lastUpdated: string
}

export interface StockPrediction {
  direction: "up" | "down" | "neutral"
  confidence: number
  targetPrice: number
  timeframe: "1d" | "1w" | "1m" | "3m"
  accuracy: number
}

export interface FilterOptions {
  search: string
  sector: string
  priceRange: {
    min: number
    max: number
  }
  changeRange: {
    min: number
    max: number
  }
  prediction: "all" | "up" | "down" | "neutral"
  confidence: {
    min: number
    max: number
  }
  dateRange: {
    from: Date | undefined
    to: Date | undefined
    preset: string
  }
}

export interface SortOptions {
  field: keyof StockData | "prediction.confidence" | "prediction.targetPrice"
  direction: "asc" | "desc"
}

export interface PaginationOptions {
  page: number
  pageSize: number
  total: number
}
