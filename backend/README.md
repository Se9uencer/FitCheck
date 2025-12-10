# FitCheck Backend

Python FastAPI backend for extracting clothing product data from Amazon.

## Features

- 🛒 **Amazon Product Extraction**: Extract sizes, dimensions, materials, and more from Amazon URLs
- 📏 **Size Chart Parsing**: Automatically parse size charts with measurements
- 🎨 **Color Detection**: Extract available colors and variants
- 📸 **Image Extraction**: Get high-resolution product images
- 🏷️ **Smart Detection**: Automatically detect clothing type and gender

## Setup

### Prerequisites
- Python 3.10+
- pip or pipenv

### Installation

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python -m app.main
```

Or with uvicorn directly:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
GET /health
```

### Extract Product
```
POST /api/extract
Content-Type: application/json

{
  "url": "https://www.amazon.com/dp/B0XXXXX",
  "include_size_chart": true,
  "include_all_images": true
}
```

### Get Product by ASIN
```
GET /api/product/{asin}
```

### Demo Product (for testing)
```
GET /api/demo/product
```

## Response Format

```json
{
  "success": true,
  "product": {
    "asin": "B0XXXXX",
    "title": "Product Title",
    "brand": "Brand Name",
    "price": "$29.99",
    "available_sizes": [
      {"size": "S", "available": true},
      {"size": "M", "available": true}
    ],
    "size_chart": [
      {
        "size": "S",
        "measurements": [
          {"name": "chest", "value": 36, "unit": "inches"}
        ]
      }
    ],
    "material": "100% Cotton",
    "available_colors": ["Black", "White", "Navy"],
    "features": ["Feature 1", "Feature 2"],
    "url": "https://www.amazon.com/dp/B0XXXXX"
  },
  "warnings": []
}
```

## Notes

- Amazon has rate limiting and anti-scraping measures. The scraper uses rotating user agents and request delays to mitigate this.
- Some product data may not be available depending on how the seller formatted their listing.
- For production use, consider using Amazon's official Product Advertising API.

## Development

The project structure:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app
│   ├── models.py        # Pydantic models
│   └── scrapers/
│       ├── __init__.py
│       └── amazon_scraper.py  # Amazon extraction logic
├── requirements.txt
└── README.md
```

