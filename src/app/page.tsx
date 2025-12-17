import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-display font-semibold tracking-tight text-primary">
              Professional Property Analysis Suite
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Advanced AI-powered tools for comprehensive property analysis and valuation
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link href="/analyzer" className="block group">
            <Card className="p-8 h-full transition-all hover:shadow-lg hover:border-primary/20">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-semibold text-primary">
                    Floor Plan Analyzer
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Professional floor plan analysis for accurate property assessment
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Precise room measurements and layout analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed property structure insights
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Professional documentation ready
                  </li>
                </ul>
              </div>
            </Card>
          </Link>

          <Link href="/chattel-analyzer" className="block group">
            <Card className="p-8 h-full transition-all hover:shadow-lg hover:border-primary/20">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-semibold text-primary">
                    Chattel Analyzer
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Comprehensive inventory and valuation of property contents
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Accurate identification of chattels and furniture
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Current market value assessment
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed replacement cost analysis
                  </li>
                </ul>
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
