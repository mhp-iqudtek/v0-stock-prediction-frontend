"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PaginationControls } from "./pagination-controls"
import { useStocks } from "@/hooks/use-stocks"
import { mockStockData } from "@/lib/mock-data"
import type { StockData, FilterOptions, SortOptions, PaginationOptions } from "@/types/stock"

interface StockDataTableProps {
  filters?: FilterOptions
}

/**
 * Main data table component displaying stock information with sorting and pagination
 * Features real-time price updates, predictions, and interactive controls
 * Integrates with backend API for live data or falls back to mock data
 */
export function StockDataTable({ filters }: StockDataTableProps) {
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "symbol",
    direction: "asc",
  })

  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: 25,
    total: 0,
  })

  // Use API hook for live data, fallback to mock data if API fails
  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useStocks({
    filters,
    sort: sortOptions,
    pagination: { page: pagination.page, pageSize: pagination.pageSize },
    enabled: true,
  })

  // Process data - use API data if available, otherwise use mock data with client-side filtering
  const { paginatedData, totalFiltered } = useMemo(() => {
    // If API data is available, use it directly
    if (apiData && apiData.length > 0 && !error) {
      return { paginatedData: apiData, totalFiltered: apiData.length }
    }

    // Fallback to mock data with client-side processing
    let filtered = mockStockData

    // Apply filters if provided
    if (filters) {
      filtered = filtered.filter((stock) => {
        // Search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          if (!stock.symbol.toLowerCase().includes(searchTerm) && !stock.name.toLowerCase().includes(searchTerm)) {
            return false
          }
        }

        // Sector filter
        if (filters.sector !== "All Sectors" && stock.sector !== filters.sector) {
          return false
        }

        // Price range filter
        if (stock.currentPrice < filters.priceRange.min || stock.currentPrice > filters.priceRange.max) {
          return false
        }

        // Change range filter
        if (stock.changePercent < filters.changeRange.min || stock.changePercent > filters.changeRange.max) {
          return false
        }

        // Prediction filter
        if (filters.prediction !== "all" && stock.prediction.direction !== filters.prediction) {
          return false
        }

        // Confidence filter
        if (
          stock.prediction.confidence < filters.confidence.min ||
          stock.prediction.confidence > filters.confidence.max
        ) {
          return false
        }

        return true
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortOptions.field.includes(".")) {
        // Handle nested fields like prediction.confidence
        const [parent, child] = sortOptions.field.split(".")
        aValue = (a as any)[parent][child]
        bValue = (b as any)[parent][child]
      } else {
        aValue = a[sortOptions.field as keyof StockData]
        bValue = b[sortOptions.field as keyof StockData]
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOptions.direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    const totalFiltered = filtered.length
    const startIndex = (pagination.page - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    const paginatedData = filtered.slice(startIndex, endIndex)

    return { paginatedData, totalFiltered }
  }, [apiData, error, filters, sortOptions, pagination.page, pagination.pageSize])

  // Update pagination total when data changes
  useMemo(() => {
    setPagination((prev) => ({
      ...prev,
      total: totalFiltered,
      page: prev.page > Math.ceil(totalFiltered / prev.pageSize) ? 1 : prev.page,
    }))
  }, [totalFiltered])

  const handleSort = (field: SortOptions["field"]) => {
    setSortOptions((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
    // Reset to first page when sorting changes
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      page: 1, // Reset to first page when page size changes
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return formatCurrency(value)
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toLocaleString()
  }

  const getPredictionIcon = (direction: StockData["prediction"]["direction"]) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPredictionBadge = (direction: StockData["prediction"]["direction"]) => {
    switch (direction) {
      case "up":
        return (
          <Badge variant="outline" className="text-success border-success/20 bg-success/10">
            Bullish
          </Badge>
        )
      case "down":
        return (
          <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10">
            Bearish
          </Badge>
        )
      case "neutral":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Neutral
          </Badge>
        )
    }
  }

  const SortButton = ({ field, children }: { field: SortOptions["field"]; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" onClick={() => handleSort(field)} className="h-auto p-0 font-semibold">
      <div className="flex items-center gap-1">
        {children}
        {sortOptions.field === field ? (
          sortOptions.direction === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </div>
    </Button>
  )

  return (
    <div className="space-y-4">
      {/* API Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error} (Using demo data)</span>
            <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {totalFiltered} of {mockStockData.length} stocks
          {totalFiltered !== mockStockData.length && " (filtered)"}
          {error && " • Demo Mode"}
        </p>
        <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">
                <SortButton field="symbol">Symbol</SortButton>
              </TableHead>
              <TableHead className="min-w-[200px]">
                <SortButton field="name">Company</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="currentPrice">Price</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="changePercent">Change</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="volume">Volume</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="marketCap">Market Cap</SortButton>
              </TableHead>
              <TableHead className="text-center">
                <SortButton field="prediction.direction">Prediction</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="prediction.confidence">Confidence</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="prediction.targetPrice">Target</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading stock data...
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((stock) => (
                <TableRow key={stock.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-semibold">{stock.symbol}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-xs text-muted-foreground">{stock.sector}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(stock.currentPrice)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className={`font-mono ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {stock.change >= 0 ? "+" : ""}
                        {formatCurrency(stock.change)}
                      </span>
                      <span
                        className={`text-xs font-mono ${stock.changePercent >= 0 ? "text-success" : "text-destructive"}`}
                      >
                        {stock.changePercent >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatVolume(stock.volume)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatMarketCap(stock.marketCap)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">{getPredictionIcon(stock.prediction.direction)}</div>
                      {getPredictionBadge(stock.prediction.direction)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">{stock.prediction.confidence.toFixed(1)}%</span>
                      <span className="text-xs text-muted-foreground">{stock.prediction.timeframe}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(stock.prediction.targetPrice)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginatedData.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No stocks match your current filters.</p>
          <p className="text-sm">Try adjusting your search criteria.</p>
        </div>
      )}

      {totalFiltered > 0 && (
        <PaginationControls
          pagination={{ ...pagination, total: totalFiltered }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
