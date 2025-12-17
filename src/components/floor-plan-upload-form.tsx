"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Input } from './ui/input'

interface Room {
  name: string;
  dimensions: string;
  area: number;
  features: string[];
}

interface AnalysisResults {
  rooms: Room[];
  totalArea: number;
  notes?: string;
  error?: string;
}

export default function FloorPlanUploadForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    
    if (!selectedFile) return
    
    if (!SUPPORTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError(`Please upload a supported image format: ${SUPPORTED_IMAGE_TYPES.join(', ')}`)
      return
    }

    setFile(selectedFile)
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  }

  const analyzeFloorPlan = async () => {
    if (!file) return

    try {
      setIsLoading(true)
      setProgress(0)
      
      const formData = new FormData()
      formData.append('image', file)
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const response = await fetch("/api/analyze-floor-plan", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Failed to analyze floor plan")
      }

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full">
            <label 
              htmlFor="image-upload"
              className="block w-full cursor-pointer"
            >
              <div className="relative w-full h-[200px] rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <svg className="w-10 h-10 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Drop your floor plan here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JPEG, PNG, GIF, and WebP formats
                    </p>
                  </div>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </label>
          </div>

          {preview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        <Button
          onClick={analyzeFloorPlan}
          disabled={!file || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Analyzing..." : "Analyze Floor Plan"}
        </Button>

        {isLoading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              Analyzing floor plan...
            </p>
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-primary">
            Analysis Results
          </h3>
          <div className="grid gap-4">
            {results.rooms.map((room, index) => (
              <div
                key={index}
                className="bg-primary/5 rounded-lg p-4 border border-primary/10"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-foreground">
                      {room.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {room.dimensions}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Area: {room.area} sq ft
                  </p>
                  {room.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Total Area: {results.totalArea} sq ft
            </p>
            {results.notes && (
              <p className="mt-2 text-sm text-muted-foreground">
                {results.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 