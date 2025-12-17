"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

interface ChattelItem {
  name: string
  replacementCost: number
  confidence: number
}

export default function ChattelAnalyzerForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ChattelItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    
    if (!selectedFile) return
    
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setFile(selectedFile)
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    setResults([])
  }

  const analyzeImage = async () => {
    if (!file) return

    try {
      setIsAnalyzing(true)
      setProgress(0)
      
      const formData = new FormData()
      formData.append('image', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const response = await fetch("/api/analyze-chattels", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()
      setResults(data.items)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      toast.error(errorMessage)
    } finally {
      setIsAnalyzing(false)
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
                      Drop your image here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports all image formats
                    </p>
                  </div>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
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
          onClick={analyzeImage}
          disabled={!file || isAnalyzing}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Image"}
        </Button>

        {isAnalyzing && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              Analyzing image contents...
            </p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-primary">
            Analysis Results
          </h3>
          <div className="grid gap-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="bg-primary/5 rounded-lg p-4 border border-primary/10"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-primary/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all" 
                          style={{ width: `${Math.round(item.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="font-display text-lg font-semibold text-primary whitespace-nowrap">
                    £{item.replacementCost.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 