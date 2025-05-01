"use client"

import type React from "react"

// This is a utility component to ensure Chart.js is properly initialized with all required adapters
import { useEffect } from "react"
import Chart from "chart.js/auto"
import "chartjs-adapter-date-fns"
import { enUS } from "date-fns/locale"

// Register the date-fns adapter with locale
Chart.defaults.locale = enUS

export function ChartWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This ensures the Chart.js adapters are properly initialized
    return () => {
      // Cleanup if needed
    }
  }, [])

  return <>{children}</>
}
