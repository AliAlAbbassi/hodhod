"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    MyDialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/my-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Circle, AlertCircle, Loader2, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface IntentSetupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onComplete: () => void
}

type Step = "domain" | "script" | "verify"

export function IntentSetupModal({ open, onOpenChange, onComplete }: IntentSetupModalProps) {
    const [step, setStep] = useState<Step>("domain")
    const [domain, setDomain] = useState("")
    const [copied, setCopied] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "checking" | "success" | "failed">("idle")

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setStep("domain")
            setDomain("")
            setVerificationStatus("idle")
        }
    }, [open])

    const handleCopy = () => {
        const script = `<script src="https://hodhod-intent.nyc3.digitaloceanspaces.com/script.js?id=1"></script>`
        navigator.clipboard.writeText(script)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleVerify = () => {
        setVerificationStatus("checking")
        // Mock verification
        setTimeout(() => {
            // For demo purposes, let's say it succeeds
            setVerificationStatus("success")
        }, 3000)
    }

    return (
        <MyDialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                {step === "domain" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Turn your website visitors into leads</DialogTitle>
                            <DialogDescription>
                                We identify visitors to your website and turn them into leads for you. In a matter of minutes, you can start capturing leads from your website and create tailored outreach to your highest-intent prospects.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">By setting up HodhodIntent, you'll be able to:</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <Circle className="h-4 w-4" /> Identify visitors to your website
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Circle className="h-4 w-4" /> Turn those visitors into leads
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Circle className="h-4 w-4" /> Add all leads or a subset of leads into campaigns
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Circle className="h-4 w-4" /> Send personalized outreach to those leads
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="domain">Enter Website's domain to create a tracking pixel:</Label>
                                    <Input
                                        id="domain"
                                        placeholder="www.example.com"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Required</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setStep("script")} disabled={!domain}>
                                Next
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === "script" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Install Pixel on your website</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>1. Copy your pixel code</Label>
                                </div>
                                <div className="relative rounded-md bg-muted p-4 font-mono text-sm">
                                    <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopy}>
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <div className="text-muted-foreground">
                                        <span className="text-blue-600">&lt;script</span>
                                        <br />
                                        &nbsp;&nbsp;<span className="text-red-600">src</span>=
                                        <span className="text-blue-600">"https://hodhod-intent.nyc3.digitaloceanspaces.com/script.js?id=1"</span>
                                        <br />
                                        <span className="text-blue-600">&lt;/script&gt;</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>2. Place the pixel in the header code of your website</Label>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li>Open your website's code</li>
                                    <li>Paste the pixel in the header</li>
                                    <li>Save and close</li>
                                </ul>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep("domain")}>
                                Back
                            </Button>
                            <Button onClick={() => {
                                setStep("verify")
                                handleVerify()
                            }}>
                                Next
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === "verify" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Install Pixel on your website</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">Test installation</h4>
                                    {verificationStatus === "checking" && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            <Loader2 className="h-3 w-3 animate-spin" /> Checking...
                                        </div>
                                    )}
                                    {verificationStatus === "failed" && (
                                        <Button size="sm" onClick={handleVerify}>Check Again</Button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <VerificationItem
                                        status={verificationStatus}
                                        label="Check Script Presence"
                                        delay={0}
                                    />
                                    <VerificationItem
                                        status={verificationStatus}
                                        label="Network Request"
                                        delay={1000}
                                    />
                                    <VerificationItem
                                        status={verificationStatus}
                                        label="Response Validation"
                                        delay={2000}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep("script")}>
                                Back
                            </Button>
                            <Button
                                onClick={() => {
                                    onOpenChange(false)
                                    onComplete()
                                }}
                                disabled={verificationStatus !== "success"}
                            >
                                Next
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </MyDialog>
    )
}

function VerificationItem({
    status,
    label,
    delay
}: {
    status: "idle" | "checking" | "success" | "failed",
    label: string,
    delay: number
}) {
    const [localStatus, setLocalStatus] = useState<"pending" | "success" | "failed">("pending")

    useEffect(() => {
        if (status === "checking") {
            setLocalStatus("pending")
            const timer = setTimeout(() => {
                // This is just visual, the parent controls the actual outcome
                // But for the staggered effect we do this
            }, delay)
            return () => clearTimeout(timer)
        } else if (status === "success") {
            const timer = setTimeout(() => {
                setLocalStatus("success")
            }, delay)
            return () => clearTimeout(timer)
        } else if (status === "failed") {
            const timer = setTimeout(() => {
                setLocalStatus("failed")
            }, delay)
            return () => clearTimeout(timer)
        } else {
            setLocalStatus("pending")
        }
    }, [status, delay])

    return (
        <div className="flex items-center gap-3">
            {localStatus === "pending" && <Circle className="h-5 w-5 text-muted-foreground/30" />}
            {localStatus === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {localStatus === "failed" && <AlertCircle className="h-5 w-5 text-red-500" />}
            <span className={cn(
                "text-sm",
                localStatus === "success" ? "text-green-600" :
                    localStatus === "failed" ? "text-red-600" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </div>
    )
}
