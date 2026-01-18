# Ink2PDF.py
import argparse
import sys
from scraper import fetch_manga_chapter

def run_interactive_mode():
    print("=== MangaScraper Interactive Mode ===")
    url = input("Enter chapter URL: ").strip()
    name = input("Manga name: ").strip()
    chapter = input("Chapter: ").strip()

    # chamada POSICIONAL (sem kwargs)
    fetch_manga_chapter(url, name, chapter)

def run_cli_mode():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", help="Chapter URL")
    parser.add_argument("--name", help="Manga/Manhwa name")
    parser.add_argument("--chapter", help="Chapter number")
    args = parser.parse_args()

    # If any argument is missing → fallback to interactive mode
    if not args.url or not args.name or not args.chapter:
        run_interactive_mode()
        return

    # chamada POSICIONAL (sem kwargs)
    fetch_manga_chapter(args.url, args.name, args.chapter)

if __name__ == "__main__":
    # If there are arguments besides script name, use CLI mode
    if len(sys.argv) > 1:
        run_cli_mode()
    else:
        run_interactive_mode()
