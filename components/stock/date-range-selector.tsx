"use client"

import { useState } from "react"
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export interface DateRangeFilter {
  from: Date | undefined
  to: Date | undefined
  preset: string
}

interface DateRangeSelectorProps {
  value?: DateRangeFilter
  onChange?: (dateRange: DateRangeFilter) => void
  className?: string
}

/**
 * Date range selector component for filtering stock data by time periods
 * Provides preset ranges (1D, 1W, 1M, etc.) and custom date selection
 */
export function DateRangeSelector({ value, onChange, className }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: value?.from,
    to: value?.to,
  })

  const presets = [
    { label: "Today", value: "1d", getDates: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
    {
      label: "Last 7 days",
      value: "7d",
      getDates: () => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }),
    },
    {
      label: "Last 30 days",
      value: "30d",
      getDates: () => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }),
    },
    {
      label: "Last 3 months",
      value: "3m",
      getDates: () => ({ from: startOfDay(subMonths(new Date(), 3)), to: endOfDay(new Date()) }),
    },
    {
      label: "Last 6 months",
      value: "6m",
      getDates: () => ({ from: startOfDay(subMonths(new Date(), 6)), to: endOfDay(new Date()) }),
    },
    {
      label: "Last year",
      value: "1y",
      getDates: () => ({ from: startOfDay(subYears(new Date(), 1)), to: endOfDay(new Date()) }),
    },
    {
      label: "All time",
      value: "all",
      getDates: () => ({ from: undefined, to: undefined }),
    },
  ]

  const handlePresetSelect = (presetValue: string) => {
    const preset = presets.find((p) => p.value === presetValue)
    if (preset) {
      const dates = preset.getDates()
      setDateRange(dates)
      onChange?.({
        from: dates.from,
        to: dates.to,
        preset: presetValue,
      })
      if (presetValue !== "custom") {
        setIsOpen(false)
      }
    }
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      onChange?.({
        from: startOfDay(range.from),
        to: endOfDay(range.to),
        preset: "custom",
      })
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    setDateRange({ from: undefined, to: undefined })
    onChange?.({
      from: undefined,
      to: undefined,
      preset: "all",
    })
    setIsOpen(false)
  }

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "All time"
    }
    if (dateRange.from && !dateRange.to) {
      return format(dateRange.from, "LLL dd, y")
    }
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
    }
    return "Select date range"
  }

  const currentPreset = value?.preset || "all"
  const hasDateRange = dateRange?.from || dateRange?.to

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Date Range</Label>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn("justify-start text-left font-normal", !hasDateRange && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex">
              {/* Preset Options */}
              <div className="border-r border-border p-3 space-y-2">
                <div className="text-sm font-medium mb-2">Quick Select</div>
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={currentPreset === preset.value ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => handlePresetSelect(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={handleClear}>
                  <X className="mr-2 h-3 w-3" />
                  Clear
                </Button>
              </div>

              {/* Calendar */}
              <div className="p-3">
                <div className="text-sm font-medium mb-2">Custom Range</div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Current Selection Badge */}
        {hasDateRange && currentPreset !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {presets.find((p) => p.value === currentPreset)?.label || "Custom"}
          </Badge>
        )}
      </div>
    </div>
  )
}
