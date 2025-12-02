"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  Plus,
  Globe,
  PenLine,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  isPublic: boolean;
};

type WritingStyle = {
  id: string;
  name: string;
  isPublic: boolean;
};

const products: Product[] = [
  { id: "1", name: "Valley V3", isPublic: true },
  { id: "2", name: "Alex MM+", isPublic: true },
  { id: "3", name: "Alex SMB Vertical", isPublic: true },
  { id: "4", name: "ValleyStudios", isPublic: true },
  { id: "5", name: "1-18", isPublic: true },
  { id: "6", name: "Finance + Insurance", isPublic: true },
  { id: "7", name: "Small Sales Team + AE", isPublic: true },
  { id: "8", name: "Small Sales Team + Founder", isPublic: true },
  { id: "9", name: "Small Sales Team + Sales Leader", isPublic: true },
  { id: "10", name: "Creative/ Marketing + Founder", isPublic: true },
  { id: "11", name: "New Product", isPublic: false },
];

const writingStyles: WritingStyle[] = [
  { id: "1", name: "Valley", isPublic: true },
  { id: "2", name: "Catherine's Writing Style", isPublic: true },
];

const steps = [
  { label: "Enter Your Website", completed: false },
  { label: "Valley Researches", completed: false },
  { label: "Product Created", completed: false },
];

export default function StudioPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-background overflow-y-auto">
        {/* Products Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Command className="h-4 w-4" />
              <span className="font-medium text-sm">Products</span>
            </div>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product.id);
                  setSelectedStyle(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${
                  selectedProduct === product.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Command className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{product.name}</span>
                </div>
                {product.isPublic && (
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Writing Styles Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              <span className="font-medium text-sm">Writing Styles</span>
            </div>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {writingStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  setSelectedStyle(style.id);
                  setSelectedProduct(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${
                  selectedStyle === style.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{style.name}</span>
                </div>
                {style.isPublic && (
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="max-w-md text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-background border flex items-center justify-center">
            <Command className="h-8 w-8" />
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Let's Set Up Your First Product
            </h2>
            <p className="text-sm text-muted-foreground">
              Create your first Product to train Valley on what you are pitching. We
              recommend creating one product per ICP or use case. In need of help?{" "}
              <a href="#" className="underline hover:text-foreground">
                Read our documentation.
              </a>
            </p>
          </div>

          {/* Create Button */}
          <Button className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" />
            Create Product
          </Button>

          {/* Stepper */}
          <div className="pt-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        step.completed
                          ? "bg-primary border-primary"
                          : "bg-background border-muted-foreground/30"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground mt-2 whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-24 h-[2px] bg-muted-foreground/20 mx-2 -mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
