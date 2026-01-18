# mangaplus_scraper.py
import re
import requests
from scrapers.scraper_base import BaseScraper

class MangaPlusScraper(BaseScraper):

    def extract_chapter_id(self, url: str) -> int:
        """
        Extract numeric chapterId from MangaPlus viewer URL.
        Examples:
        - https://mangaplus.shueisha.co.jp/viewer/1019345
        - https://mangaplus.shueisha.co.jp/viewer/1019345/
        - https://mangaplus.shueisha.co.jp/viewer/1019345?something=1
        """

        match = re.search(r"/viewer/(\d+)", url)
        if not match:
            raise Exception("Could not extract chapterId from URL.")
        return int(match.group(1))

    def fetch(self, url):
        print("[MangaPlus] Calling API...")

        api_url = "https://carlos-manga.carlinhoscaco96.workers.dev/api/getMangaboxViewer"

        # Extract chapter ID (robust)
        chapter_id = self.extract_chapter_id(url)

        payload = {
            "chapterId": chapter_id,
            "split": 0,
            "imgQuality": "high"
        }

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json",
            "Origin": "https://mangaplus.shueisha.co.jp",
            "Referer": "https://mangaplus.shueisha.co.jp/",
        }

        r = requests.post(api_url, json=payload, headers=headers)

        # Debug
        print(f"[DEBUG] Status code: {r.status_code}")

        if r.status_code != 200:
            raise Exception(f"MangaPlus API returned HTTP {r.status_code}")

        # JSON decode
        try:
            data = r.json()
        except Exception:
            print("[DEBUG] Response is not JSON. Dumping first 500 chars:")
            print(r.text[:500])
            raise Exception("MangaPlus returned non-JSON response.")

        # Validate structure
        if "success" not in data or "pages" not in data["success"]:
            print("[DEBUG] Unexpected API structure:")
            print(data)
            raise Exception("MangaPlus API changed or the worker blocked the request.")

        images = [
            page["imageUrl"]
            for page in data["success"]["pages"]
            if "imageUrl" in page
        ]

        if not images:
            raise Exception("No images found. Possibly DRM or blocked chapter.")

        print(f"[MangaPlus] Found {len(images)} pages.")
        return images

