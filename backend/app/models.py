"""
Data models for Amazon product extraction
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, HttpUrl


class SizeOption(BaseModel):
    """Represents a single size option for a product"""
    size: str = Field(..., description="Size label (e.g., 'S', 'M', 'L', '32', '10')")
    available: bool = Field(True, description="Whether this size is in stock")
    price: Optional[str] = Field(None, description="Price for this size if different")


class Measurement(BaseModel):
    """Represents a single measurement dimension"""
    name: str = Field(..., description="Measurement name (e.g., 'chest', 'length', 'waist')")
    value: float = Field(..., description="Measurement value")
    unit: str = Field("inches", description="Unit of measurement")


class SizeChartEntry(BaseModel):
    """Represents a single row in a size chart"""
    size: str = Field(..., description="Size label")
    measurements: List[Measurement] = Field(default_factory=list)


class ProductDimensions(BaseModel):
    """Product package/item dimensions"""
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    unit_length: str = "inches"
    unit_weight: str = "pounds"


class ProductInfo(BaseModel):
    """Complete product information extracted from Amazon"""
    # Basic info
    asin: Optional[str] = Field(None, description="Amazon Standard Identification Number")
    title: str = Field(..., description="Product title")
    brand: Optional[str] = Field(None, description="Brand name")
    price: Optional[str] = Field(None, description="Current price")
    original_price: Optional[str] = Field(None, description="Original price before discount")
    currency: str = Field("USD", description="Currency code")
    
    # Images
    main_image: Optional[str] = Field(None, description="Main product image URL")
    images: List[str] = Field(default_factory=list, description="All product image URLs")
    
    # Sizing
    available_sizes: List[SizeOption] = Field(default_factory=list, description="Available size options")
    size_chart: List[SizeChartEntry] = Field(default_factory=list, description="Size chart with measurements")
    fit_type: Optional[str] = Field(None, description="Fit type (e.g., 'Slim Fit', 'Regular Fit')")
    
    # Materials & Care
    material: Optional[str] = Field(None, description="Material composition")
    care_instructions: Optional[str] = Field(None, description="Care instructions")
    
    # Category & Type
    category: Optional[str] = Field(None, description="Product category")
    clothing_type: Optional[str] = Field(None, description="Type of clothing (shirt, pants, etc.)")
    gender: Optional[str] = Field(None, description="Target gender")
    
    # Product dimensions
    dimensions: Optional[ProductDimensions] = Field(None, description="Product dimensions")
    
    # Additional details
    color: Optional[str] = Field(None, description="Selected color")
    available_colors: List[str] = Field(default_factory=list, description="All available colors")
    features: List[str] = Field(default_factory=list, description="Product features/bullet points")
    description: Optional[str] = Field(None, description="Product description")
    
    # Ratings
    rating: Optional[float] = Field(None, description="Average rating")
    review_count: Optional[int] = Field(None, description="Number of reviews")
    
    # Source
    url: str = Field(..., description="Original Amazon URL")
    scraped_at: Optional[str] = Field(None, description="Timestamp of extraction")


class ExtractionRequest(BaseModel):
    """Request model for product extraction"""
    url: str = Field(..., description="Amazon product URL")
    include_size_chart: bool = Field(True, description="Whether to extract size chart")
    include_all_images: bool = Field(True, description="Whether to extract all images")


class ExtractionResponse(BaseModel):
    """Response model for product extraction"""
    success: bool
    product: Optional[ProductInfo] = None
    error: Optional[str] = None
    warnings: List[str] = Field(default_factory=list)

