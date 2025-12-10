"""
FitCheck Backend API - Product extraction and 3D model fitting
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.models import ExtractionRequest, ExtractionResponse, ProductInfo
from app.scrapers.amazon_scraper import AmazonScraper


# Global scraper instance
scraper: AmazonScraper = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the app"""
    global scraper
    print("🚀 Starting FitCheck Backend...")
    scraper = AmazonScraper()
    print("✅ Amazon scraper initialized")
    yield
    print("👋 Shutting down FitCheck Backend...")


app = FastAPI(
    title="FitCheck API",
    description="API for extracting clothing product data and virtual try-on",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "FitCheck API",
        "version": "0.1.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "scraper_ready": scraper is not None
    }


@app.post("/api/extract", response_model=ExtractionResponse)
async def extract_product(request: ExtractionRequest):
    """
    Extract product information from an Amazon URL
    
    - **url**: Amazon product URL (supports various formats)
    - **include_size_chart**: Whether to attempt to extract size chart
    - **include_all_images**: Whether to extract all product images
    
    Returns complete product information including:
    - Basic info (title, brand, price)
    - Available sizes and colors
    - Size chart with measurements (when available)
    - Material and care instructions
    - Product images
    - Dimensions
    """
    if not scraper:
        raise HTTPException(status_code=503, detail="Scraper not initialized")
    
    # Validate URL
    url = request.url.strip()
    if not url:
        return ExtractionResponse(
            success=False,
            error="URL is required"
        )
    
    # Check if it's an Amazon URL
    if 'amazon.com' not in url.lower() and 'amzn.' not in url.lower():
        return ExtractionResponse(
            success=False,
            error="Please provide a valid Amazon URL"
        )
    
    # Extract product data
    result = scraper.extract_product(url)
    
    return result


@app.get("/api/product/{asin}", response_model=ExtractionResponse)
async def get_product_by_asin(asin: str):
    """
    Extract product information using ASIN directly
    
    - **asin**: Amazon Standard Identification Number (10 characters)
    """
    if not scraper:
        raise HTTPException(status_code=503, detail="Scraper not initialized")
    
    # Validate ASIN format
    if len(asin) != 10 or not asin.isalnum():
        return ExtractionResponse(
            success=False,
            error="Invalid ASIN format. ASIN should be 10 alphanumeric characters."
        )
    
    url = f"https://www.amazon.com/dp/{asin}"
    result = scraper.extract_product(url)
    
    return result


# Demo endpoint with sample data (for testing without actually scraping)
@app.get("/api/demo/product", response_model=ProductInfo)
async def get_demo_product():
    """
    Returns a demo product for testing the frontend without scraping
    """
    from app.models import SizeOption, SizeChartEntry, Measurement
    
    return ProductInfo(
        asin="B0DEMO12345",
        title="Men's Classic Fit Cotton T-Shirt - Premium Quality Crew Neck Tee",
        brand="FitCheck Demo Brand",
        price="$29.99",
        original_price="$39.99",
        main_image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        images=[
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
        ],
        available_sizes=[
            SizeOption(size="S", available=True),
            SizeOption(size="M", available=True),
            SizeOption(size="L", available=True),
            SizeOption(size="XL", available=True),
            SizeOption(size="XXL", available=False),
        ],
        size_chart=[
            SizeChartEntry(size="S", measurements=[
                Measurement(name="chest", value=36, unit="inches"),
                Measurement(name="length", value=27, unit="inches"),
                Measurement(name="sleeve", value=8, unit="inches"),
            ]),
            SizeChartEntry(size="M", measurements=[
                Measurement(name="chest", value=38, unit="inches"),
                Measurement(name="length", value=28, unit="inches"),
                Measurement(name="sleeve", value=8.5, unit="inches"),
            ]),
            SizeChartEntry(size="L", measurements=[
                Measurement(name="chest", value=41, unit="inches"),
                Measurement(name="length", value=29, unit="inches"),
                Measurement(name="sleeve", value=9, unit="inches"),
            ]),
            SizeChartEntry(size="XL", measurements=[
                Measurement(name="chest", value=44, unit="inches"),
                Measurement(name="length", value=30, unit="inches"),
                Measurement(name="sleeve", value=9.5, unit="inches"),
            ]),
        ],
        material="100% Premium Cotton, 180 GSM",
        fit_type="Classic Fit",
        clothing_type="shirt",
        gender="men",
        color="Navy Blue",
        available_colors=["Navy Blue", "Black", "White", "Heather Gray", "Forest Green"],
        features=[
            "100% Premium Combed Cotton for ultimate softness",
            "Pre-shrunk fabric maintains size after washing",
            "Reinforced shoulder seams for durability",
            "Tagless design for comfort",
            "Classic crew neck fit",
        ],
        description="Experience comfort like never before with our Premium Classic Fit T-Shirt. Made from 100% combed cotton, this tee offers exceptional softness while maintaining durability.",
        rating=4.5,
        review_count=2847,
        url="https://www.amazon.com/dp/B0DEMO12345",
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

