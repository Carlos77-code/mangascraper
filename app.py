# App.py
from flask import Flask, render_template, request, jsonify
import threading

from scraper import fetch_manga_chapter

import os

# Obtenha o caminho absoluto do diretório atual
base_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, "ui", "templates"),
    static_folder=os.path.join(base_dir, "ui", "static")
)

status = {
    "state": "IDLE",
    "progress": 0,
    "message": "Idle"
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start", methods=["POST"])
def start():
    data = request.json
    # Validate input
    if not data or not data.get("url") or not data.get("name"):
        return jsonify({"error": "Missing url or name"}), 400

    try:
        chapter_number = int(data.get("chapter"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid chapter number"}), 400

    # Ensure URL is MangaDex (only supported)
    if "mangadex.org" not in data.get("url"):
        return jsonify({"error": "Only MangaDex URLs are supported"}), 400

    thread = threading.Thread(
        target=run_pipeline,
        args=(data["url"], data["name"], chapter_number)
    )
    thread.start()

    return jsonify({"started": True})

@app.route("/status")
def get_status():
    return jsonify(status)


@app.route("/debug_fetch", methods=["POST"])
def debug_fetch():
    data = request.json
    if not data or not data.get("url"):
        return jsonify({"error": "Missing url"}), 400

    url = data.get("url")

    # Only MangaDex supported
    if "mangadex.org" not in url:
        return jsonify({"error": "Only MangaDex URLs are supported"}), 400

    try:
        from scrapers.mangadex_scraper import MangaDexScraper
        scraper = MangaDexScraper()
        images = scraper.fetch(url)
        return jsonify({"count": len(images), "images": images})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def run_pipeline(url, name, chapter):
    try:
        status.update({
            "state": "FETCHING_METADATA",
            "progress": 5,
            "message": "Fetching metadata"
        })

        fetch_manga_chapter(
            url=url,
            manga_name=name,
            chapter_number=chapter,
            status_callback=update_status
        )

        status.update({
            "state": "COMPLETED",
            "progress": 100,
            "message": "PDF ready"
        })

    except Exception as e:
        status.update({
            "state": "ERROR",
            "message": str(e)
        })

def update_status(progress, message):
    status["progress"] = progress
    status["message"] = message

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
