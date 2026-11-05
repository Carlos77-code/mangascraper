import re
import json
import os
import cloudscraper
from scrapers.scraper_base import BaseScraper


class MangaDexScraper(BaseScraper):
    def extract_chapter_id(self, url: str) -> str:
        match = re.search(r"/chapter/([0-9a-f-]+)", url)
        if not match:
            raise ValueError(f"Could not extract chapter ID from URL: {url}")
        return match.group(1)

    def fetch(self, url: str):
        print("[MangaDex] Calling At-Home API...")
        chapter_id = self.extract_chapter_id(url)

        api_url = f"https://api.mangadex.org/at-home/server/{chapter_id}"
        # Create a scraper with realistic browser profile and warm up cookies
        scraper = cloudscraper.create_scraper(browser='chrome', delay=10)
        
        # Load manual cookies from Electron session if available
        cookies_path = os.path.join(os.getcwd(), 'cookies.json')
        if os.path.exists(cookies_path):
            try:
                with open(cookies_path, 'r', encoding='utf-8') as f:
                    cookies_data = json.load(f)
                for c in cookies_data:
                    scraper.cookies.set(c['name'], c['value'], domain=c.get('domain',''))
                print(f"[MangaDex] Loaded {len(cookies_data)} manual cookies")
            except Exception as e:
                print(f"[MangaDex] Failed to load cookies: {e}")
        # Warm up session with a request to mangadex.org to obtain cookies
        try:
            scraper.get('https://mangadex.org', timeout=15)
        except Exception:
            pass

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": f"https://mangadex.org/chapter/{chapter_id}",
            "Origin": "https://mangadex.org"
        }

        last_error = None
        for attempt in range(3):
            r = scraper.get(api_url, headers=headers, timeout=20)
            if r.status_code != 200:
                last_error = f"HTTP {r.status_code}"
                print(f"[MangaDex] Attempt {attempt+1} failed with {last_error}")
                continue
            # Check if response is HTML challenge
            if r.text.lstrip().startswith('<!doctype html') or r.text.lstrip().startswith('<html'):
                print(f"[MangaDex] Attempt {attempt+1} got HTML challenge, retrying...")
                last_error = "HTML challenge"
                continue
            try:
                data = r.json()
                # If parsing succeeded break
                break
            except Exception as e:
                print(f"[MangaDex] Attempt {attempt+1} JSON decode error:", e)
                print("[MangaDex] Response text:", r.text[:500])
                last_error = str(e)
                continue
        else:
            raise Exception(f"MangaDex API returned invalid JSON after retries: {last_error or 'unknown'}")

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
