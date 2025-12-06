import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"

interface IntentEmptyStateProps {
    onSetup: () => void
}

export function IntentEmptyState({ onSetup }: IntentEmptyStateProps) {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <Card className="flex w-full max-w-2xl flex-col items-center justify-center space-y-6 p-12 text-center shadow-sm">
                <div className="rounded-full bg-muted p-4">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Setup Hodhod Intent</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Use Hodhod to get a live feed of the anonymous individuals viewing your website and outbound to them in seconds.
                    </p>
                </div>
                <Button onClick={onSetup} size="lg" className="gap-2">
                    Setup <span>&gt;</span>
                </Button>
            </Card>
        </div>
    )
}
