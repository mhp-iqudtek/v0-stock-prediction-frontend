"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StockDataTable } from "@/components/stock/stock-data-table"
import { StockFilters } from "@/components/stock/stock-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import type { FilterOptions } from "@/types/stock"

/**
 * Main dashboard page for the Quant-Trade stock prediction platform
 * Features overview metrics and the main data table with filtering capabilities
 */
export default function HomePage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    sector: "All Sectors",
    priceRange: { min: 0, max: 1000 },
    changeRange: { min: -10, max: 10 },
    prediction: "all",
    confidence: { min: 0, max: 100 },
    dateRange: { from: undefined, to: undefined, preset: "all" },
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-3xl font-bold text-balance">Stock Prediction Dashboard</h2>
            <p className="text-muted-foreground text-pretty">
              Advanced analytics and predictions for informed trading decisions
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">87.3%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+5 new stocks today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">-1.2%</div>
                <p className="text-xs text-muted-foreground">Market correction</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Data Table Section */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Data & Predictions</CardTitle>
            <CardDescription>Filter, sort, and analyze stock predictions with advanced controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StockFilters onFiltersChange={setFilters} />
            <StockDataTable filters={filters} />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
