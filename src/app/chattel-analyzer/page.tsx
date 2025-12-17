import { Metadata } from "next"
import ChattelAnalyzerForm from "@/components/chattel-analyzer-form"

export const metadata: Metadata = {
  title: "Chattel & Furniture Analyzer | Property Analysis Suite",
  description: "Professional analysis of chattels and furniture with accurate replacement cost estimation",
}

export default function ChattelAnalyzerPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-display font-semibold tracking-tight text-primary">
              Chattel & Furniture Analyzer
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Professional analysis and valuation of property contents
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
                  Upload Property Image
                </h2>
                <p className="text-muted-foreground">
                  Our AI will analyze your image to identify and value chattels and furniture
                </p>
              </div>
              
              <ChattelAnalyzerForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 