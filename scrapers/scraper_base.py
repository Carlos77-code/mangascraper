# scrapers/scraper_base.py
class BaseScraper:
    def fetch(self, url: str):
        raise NotImplementedError