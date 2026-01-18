import requests
from scrapers.scraper_base import BaseScraper


class MangaDexScraper(BaseScraper):
    def extract_chapter_id(self, url: str) -> str:
        return url.rstrip("/").split("/")[-1]

    def fetch(self, url: str):
        print("[MangaDex] Calling At-Home API...")
        chapter_id = self.extract_chapter_id(url)

        api_url = f"https://api.mangadex.org/at-home/server/{chapter_id}"
        r = requests.get(api_url, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code != 200:
            raise Exception(f"MangaDex API returned HTTP {r.status_code}")

        data = r.json()

        # Expected structure: { baseUrl, chapter: { hash, data: [filenames] } }
        if "baseUrl" not in data or "chapter" not in data:
            print("[MangaDex] Unexpected response structure:", data)
            raise Exception("Unexpected MangaDex API response")

        base_url = data["baseUrl"]
        chapter = data["chapter"]
        hash_val = chapter.get("hash")
        pages = chapter.get("data") or []

        if not hash_val or not pages:
            raise Exception("No pages/hash found in MangaDex response")

        images = [f"{base_url}/data/{hash_val}/{filename}" for filename in pages]
        print(f"[MangaDex] Found {len(images)} pages.")
        return images
