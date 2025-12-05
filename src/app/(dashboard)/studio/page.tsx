"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Command, Plus, Globe, MoreVertical } from "lucide-react";

type Product = {
  id: string;
  name: string;
  isPublic: boolean;
  companyUrl?: string;
  bookingLink?: string;
  productUrl?: string;
  briefDescription?: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "LinkedIn Automation",
    isPublic: true,
    companyUrl: "www.hodhod.to/",
    bookingLink: "https://cal.com/zaydali/30min",
    productUrl: "",
    briefDescription:
      "Hodhod offers an AI-powered service that automates outreach and schedules sales calls, turning cold leads into booked meetings.\n\nIdentify the right leads, automatic scoring, research, personalization and outreach on LinkedIn while providing best in class account safety.",
  },
  { id: "2", name: "Account Safety Focus", isPublic: true },
  { id: "3", name: "GTM Agency focus", isPublic: true },
  { id: "4", name: "Personalization", isPublic: true },
  { id: "5", name: "One Person Sales teams", isPublic: true },
  { id: "6", name: "Creative/ Marketing + Founder", isPublic: true },
  { id: "7", name: "Hodhod - Lead Gen for Recruitment", isPublic: true },
  { id: "8", name: "SaaS startups", isPublic: true },
];

export default function StudioPage() {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    "1",
  );
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(4);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleNextOnboarding = () => {
    if (onboardingStep < 10) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const handleBackOnboarding = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Products List */}
      <div className="w-72 border-r bg-background overflow-y-auto relative">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Command className="h-4 w-4" />
              <span className="font-medium text-sm">Products</span>
            </div>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <button
                  onClick={() => setSelectedProductId(product.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${
                    selectedProductId === product.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Command className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate text-left">{product.name}</span>
                  </div>
                  {product.isPublic && (
                    <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {/* Onboarding Tooltip */}
                {showOnboarding && product.id === "4" && (
                  <div className="absolute left-0 top-full mt-2 z-50">
                    <div className="bg-background border rounded-lg shadow-lg p-4 w-72">
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-background border-l border-t rotate-45" />
                      <p className="text-sm mb-4">
                        Share your website, and Hodhod will automatically
                        understand your product details, ICP, pain points,
                        features and any other details.
                      </p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBackOnboarding}
                        >
                          Back
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {onboardingStep} of 10
                        </span>
                        <Button size="sm" onClick={handleNextOnboarding}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {selectedProduct ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">
                  {selectedProduct.name}
                </h1>
                <Button variant="outline" size="sm">
                  Edit Name
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm">Save</Button>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Share Across Workspace
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl p-6 space-y-8">
                {/* Overview Information */}
                <div className="space-y-2">
                  <h2 className="font-medium">Overview Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Provide key company facts for accurate and grounded content
                    creation.
                  </p>
                </div>

                {/* Company URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Company URL<span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    URL of your company website.
                  </p>
                  <Input
                    defaultValue={selectedProduct.companyUrl}
                    placeholder="www.example.com"
                  />
                </div>

                {/* Booking Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Booking Link<span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    URL for prospects to book a meeting with you.
                  </p>
                  <Input
                    defaultValue={selectedProduct.bookingLink}
                    placeholder="https://cal.com/yourname/30min"
                  />
                </div>

                {/* Product URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product URL</label>
                  <p className="text-sm text-muted-foreground">
                    URL of your company product.
                  </p>
                  <Input
                    defaultValue={selectedProduct.productUrl}
                    placeholder="https://product.example.com"
                  />
                </div>

                {/* Brief Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Brief Description<span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Describe your offer in a few words.
                  </p>
                  <textarea
                    className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue={selectedProduct.briefDescription}
                    placeholder="Describe what your product does and who it's for..."
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="max-w-md text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-background border flex items-center justify-center">
                <Command className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  Let's Set Up Your First Product
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create your first Product to train Hodhod on what you are
                  pitching. We recommend creating one product per ICP or use
                  case. In need of help?{" "}
                  <a href="#" className="underline hover:text-foreground">
                    Read our documentation.
                  </a>
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create Product
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
