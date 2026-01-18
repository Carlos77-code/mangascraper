# scraper.py
import os
import requests
from PIL import Image
from io import BytesIO

from scrapers.mangadex_scraper import MangaDexScraper

from pathlib import Path


def sanitize(text):
    forbidden = r'\/:*?"<>|'
    for char in forbidden:
        text = text.replace(char, "_")
    return text

def fetch_manga_chapter(url, manga_name, chapter_number, status_callback=None):

    def update(p, msg):
        if status_callback:
            status_callback(p, msg)

    # ---------- Seleção automática ----------
    update(5, "Selecting scraper")

    # Only MangaDex is supported
    if "mangadex.org" in url:
        scraper = MangaDexScraper()
    else:
        raise Exception("Only MangaDex URLs are supported")

    print(f"[INFO] Using scraper: {scraper.__class__.__name__}")

    # ---------- Baixa as imagens ----------
    update(15, "Fetching chapter pages")
    images = scraper.fetch(url)

    if not images:
        raise Exception("No images returned by scraper")

    # ---------- Monta saída ----------
    update(30, "Preparing output folder")

    safe_name = sanitize(manga_name.replace(" ", "_"))
    output_folder = Path.home() / "Downloads" / safe_name
    output_folder.mkdir(parents=True, exist_ok=True) 

    pdf_name = f"{safe_name}_Chapter_{chapter_number}.pdf"
    pdf_path = os.path.join(output_folder, pdf_name)

    # ---------- Download imagens ----------
    pil_images = []
    total = len(images)

    for i, img_url in enumerate(images):
        update(
            30 + int((i / total) * 50),
            f"Downloading pages ({i+1}/{total})"
        )

        r = requests.get(img_url)
        r.raise_for_status()
        pil_images.append(Image.open(BytesIO(r.content)).convert("RGB"))

    # ---------- Gera PDF ----------
    update(90, "Generating PDF")

    pil_images[0].save(
        pdf_path,
        "PDF",
        save_all=True,
        append_images=pil_images[1:],
        resolution=100,
        quality=95
    )

    update(100, "PDF ready")

    print(f"[SUCCESS] PDF saved: {pdf_path}")
    return pdf_path

