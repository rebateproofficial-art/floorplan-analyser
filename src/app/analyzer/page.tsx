"use client"

import Link from 'next/link'
import FloorPlanUploadForm from '../../components/floor-plan-upload-form'
import { Button } from '../../components/ui/button'

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-display font-semibold tracking-tight text-primary">
              Floor Plan Analyzer
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Professional analysis of property layouts and dimensions
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-semibold text-primary">
                  Upload Floor Plan
                </h2>
                <p className="text-muted-foreground">
                  Our AI will analyze your floor plan to provide detailed measurements and insights
                </p>
              </div>
              
              <FloorPlanUploadForm />

              <div className="flex justify-center pt-4">
                <Link href="/">
                  <Button variant="outline" size="lg" className="font-medium">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 