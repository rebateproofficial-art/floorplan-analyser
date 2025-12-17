import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Floor Plan Analyzer | Property Analysis Suite",
  description: "Professional floor plan analysis for accurate property assessment and room measurements",
}

export default function AnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 