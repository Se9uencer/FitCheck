"""
Amazon Product Scraper - Extracts product details, sizes, and measurements from Amazon
Simplified version using HTTP requests
"""
import re
import json
import time
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

from app.models import (
    ProductInfo, SizeOption, SizeChartEntry, Measurement,
    ProductDimensions, ExtractionResponse
)


class AmazonScraper:
    """Scrapes product information from Amazon product pages"""
    
    def __init__(self):
        self.ua = UserAgent()
        self.session = requests.Session()
        self._setup_session()
        print("✅ Amazon scraper initialized (HTTP mode)")
    
    def _setup_session(self):
        """Configure session with headers to mimic a real browser"""
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
        })
    
    def _extract_asin(self, url: str) -> Optional[str]:
        """Extract ASIN from Amazon URL"""
        # Pattern 1: /dp/ASIN
        match = re.search(r'/dp/([A-Z0-9]{10})', url, re.IGNORECASE)
        if match:
            return match.group(1).upper()
        
        # Pattern 2: /gp/product/ASIN
        match = re.search(r'/gp/product/([A-Z0-9]{10})', url, re.IGNORECASE)
        if match:
            return match.group(1).upper()
        
        return None
    
    def _normalize_url(self, url: str) -> str:
        """Convert any Amazon URL to a standard product page URL"""
        asin = self._extract_asin(url)
        if asin:
            return f"https://www.amazon.com/dp/{asin}"
        return url
    
    def _fetch_page(self, url: str, max_retries: int = 3) -> Optional[str]:
        """Fetch page content with retry logic"""
        for attempt in range(max_retries):
            try:
                # Rotate user agent
                try:
                    self.session.headers['User-Agent'] = self.ua.random
                except:
                    pass  # Keep default if ua.random fails
                
                response = self.session.get(url, timeout=20)
                
                if response.status_code == 200:
                    return response.text
                elif response.status_code == 503:
                    time.sleep(2 ** attempt)
                    continue
                else:
                    print(f"HTTP {response.status_code} for {url}")
                    
            except requests.RequestException as e:
                print(f"Request failed (attempt {attempt + 1}): {e}")
                time.sleep(1)
        
        return None
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract product title"""
        selectors = [
            '#productTitle',
            '#title span',
            'h1.a-size-large',
            'h1#title',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                title = element.get_text(strip=True)
                if title:
                    return title
        
        return "Unknown Product"
    
    def _extract_brand(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract brand name"""
        selectors = [
            '#bylineInfo',
            'a#bylineInfo',
            '.po-brand .a-span9 .a-size-base',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                text = re.sub(r'^(Visit the |Brand:\s*|Store\s*)', '', text)
                text = re.sub(r'\s+Store$', '', text)
                if text:
                    return text
        
        return None
    
    def _extract_price(self, soup: BeautifulSoup) -> Tuple[Optional[str], Optional[str]]:
        """Extract current and original price"""
        current_price = None
        original_price = None
        
        price_selectors = [
            '.a-price .a-offscreen',
            '#priceblock_ourprice',
            '#priceblock_dealprice',
            'span.a-price span.a-offscreen',
            '#corePrice_feature_buybox .a-offscreen',
        ]
        
        for selector in price_selectors:
            elements = soup.select(selector)
            for element in elements:
                price_text = element.get_text(strip=True)
                if price_text and '$' in price_text:
                    current_price = price_text
                    break
            if current_price:
                break
        
        original_selectors = [
            '.a-text-price .a-offscreen',
            '.basisPrice .a-offscreen',
        ]
        
        for selector in original_selectors:
            element = soup.select_one(selector)
            if element:
                price_text = element.get_text(strip=True)
                if price_text and '$' in price_text:
                    original_price = price_text
                    break
        
        return current_price, original_price
    
    def _extract_images(self, soup: BeautifulSoup, html: str) -> Tuple[Optional[str], List[str]]:
        """Extract main image and all product images"""
        images = []
        main_image = None
        
        # Try to find images in JavaScript data
        patterns = [
            r'"hiRes"\s*:\s*"([^"]+)"',
            r'"large"\s*:\s*"([^"]+)"',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, html)
            for match in matches:
                if match and 'images-amazon' in match and match not in images:
                    images.append(match)
        
        # Fallback to img tags
        for selector in ['#landingImage', '#imgBlkFront', '#main-image']:
            element = soup.select_one(selector)
            if element:
                src = element.get('data-old-hires') or element.get('data-a-dynamic-image') or element.get('src')
                if src:
                    # Handle data-a-dynamic-image JSON
                    if src.startswith('{'):
                        try:
                            img_data = json.loads(src)
                            src = list(img_data.keys())[0] if img_data else None
                        except:
                            src = None
                    if src and src not in images:
                        if not main_image:
                            main_image = src
                        images.append(src)
        
        if images and not main_image:
            main_image = images[0]
        
        return main_image, images[:10]
    
    def _extract_sizes(self, soup: BeautifulSoup) -> List[SizeOption]:
        """Extract available sizes"""
        sizes = []
        seen_sizes = set()
        
        # Method 1: Size dropdown
        for option in soup.select('#native_dropdown_selected_size_name option'):
            size_text = option.get_text(strip=True)
            if size_text and size_text.lower() not in ['select', 'select size', '']:
                if size_text not in seen_sizes:
                    seen_sizes.add(size_text)
                    sizes.append(SizeOption(size=size_text, available=True))
        
        # Method 2: Size buttons/swatches
        for li in soup.select('#variation_size_name li, [data-csa-c-element-id*="size"] li'):
            size_elem = li.select_one('.a-size-base, .swatch-title-text')
            if size_elem:
                size_text = size_elem.get_text(strip=True)
                if size_text and size_text not in seen_sizes:
                    seen_sizes.add(size_text)
                    # Check availability
                    available = 'swatchUnavailable' not in ' '.join(li.get('class', []))
                    sizes.append(SizeOption(size=size_text, available=available))
        
        return sizes
    
    def _extract_colors(self, soup: BeautifulSoup) -> Tuple[Optional[str], List[str]]:
        """Extract selected and available colors"""
        colors = []
        selected_color = None
        
        # Selected color
        for selector in ['#variation_color_name .selection', '.selection.po-truncate']:
            element = soup.select_one(selector)
            if element:
                selected_color = element.get_text(strip=True)
                break
        
        # All colors
        for elem in soup.select('#variation_color_name img[alt]'):
            color = elem.get('alt', '').strip()
            if color and color not in colors:
                colors.append(color)
        
        return selected_color, colors
    
    def _extract_features(self, soup: BeautifulSoup) -> List[str]:
        """Extract product features/bullet points"""
        features = []
        
        for li in soup.select('#feature-bullets li span.a-list-item'):
            text = li.get_text(strip=True)
            if text and len(text) > 5 and not text.startswith('Make sure'):
                features.append(text)
        
        return features[:10]
    
    def _extract_description(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract product description"""
        for selector in ['#productDescription p', '#productDescription']:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                if text and len(text) > 20:
                    return text[:2000]
        
        return None
    
    def _extract_material(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract material/fabric composition"""
        # Check product details table
        for row in soup.select('#productDetails_techSpec_section_1 tr'):
            th = row.select_one('th')
            td = row.select_one('td')
            if th and td:
                label = th.get_text(strip=True).lower()
                if 'material' in label or 'fabric' in label:
                    return td.get_text(strip=True)
        
        # Check product facts
        for item in soup.select('.a-section.a-spacing-small'):
            text = item.get_text(strip=True)
            if 'Material' in text or 'Fabric' in text:
                return text
        
        # Check features for material info
        for feature in soup.select('#feature-bullets li'):
            text = feature.get_text(strip=True)
            if any(word in text.lower() for word in ['cotton', 'polyester', 'nylon', 'wool', 'silk', 'blend']):
                return text
        
        return None
    
    def _extract_rating(self, soup: BeautifulSoup) -> Tuple[Optional[float], Optional[int]]:
        """Extract rating and review count"""
        rating = None
        count = None
        
        rating_elem = soup.select_one('#acrPopover, .a-icon-star span.a-icon-alt')
        if rating_elem:
            text = rating_elem.get('title', '') or rating_elem.get_text(strip=True)
            match = re.search(r'([\d.]+)', text)
            if match:
                rating = float(match.group(1))
        
        count_elem = soup.select_one('#acrCustomerReviewText')
        if count_elem:
            text = count_elem.get_text(strip=True)
            match = re.search(r'([\d,]+)', text)
            if match:
                count = int(match.group(1).replace(',', ''))
        
        return rating, count
    
    def _detect_clothing_type(self, title: str, features: List[str]) -> Optional[str]:
        """Detect the type of clothing"""
        text = f"{title} {' '.join(features)}".lower()
        
        clothing_types = {
            'shirt': ['shirt', 't-shirt', 'tee', 'polo', 'blouse', 'top', 'henley'],
            'pants': ['pants', 'jeans', 'trousers', 'chinos', 'slacks', 'joggers'],
            'shorts': ['shorts'],
            'dress': ['dress', 'gown'],
            'skirt': ['skirt'],
            'jacket': ['jacket', 'blazer', 'coat', 'hoodie', 'sweater', 'cardigan'],
        }
        
        for clothing_type, keywords in clothing_types.items():
            if any(keyword in text for keyword in keywords):
                return clothing_type
        
        return None
    
    def _detect_gender(self, title: str, features: List[str]) -> Optional[str]:
        """Detect target gender"""
        text = f"{title} {' '.join(features)}".lower()
        
        if any(word in text for word in ["men's", "mens", "male", "for men"]):
            return "men"
        elif any(word in text for word in ["women's", "womens", "female", "for women", "ladies"]):
            return "women"
        elif any(word in text for word in ["unisex"]):
            return "unisex"
        
        return None
    
    def extract_product(self, url: str) -> ExtractionResponse:
        """Main method to extract all product information"""
        warnings = []
        
        try:
            # Normalize URL
            normalized_url = self._normalize_url(url)
            asin = self._extract_asin(url)
            
            if not asin:
                return ExtractionResponse(
                    success=False,
                    error="Could not extract ASIN from URL. Please provide a valid Amazon product URL."
                )
            
            print(f"Extracting product: {asin}")
            
            # Fetch page
            html = self._fetch_page(normalized_url)
            
            if not html:
                return ExtractionResponse(
                    success=False,
                    error="Failed to fetch product page. Amazon may be blocking requests or the product doesn't exist."
                )
            
            # Check for CAPTCHA
            if 'Enter the characters you see below' in html or 'api-services-support@amazon.com' in html:
                return ExtractionResponse(
                    success=False,
                    error="Amazon is requesting CAPTCHA verification. Please try again later."
                )
            
            soup = BeautifulSoup(html, 'lxml')
            
            # Extract all data
            title = self._extract_title(soup)
            brand = self._extract_brand(soup)
            current_price, original_price = self._extract_price(soup)
            main_image, images = self._extract_images(soup, html)
            sizes = self._extract_sizes(soup)
            selected_color, colors = self._extract_colors(soup)
            features = self._extract_features(soup)
            description = self._extract_description(soup)
            material = self._extract_material(soup)
            rating, review_count = self._extract_rating(soup)
            clothing_type = self._detect_clothing_type(title, features)
            gender = self._detect_gender(title, features)
            
            # Add warnings for missing data
            if not sizes:
                warnings.append("Could not extract size options - you can add sizes manually")
            if not material:
                warnings.append("Material composition not found")
            if not current_price:
                warnings.append("Price not found")
            
            # Size chart is empty - user will need to input manually
            size_chart: List[SizeChartEntry] = []
            
            product = ProductInfo(
                asin=asin,
                title=title,
                brand=brand,
                price=current_price,
                original_price=original_price,
                main_image=main_image,
                images=images,
                available_sizes=sizes,
                size_chart=size_chart,  # Empty - user will input manually
                material=material,
                color=selected_color,
                available_colors=colors,
                features=features,
                description=description,
                clothing_type=clothing_type,
                gender=gender,
                rating=rating,
                review_count=review_count,
                url=normalized_url,
                scraped_at=datetime.now().isoformat(),
            )
            
            return ExtractionResponse(
                success=True,
                product=product,
                warnings=warnings
            )
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return ExtractionResponse(
                success=False,
                error=f"Extraction failed: {str(e)}"
            )
