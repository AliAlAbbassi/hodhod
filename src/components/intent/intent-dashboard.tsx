import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function IntentDashboard() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Website Visitors</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Live Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        No visitors detected yet.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
