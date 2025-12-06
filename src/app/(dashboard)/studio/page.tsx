"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  Plus,
  Globe,
  MoreVertical,
  Check,
  X,
  Pencil,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Product = {
  id: string;
  name: string;
  isPublic: boolean;
  companyUrl?: string;
  bookingLink?: string;
  productUrl?: string;
  briefDescription?: string;
  icp?: string;
  valueProps?: string[];
  painPoints?: string[];
  proofPoints?: string[];
};

type WritingStyle = {
  id: string;
  name: string;
  isPublic: boolean;
  dos: string[];
  donts: string[];
  examples: {
    linkedinSequence: string;
    linkedinInMail: string;
    emailSequence: string;
  };
  advancedQuestions: Record<string, string>;
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
    icp: "B2B Sales Leaders, Founders, and Growth Marketers looking to scale outbound without hiring more SDRs.",
    valueProps: [
      "Automate repetitive outreach tasks",
      "Scale sales without increasing headcount",
      "Best-in-class account safety",
    ],
    painPoints: [
      "Manual outreach is time-consuming",
      "Hiring SDRs is expensive and risky",
      "LinkedIn account bans due to aggressive automation",
    ],
    proofPoints: [
      "150% sales increase in first 6 months",
      "95% quota attainment",
    ],
  },
  { id: "2", name: "Account Safety Focus", isPublic: true },
  { id: "3", name: "GTM Agency focus", isPublic: true },
  { id: "4", name: "Personalization", isPublic: true },
  { id: "5", name: "One Person Sales teams", isPublic: true },
  { id: "6", name: "Creative/ Marketing + Founder", isPublic: true },
  { id: "7", name: "Hodhod - Lead Gen for Recruitment", isPublic: true },
  { id: "8", name: "SaaS startups", isPublic: true },
];

const initialWritingStyles: WritingStyle[] = [
  {
    id: "1",
    name: "Hodhod",
    isPublic: true,
    dos: [
      "be concise, without losing value or sacrificing relevant research",
      'Use "we" instead of "I" when talking about (your company name)',
      "Write at a 10th-grade reading level",
    ],
    donts: [
      "oversell or be aggressive",
      'use generic phrases or AI jarden like "caught my eye"',
      'Use generic compliments like "impressive!" or "nice!"',
    ],
    examples: {
      linkedinSequence: "connect: hey cool product",
      linkedinInMail: "",
      emailSequence: "",
    },
    advancedQuestions: {},
  },
  {
    id: "2",
    name: "Catherine's Writing Style",
    isPublic: true,
    dos: [],
    donts: [],
    examples: { linkedinSequence: "", linkedinInMail: "", emailSequence: "" },
    advancedQuestions: {},
  },
  {
    id: "3",
    name: "New Writing Style",
    isPublic: false,
    dos: [],
    donts: [],
    examples: { linkedinSequence: "", linkedinInMail: "", emailSequence: "" },
    advancedQuestions: {},
  },
  {
    id: "4",
    name: "Alex",
    isPublic: true,
    dos: [],
    donts: [],
    examples: { linkedinSequence: "", linkedinInMail: "", emailSequence: "" },
    advancedQuestions: {},
  },
];

const advancedQuestionsList = [
  "How would you describe the overall tone you aim for in your messages? (e.g., professional, casual, friendly, direct)",
  "Are there any specific phrases or words you frequently use in your outreach?",
  "Do you have any preferences for punctuation or grammatical choices?",
  "How do you typically start your messages? Do you use a specific greeting?",
  "How do you usually end your messages or include a call to action?",
  "Are there any industry-specific terms or jargon you tend to use or avoid?",
  "What's your approach to mentioning your company or product/service in the initial outreach?",
  "Are there any specific \"do's and dont's\" you follow in your outreach?",
  "How long are your typical messages? Do you have a preferred character or word count?",
];

export default function StudioPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [writingStyles, setWritingStyles] =
    useState<WritingStyle[]>(initialWritingStyles);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    "1",
  );
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [showAdvancedQuestions, setShowAdvancedQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Create Product Modal State
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [newProductUrl, setNewProductUrl] = useState("");

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  // Derived state for active selection
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedStyle = writingStyles.find((s) => s.id === selectedStyleId);

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setSelectedStyleId(null);
    setShowAdvancedQuestions(false);
  };

  const handleStyleSelect = (id: string) => {
    setSelectedStyleId(id);
    setSelectedProductId(null);
    setShowAdvancedQuestions(false);
    setIsEditingName(false);
  };

  // Handle Edit Name
  const handleStartEditName = (currentName: string) => {
    setEditNameValue(currentName);
    setIsEditingName(true);
  };

  const handleSaveProductName = () => {
    if (!selectedProduct || !editNameValue.trim()) return;
    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id ? { ...p, name: editNameValue.trim() } : p,
    );
    setProducts(updatedProducts);
    setIsEditingName(false);
  };

  const handleSaveStyleName = () => {
    if (!selectedStyle || !editNameValue.trim()) return;
    const updatedStyles = writingStyles.map((s) =>
      s.id === selectedStyle.id ? { ...s, name: editNameValue.trim() } : s,
    );
    setWritingStyles(updatedStyles);
    setIsEditingName(false);
  };

  // Save Product (would persist to backend in production)
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveProduct = () => {
    if (!selectedProduct) return;
    // In production, this would call an API
    setSaveMessage("Product saved successfully!");
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleSaveStyle = () => {
    if (!selectedStyle) return;
    // In production, this would call an API
    setSaveMessage("Writing style saved successfully!");
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // Toggle Share Across Workspace
  const handleToggleProductShare = () => {
    if (!selectedProduct) return;
    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id ? { ...p, isPublic: !p.isPublic } : p,
    );
    setProducts(updatedProducts);
    setSaveMessage(
      selectedProduct.isPublic
        ? "Product is now private"
        : "Product shared across workspace!",
    );
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleToggleStyleShare = () => {
    if (!selectedStyle) return;
    const updatedStyles = writingStyles.map((s) =>
      s.id === selectedStyle.id ? { ...s, isPublic: !s.isPublic } : s,
    );
    setWritingStyles(updatedStyles);
    setSaveMessage(
      selectedStyle.isPublic
        ? "Writing style is now private"
        : "Writing style shared across workspace!",
    );
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleCreateProduct = (hasWebsite: boolean) => {
    const newId = (products.length + 1).toString();
    const newProduct: Product = {
      id: newId,
      name: hasWebsite ? "New Product (from URL)" : "New Product",
      isPublic: false,
      companyUrl: hasWebsite ? newProductUrl : "",
      // Simulate scraped data if URL provided
      briefDescription: hasWebsite
        ? "AI-generated description based on the provided website content..."
        : "",
      icp: hasWebsite ? "Predicted ICP based on website..." : "",
      valueProps: hasWebsite ? ["Value Prop 1", "Value Prop 2"] : [],
      painPoints: hasWebsite ? ["Pain Point 1", "Pain Point 2"] : [],
      proofPoints: [],
    };

    setProducts([...products, newProduct]);
    setSelectedProductId(newId);
    setSelectedStyleId(null);
    setShowCreateProductModal(false);
    setNewProductUrl("");
  };

  const handleCreateWritingStyle = () => {
    const newId = (writingStyles.length + 1).toString();
    const newStyle: WritingStyle = {
      id: newId,
      name: "New Writing Style",
      isPublic: false,
      dos: [],
      donts: [],
      examples: {
        linkedinSequence: "",
        linkedinInMail: "",
        emailSequence: "",
      },
      advancedQuestions: {},
    };

    setWritingStyles([...writingStyles, newStyle]);
    setSelectedStyleId(newId);
    setSelectedProductId(null);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    const updatedProducts = products.filter((p) => p.id !== selectedProduct.id);
    setProducts(updatedProducts);
    setSelectedProductId(
      updatedProducts.length > 0 ? updatedProducts[0].id : null,
    );
    setSaveMessage("Product deleted");
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleDeleteStyle = () => {
    if (!selectedStyle) return;
    const updatedStyles = writingStyles.filter(
      (s) => s.id !== selectedStyle.id,
    );
    setWritingStyles(updatedStyles);
    setSelectedStyleId(updatedStyles.length > 0 ? updatedStyles[0].id : null);
    setSaveMessage("Writing style deleted");
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // Writing Style Handlers
  const handleAddDo = (text: string) => {
    if (!selectedStyle || !text.trim()) return;
    const updatedStyles = writingStyles.map((s) => {
      if (s.id === selectedStyle.id) {
        return { ...s, dos: [...s.dos, text] };
      }
      return s;
    });
    setWritingStyles(updatedStyles);
  };

  const handleAddDont = (text: string) => {
    if (!selectedStyle || !text.trim()) return;
    const updatedStyles = writingStyles.map((s) => {
      if (s.id === selectedStyle.id) {
        return { ...s, donts: [...s.donts, text] };
      }
      return s;
    });
    setWritingStyles(updatedStyles);
  };

  const handleRemoveDo = (index: number) => {
    if (!selectedStyle) return;
    const updatedStyles = writingStyles.map((s) => {
      if (s.id === selectedStyle.id) {
        const newDos = [...s.dos];
        newDos.splice(index, 1);
        return { ...s, dos: newDos };
      }
      return s;
    });
    setWritingStyles(updatedStyles);
  };

  const handleRemoveDont = (index: number) => {
    if (!selectedStyle) return;
    const updatedStyles = writingStyles.map((s) => {
      if (s.id === selectedStyle.id) {
        const newDonts = [...s.donts];
        newDonts.splice(index, 1);
        return { ...s, donts: newDonts };
      }
      return s;
    });
    setWritingStyles(updatedStyles);
  };

  // Helper to handle array field updates for Product
  const handleProductArrayUpdate = (
    field: "valueProps" | "painPoints" | "proofPoints",
    action: "add" | "remove",
    value: string | number,
  ) => {
    if (!selectedProduct) return;
    const updatedProducts = products.map((p) => {
      if (p.id === selectedProduct.id) {
        const currentArray = p[field] || [];
        let newArray = [...currentArray];
        if (action === "add" && typeof value === "string") {
          newArray.push(value);
        } else if (action === "remove" && typeof value === "number") {
          newArray.splice(value, 1);
        }
        return { ...p, [field]: newArray };
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  if (showAdvancedQuestions && selectedStyle) {
    return (
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Left Sidebar - Questions List */}
        <div className="w-72 border-r overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedQuestions(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Custom Instructions / Advanced Questions
            </Button>
            <Button size="sm">Save</Button>
          </div>
          <div className="space-y-1">
            {advancedQuestionsList.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  currentQuestionIndex === i
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Question {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Question Detail */}
        <div className="flex-1 p-8 max-w-3xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Question {currentQuestionIndex + 1}
              </h2>
              <h1 className="text-xl font-semibold text-blue-600">
                {advancedQuestionsList[currentQuestionIndex]}
              </h1>
            </div>

            <textarea
              className="w-full min-h-[200px] p-4 text-sm rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Type your answer here..."
              value={
                selectedStyle.advancedQuestions[
                  `q${currentQuestionIndex + 1}`
                ] || ""
              }
              onChange={(e) => {
                const updatedStyles = writingStyles.map((s) => {
                  if (s.id === selectedStyle.id) {
                    return {
                      ...s,
                      advancedQuestions: {
                        ...s.advancedQuestions,
                        [`q${currentQuestionIndex + 1}`]: e.target.value,
                      },
                    };
                  }
                  return s;
                });
                setWritingStyles(updatedStyles);
              }}
            />

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (currentQuestionIndex < advancedQuestionsList.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    setShowAdvancedQuestions(false);
                  }
                }}
              >
                {currentQuestionIndex < advancedQuestionsList.length - 1
                  ? "Next"
                  : "Finish"}
                <Command className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Create Product Modal */}
      <Dialog
        open={showCreateProductModal}
        onOpenChange={setShowCreateProductModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enter Website URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2 mt-1">
              <div className="mb-2">
                <label className="text-sm font-medium">Website Page</label>
              </div>
              <Input
                placeholder="www.example.com/product"
                value={newProductUrl}
                onChange={(e) => setNewProductUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-3 p-3 bg-red-50 text-red-600 rounded-md text-sm items-start">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                Add the URL for the product you would like Hodhod to learn
                about. This may be a homepage, or a specific product page, or an
                external link.
              </p>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <button
              className="text-sm text-muted-foreground underline hover:text-foreground"
              onClick={() => handleCreateProduct(false)}
            >
              Don't have website
            </button>
            <Button onClick={() => handleCreateProduct(true)}>
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Left Sidebar - Navigation */}
      <div className="w-72 border-r bg-background overflow-y-auto relative flex flex-col">
        <div className="p-3 flex-1">
          {/* Products Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-2">
                <Command className="h-4 w-4" />
                <span className="font-medium text-sm">Products</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6"
                onClick={() => setShowCreateProductModal(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-0.5">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => handleProductSelect(product.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${
                      selectedProductId === product.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Command className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate text-left">{product.name}</span>
                    </div>
                    {product.isPublic && (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Writing Styles Section */}
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span className="font-medium text-sm">Writing Styles</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6"
                onClick={handleCreateWritingStyle}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-0.5">
              {writingStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors ${
                    selectedStyleId === style.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate text-left">{style.name}</span>
                  </div>
                  {style.isPublic && (
                    <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
        {/* Toast Notification */}
        {saveMessage && (
          <div className="absolute top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {saveMessage}
          </div>
        )}
        {selectedProduct ? (
          <>
            {/* Product Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <>
                    <Input
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="h-8 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveProductName();
                        if (e.key === "Escape") setIsEditingName(false);
                      }}
                    />
                    <Button size="sm" onClick={handleSaveProductName}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg font-semibold">
                      {selectedProduct.name}
                    </h1>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEditName(selectedProduct.name)}
                    >
                      Edit Name
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveProduct}>
                  Save
                </Button>
                <Button
                  variant={selectedProduct.isPublic ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleProductShare}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {selectedProduct.isPublic
                    ? "Shared"
                    : "Share Across Workspace"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDeleteProduct}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Product Form Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl p-5 space-y-8">
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

                {/* Ideal Customer Profile */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Ideal Customer Profile
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Describe your ideal customer.
                  </p>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue={selectedProduct.icp}
                    placeholder="e.g. B2B Sales Leaders, Founders..."
                  />
                </div>

                {/* Value Propositions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Value Propositions
                  </label>
                  <div className="space-y-2">
                    {selectedProduct.valueProps?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() =>
                            handleProductArrayUpdate(
                              "valueProps",
                              "remove",
                              idx,
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add value proposition..."
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleProductArrayUpdate(
                              "valueProps",
                              "add",
                              e.currentTarget.value,
                            );
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          handleProductArrayUpdate(
                            "valueProps",
                            "add",
                            input.value,
                          );
                          input.value = "";
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pain Points</label>
                  <div className="space-y-2">
                    {selectedProduct.painPoints?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() =>
                            handleProductArrayUpdate(
                              "painPoints",
                              "remove",
                              idx,
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add pain point..."
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleProductArrayUpdate(
                              "painPoints",
                              "add",
                              e.currentTarget.value,
                            );
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          handleProductArrayUpdate(
                            "painPoints",
                            "add",
                            input.value,
                          );
                          input.value = "";
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Proof Points */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Proof Points</label>
                  <div className="space-y-2">
                    {selectedProduct.proofPoints?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() =>
                            handleProductArrayUpdate(
                              "proofPoints",
                              "remove",
                              idx,
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add proof point..."
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleProductArrayUpdate(
                              "proofPoints",
                              "add",
                              e.currentTarget.value,
                            );
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          handleProductArrayUpdate(
                            "proofPoints",
                            "add",
                            input.value,
                          );
                          input.value = "";
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : selectedStyle ? (
          <>
            {/* Writing Style Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <>
                    <Input
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="h-8 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveStyleName();
                        if (e.key === "Escape") setIsEditingName(false);
                      }}
                    />
                    <Button size="sm" onClick={handleSaveStyleName}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg font-semibold">
                      {selectedStyle.name}
                    </h1>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEditName(selectedStyle.name)}
                    >
                      Edit Name
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveStyle}>
                  Save
                </Button>
                <Button
                  variant={selectedStyle.isPublic ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleStyleShare}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {selectedStyle.isPublic ? "Shared" : "Share Across Workspace"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDeleteStyle}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Writing Style
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Writing Style Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="max-w-5xl space-y-8">
                {/* Style Instructions */}
                <div className="space-y-4">
                  <h2 className="font-medium">Style Instructions</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {/* DO's */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <Check className="h-4 w-4" />
                        <span>DO's</span>
                      </div>
                      <div className="space-y-2">
                        {selectedStyle.dos.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between group"
                          >
                            <span className="text-sm">{item}</span>
                            <button
                              onClick={() => handleRemoveDo(idx)}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter do's here"
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddDo(e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={(e) => {
                            const input = e.currentTarget
                              .previousElementSibling as HTMLInputElement;
                            handleAddDo(input.value);
                            input.value = "";
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* DONT's */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-2 text-red-500 font-medium">
                        <X className="h-4 w-4" />
                        <span>DONT's</span>
                      </div>
                      <div className="space-y-2">
                        {selectedStyle.donts.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between group"
                          >
                            <span className="text-sm">{item}</span>
                            <button
                              onClick={() => handleRemoveDont(idx)}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter don'ts here"
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddDont(e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={(e) => {
                            const input = e.currentTarget
                              .previousElementSibling as HTMLInputElement;
                            handleAddDont(input.value);
                            input.value = "";
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Messages */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-medium">Example Messages</h2>
                    <p className="text-sm text-muted-foreground">
                      Copy and paste examples of message you like that represent
                      your writing style.
                      <br />
                      Note: Product information will not be extracted from these
                      messages. Only writing style queues will be taken from
                      these messages.
                    </p>
                  </div>

                  <Tabs defaultValue="linkedin" className="w-full">
                    <TabsList>
                      <TabsTrigger value="linkedin">
                        LinkedIn Sequence
                      </TabsTrigger>
                      <TabsTrigger value="inmail">LinkedIn InMail</TabsTrigger>
                      <TabsTrigger value="email">Email Sequence</TabsTrigger>
                    </TabsList>
                    <TabsContent value="linkedin" className="mt-4">
                      <textarea
                        className="w-full min-h-[200px] p-4 text-sm rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="connect: hey cool product..."
                        defaultValue={selectedStyle.examples.linkedinSequence}
                      />
                    </TabsContent>
                    <TabsContent value="inmail" className="mt-4">
                      <textarea
                        className="w-full min-h-[200px] p-4 text-sm rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter InMail examples..."
                        defaultValue={selectedStyle.examples.linkedinInMail}
                      />
                    </TabsContent>
                    <TabsContent value="email" className="mt-4">
                      <textarea
                        className="w-full min-h-[200px] p-4 text-sm rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter Email sequence examples..."
                        defaultValue={selectedStyle.examples.emailSequence}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end">
                    <Button>Update & Save</Button>
                  </div>
                </div>

                {/* Advanced Questions Link */}
                <div className="pt-4 pb-8">
                  <button
                    onClick={() => setShowAdvancedQuestions(true)}
                    className="text-sm font-medium underline hover:text-primary"
                  >
                    Advanced Questions
                  </button>
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
              <Button onClick={() => setShowCreateProductModal(true)}>
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
