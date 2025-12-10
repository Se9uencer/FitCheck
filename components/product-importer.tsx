"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ShoppingBag, 
  Link as LinkIcon, 
  Loader2, 
  AlertCircle, 
  Check, 
  Package,
  Ruler,
  Palette,
  Star,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react"

// Types matching the backend models
interface SizeOption {
  size: string
  available: boolean
}

interface Measurement {
  name: string
  value: number
  unit: string
}

interface SizeChartEntry {
  size: string
  measurements: Measurement[]
}

interface ProductInfo {
  asin?: string
  title: string
  brand?: string
  price?: string
  original_price?: string
  main_image?: string
  images: string[]
  available_sizes: SizeOption[]
  size_chart: SizeChartEntry[]
  fit_type?: string
  material?: string
  clothing_type?: string
  gender?: string
  color?: string
  available_colors: string[]
  features: string[]
  description?: string
  rating?: number
  review_count?: number
  url: string
}

interface ExtractionResponse {
  success: boolean
  product?: ProductInfo
  error?: string
  warnings: string[]
}

// User measurements for manual input
interface UserMeasurement {
  id: string
  label: string
  value: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const DEFAULT_MEASUREMENTS = [
  { id: "chest", label: "Chest", value: "" },
  { id: "waist", label: "Waist", value: "" },
  { id: "length", label: "Length", value: "" },
  { id: "shoulder", label: "Shoulder", value: "" },
  { id: "sleeve", label: "Sleeve", value: "" },
]

export function ProductImporter() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  
  // Expandable sections
  const [sizesExpanded, setSizesExpanded] = useState(true)
  const [colorsExpanded, setColorsExpanded] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  
  // Manual size input
  const [manualSizes, setManualSizes] = useState<string[]>(["S", "M", "L", "XL"])
  const [newSize, setNewSize] = useState("")
  const [userMeasurements, setUserMeasurements] = useState<UserMeasurement[]>(DEFAULT_MEASUREMENTS)

  const extractProduct = async () => {
    if (!url.trim()) {
      setError("Please enter an Amazon product URL")
      return
    }

    setLoading(true)
    setError(null)
    setProduct(null)
    setWarnings([])

    try {
      const response = await fetch(`${API_BASE_URL}/api/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          include_size_chart: true,
          include_all_images: true,
        }),
      })

      const data: ExtractionResponse = await response.json()

      if (data.success && data.product) {
        setProduct(data.product)
        setWarnings(data.warnings || [])
        // If sizes were extracted, use them; otherwise keep defaults
        if (data.product.available_sizes.length > 0) {
          setManualSizes(data.product.available_sizes.map(s => s.size))
        }
      } else {
        setError(data.error || "Failed to extract product data")
      }
    } catch (err) {
      setError("Failed to connect to the server. Make sure the backend is running on port 8000.")
    } finally {
      setLoading(false)
    }
  }

  const loadDemo = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/demo/product`)
      const data: ProductInfo = await response.json()
      setProduct(data)
      setWarnings([])
      if (data.available_sizes.length > 0) {
        setManualSizes(data.available_sizes.map(s => s.size))
      }
    } catch (err) {
      setError("Failed to load demo product. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const addSize = () => {
    if (newSize.trim() && !manualSizes.includes(newSize.trim())) {
      setManualSizes([...manualSizes, newSize.trim()])
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setManualSizes(manualSizes.filter(s => s !== size))
  }

  const updateMeasurement = (id: string, value: string) => {
    setUserMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, value } : m)
    )
  }

  const addMeasurement = () => {
    const newId = `custom_${Date.now()}`
    setUserMeasurements([...userMeasurements, { id: newId, label: "Custom", value: "" }])
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* URL Input Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Import from Amazon</h2>
            <p className="text-sm text-muted-foreground">Paste a product URL to extract sizing data</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://www.amazon.com/dp/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && extractProduct()}
              className="pl-11 h-12 bg-background border-border/50 focus:border-primary"
              disabled={loading}
            />
          </div>
          <Button
            onClick={extractProduct}
            disabled={loading}
            className="h-12 px-6 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Extracting...
              </>
            ) : (
              "Extract Data"
            )}
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">or</span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDemo}
            disabled={loading}
            className="text-sm"
          >
            Load Demo Product
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Warnings Display */}
        {warnings.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-yellow-500 font-medium">Notices:</p>
            </div>
            <ul className="text-sm text-yellow-500/80 space-y-1 ml-6">
              {warnings.map((warning, i) => (
                <li key={i}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Product Display */}
      {product && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Product Header */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              {product.main_image && (
                <div className="w-full md:w-48 h-48 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={product.main_image}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=No+Image'
                    }}
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                {product.brand && (
                  <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
                )}
                <h3 className="text-lg font-semibold leading-tight mb-3 line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {product.price && (
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                  )}
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.original_price}
                    </span>
                  )}
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    {product.review_count && (
                      <span className="text-sm text-muted-foreground">
                        ({product.review_count.toLocaleString()} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Info */}
                <div className="flex flex-wrap gap-2">
                  {product.clothing_type && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                      {product.clothing_type}
                    </span>
                  )}
                  {product.gender && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                      {product.gender}
                    </span>
                  )}
                  {product.material && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                      {product.material.slice(0, 50)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sizes Section - Always show with manual input */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button
              onClick={() => setSizesExpanded(!sizesExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-primary" />
                <span className="font-semibold">Sizes & Measurements</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                  {manualSizes.length} sizes
                </span>
              </div>
              {sizesExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {sizesExpanded && (
              <div className="px-6 pb-6 border-t border-border/30">
                {/* Available Sizes */}
                <div className="pt-6">
                  <h4 className="text-sm font-medium mb-3">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {manualSizes.map((size, i) => (
                      <div
                        key={i}
                        className="group px-4 py-2 rounded-lg border border-border bg-secondary text-sm font-medium flex items-center gap-2"
                      >
                        {size}
                        <button
                          onClick={() => removeSize(size)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Add size"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addSize()}
                        className="w-24 h-10"
                      />
                      <Button size="sm" variant="outline" onClick={addSize}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* User Measurements Input */}
                <div className="pt-4 border-t border-border/30">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-primary" />
                    Your Measurements (inches)
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Enter your body measurements to compare with product sizing
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userMeasurements.map((measurement) => (
                      <div key={measurement.id}>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          {measurement.label}
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={measurement.value}
                          onChange={(e) => updateMeasurement(measurement.id, e.target.value)}
                          className="h-10"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addMeasurement}
                    className="mt-3 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add measurement
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Colors Section */}
          {product.available_colors.length > 0 && (
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <button
                onClick={() => setColorsExpanded(!colorsExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Available Colors</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {product.available_colors.length} colors
                  </span>
                </div>
                {colorsExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {colorsExpanded && (
                <div className="px-6 pb-6 border-t border-border/30 pt-6">
                  <div className="flex flex-wrap gap-2">
                    {product.available_colors.map((color, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          color === product.color
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary hover:border-primary/50"
                        }`}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Product Details Section */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-semibold">Product Details</span>
              </div>
              {detailsExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {detailsExpanded && (
              <div className="px-6 pb-6 border-t border-border/30 pt-6 space-y-4">
                {product.material && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Material</h4>
                    <p className="text-sm text-muted-foreground">{product.material}</p>
                  </div>
                )}

                {product.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {product.description}
                    </p>
                  </div>
                )}

                {!product.material && !product.features.length && !product.description && (
                  <p className="text-sm text-muted-foreground">No additional details available</p>
                )}

                {/* Amazon Link */}
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                >
                  View on Amazon
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Success indicator */}
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-primary">
            <Check className="w-5 h-5" />
            <span>Product data extracted successfully</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
