import { Loader2 } from 'lucide-react'

export default function LoadingState({ loadingText = "Loading..." }: { loadingText?: string }) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="flex flex-col items-center justify-center">
                    <p><Loader2 className="animate-spin size-20" /></p>
                    <p className="text-lg text-muted-foreground mb-4">{loadingText}</p>
                </div>
            </main>
        </div>
    )
}
