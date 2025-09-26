"use client"

import { useState, useEffect, useCallback } from "react"
import { stockApi, handleApiError } from "@/lib/api"
import type { StockData, FilterOptions, SortOptions, PaginationOptions } from "@/types/stock"

interface UseStocksOptions {
  filters?: FilterOptions
  sort?: SortOptions
  pagination?: Pick<PaginationOptions, "page" | "pageSize">
  enabled?: boolean
}

interface UseStocksReturn {
  data: StockData[]
  loading: boolean
  error: string | null
  pagination: PaginationOptions
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching and managing stock data
 * Handles loading states, error handling, and automatic refetching
 */
export function useStocks(options: UseStocksOptions = {}): UseStocksReturn {
  const { filters, sort, pagination: paginationOptions, enabled = true } = options

  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: paginationOptions?.page || 1,
    pageSize: paginationOptions?.pageSize || 25,
    total: 0,
  })

  const fetchStocks = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response = await stockApi.getStocks({
        filters,
        sort,
        pagination: paginationOptions,
      })

      setData(response.data)
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          pageSize: response.pagination.pageSize,
          total: response.pagination.total,
        })
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error("Failed to fetch stocks:", err)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, paginationOptions, enabled])

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchStocks,
  }
}

/**
 * Hook for fetching a single stock
 */
export function useStock(symbol: string, enabled = true) {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStock = useCallback(async () => {
    if (!enabled || !symbol) return

    setLoading(true)
    setError(null)

    try {
      const response = await stockApi.getStock(symbol)
      setData(response.data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error(`Failed to fetch stock ${symbol}:`, err)
    } finally {
      setLoading(false)
    }
  }, [symbol, enabled])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  return {
    data,
    loading,
    error,
    refetch: fetchStock,
  }
}

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboardStats(enabled = true) {
  const [data, setData] = useState<{
    totalPredictions: number
    accuracyRate: number
    activeStocks: number
    marketTrend: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response = await stockApi.getDashboardStats()
      setData(response.data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error("Failed to fetch dashboard stats:", err)
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  }
}
