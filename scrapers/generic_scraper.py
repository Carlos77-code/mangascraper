# generic_scraper.py
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

class GenericScraper:
    """
    Scraper genérico para QUALQUER site de mangá/manhwa.
    Estratégia:
      1. Carregar HTML da página.
      2. Encontrar todas as tags <img>.
      3. Filtrar imagens relevantes (largura > 600px, URLs de CDN, etc).
      4. Resolver URLs relativas (urljoin).
      5. Retornar a lista de links.
    """

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    MIN_WIDTH = 400   # evita ícones, thumbnails e banners
    
    def fetch_pages(self, url: str) -> list[str]:
        print("[GENERIC] Fetching page HTML:", url)

        html = requests.get(url, headers=self.HEADERS)
        html.raise_for_status()

        soup = BeautifulSoup(html.text, "html.parser")
        image_tags = soup.find_all("img")

        image_urls = []

        for img in image_tags:
            src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
            if not src:
                continue

            # ignora ícones e imagens minúsculas
            try:
                width = int(img.get("width") or 0)
                if width < self.MIN_WIDTH:
                    continue
            except:
                pass

            # transforma URLs relativas em absolutas
            src = urljoin(url, src)

            # ignora anúncios e gifs
            if any(x in src for x in ["logo", "icon", "banner", "gif"]):
                continue

            image_urls.append(src)

        # Remove duplicados mantendo ordem
        image_urls = list(dict.fromkeys(image_urls))

        print(f"[GENERIC] {len(image_urls)} image(s) found.")

        return image_urls

    # Backwards-compatible adapter: callers expect `fetch(url)`
    def fetch(self, url: str) -> list[str]:
        """Compatibility wrapper that returns the same list as `fetch_pages`."""
        return self.fetch_pages(url)
