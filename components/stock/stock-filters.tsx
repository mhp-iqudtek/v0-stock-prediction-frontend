"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DateRangeSelector } from "./date-range-selector"
import { sectors } from "@/lib/mock-data"
import type { FilterOptions } from "@/types/stock"

interface StockFiltersProps {
  onFiltersChange?: (filters: FilterOptions) => void
}

/**
 * Advanced filtering component for stock data
 * Provides search, sector filtering, price ranges, date ranges, and prediction filters
 */
export function StockFilters({ onFiltersChange }: StockFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    sector: "All Sectors",
    priceRange: { min: 0, max: 1000 },
    changeRange: { min: -10, max: 10 },
    prediction: "all",
    confidence: { min: 0, max: 100 },
    dateRange: { from: undefined, to: undefined, preset: "all" },
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange?.(updated)
  }

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      search: "",
      sector: "All Sectors",
      priceRange: { min: 0, max: 1000 },
      changeRange: { min: -10, max: 10 },
      prediction: "all",
      confidence: { min: 0, max: 100 },
      dateRange: { from: undefined, to: undefined, preset: "all" },
    }
    setFilters(defaultFilters)
    onFiltersChange?.(defaultFilters)
  }

  const activeFiltersCount = [
    filters.search !== "",
    filters.sector !== "All Sectors",
    filters.prediction !== "all",
    filters.priceRange.min > 0 || filters.priceRange.max < 1000,
    filters.changeRange.min > -10 || filters.changeRange.max < 10,
    filters.confidence.min > 0 || filters.confidence.max < 100,
    filters.dateRange.preset !== "all",
  ].filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} active
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? "Simple" : "Advanced"}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Stocks</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Symbol or company name..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sector Filter */}
          <div className="space-y-2">
            <Label>Sector</Label>
            <Select value={filters.sector} onValueChange={(value) => updateFilters({ sector: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prediction Filter */}
          <div className="space-y-2">
            <Label>Prediction</Label>
            <Select value={filters.prediction} onValueChange={(value) => updateFilters({ prediction: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="All predictions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Predictions</SelectItem>
                <SelectItem value="up">Bullish (Up)</SelectItem>
                <SelectItem value="down">Bearish (Down)</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DateRangeSelector value={filters.dateRange} onChange={(dateRange) => updateFilters({ dateRange })} />
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
            {/* Price Range */}
            <div className="space-y-3">
              <Label>Price Range</Label>
              <div className="px-2">
                <Slider
                  value={[filters.priceRange.min, filters.priceRange.max]}
                  onValueChange={([min, max]) => updateFilters({ priceRange: { min, max } })}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>${filters.priceRange.min}</span>
                  <span>${filters.priceRange.max}</span>
                </div>
              </div>
            </div>

            {/* Change Range */}
            <div className="space-y-3">
              <Label>Daily Change %</Label>
              <div className="px-2">
                <Slider
                  value={[filters.changeRange.min, filters.changeRange.max]}
                  onValueChange={([min, max]) => updateFilters({ changeRange: { min, max } })}
                  max={10}
                  min={-10}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.changeRange.min}%</span>
                  <span>{filters.changeRange.max}%</span>
                </div>
              </div>
            </div>

            {/* Confidence Range */}
            <div className="space-y-3">
              <Label>Prediction Confidence</Label>
              <div className="px-2">
                <Slider
                  value={[filters.confidence.min, filters.confidence.max]}
                  onValueChange={([min, max]) => updateFilters({ confidence: { min, max } })}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.confidence.min}%</span>
                  <span>{filters.confidence.max}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
