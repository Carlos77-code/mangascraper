# # App.py
# from flask import Flask, render_template, request, jsonify
# import threading

# from scraper import fetch_manga_chapter

# import os

# # Obtenha o caminho absoluto do diretório atual
# base_dir = os.path.abspath(os.path.dirname(__file__))

# app = Flask(
#     __name__,
#     template_folder=os.path.join(base_dir, "ui", "templates"),
#     static_folder=os.path.join(base_dir, "ui", "static")
# )

# status = {
#     "state": "IDLE",
#     "progress": 0,
#     "message": "Idle"
# }

# @app.route("/")
# def index():
#     return render_template("index.html")

# @app.route("/start", methods=["POST"])
# def start():
#     data = request.json
#     # Validate input
#     if not data or not data.get("url") or not data.get("name"):
#         return jsonify({"error": "Missing url or name"}), 400

#     try:
#         chapter_number = int(data.get("chapter"))
#     except (TypeError, ValueError):
#         return jsonify({"error": "Invalid chapter number"}), 400

#     # Ensure URL is MangaDex (only supported)
#     if "mangadex.org" not in data.get("url"):
#         return jsonify({"error": "Only MangaDex URLs are supported"}), 400

#     thread = threading.Thread(
#         target=run_pipeline,
#         args=(data["url"], data["name"], chapter_number)
#     )
#     thread.start()

#     return jsonify({"started": True})

# @app.route("/status")
# def get_status():
#     return jsonify(status)


# @app.route("/debug_fetch", methods=["POST"])
# def debug_fetch():
#     data = request.json
#     if not data or not data.get("url"):
#         return jsonify({"error": "Missing url"}), 400

#     url = data.get("url")

#     # Only MangaDex supported
#     if "mangadex.org" not in url:
#         return jsonify({"error": "Only MangaDex URLs are supported"}), 400

#     try:
#         from scrapers.mangadex_scraper import MangaDexScraper
#         scraper = MangaDexScraper()
#         images = scraper.fetch(url)
#         return jsonify({"count": len(images), "images": images})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# def run_pipeline(url, name, chapter):
#     try:
#         status.update({
#             "state": "FETCHING_METADATA",
#             "progress": 5,
#             "message": "Fetching metadata"
#         })

#         fetch_manga_chapter(
#             url=url,
#             manga_name=name,
#             chapter_number=chapter,
#             status_callback=update_status
#         )

#         status.update({
#             "state": "COMPLETED",
#             "progress": 100,
#             "message": "PDF ready"
#         })

#     except Exception as e:
#         status.update({
#             "state": "ERROR",
#             "message": str(e)
#         })

# def update_status(progress, message):
#     status["progress"] = progress
#     status["message"] = message

# @app.route("/")
# def health():
#     return {"status": "running"}, 200
    
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 5000))
#     app.run(
#         host="0.0.0.0",
#         port=port,
#         debug=False
#     )


from flask import Flask, render_template, request, jsonify, send_file
import threading
from io import BytesIO
import os
from scraper import fetch_manga_chapter

base_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, "ui", "templates"),
    static_folder=os.path.join(base_dir, "ui", "static")
)

# Estado global para controle de progresso
status = {"state": "IDLE", "progress": 0, "message": "Idle"}
# Armazena temporariamente o PDF gerado: {'buffer': BytesIO, 'filename': str}
current_pdf = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start", methods=["POST"])
def start():
    global status
    data = request.json
    
    if not data or not data.get("url") or not data.get("name"):
        return jsonify({"error": "Missing url or name"}), 400

    try:
        chapter_number = int(data.get("chapter"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid chapter number"}), 400

    if "mangadex.org" not in data.get("url"):
        return jsonify({"error": "Only MangaDex URLs are supported"}), 400

    # Reseta status para novo processo
    status = {"state": "PROCESSING", "progress": 0, "message": "Starting..."}
    
    thread = threading.Thread(
        target=run_pipeline,
        args=(data["url"], data["name"], chapter_number)
    )
    thread.start()

    return jsonify({"started": True})

@app.route("/status")
def get_status():
    return jsonify(status)

@app.route("/download")
def download():
    """
    Endpoint para baixar o PDF gerado.
    Envia o buffer em memória como arquivo para download.
    """
    global current_pdf
    
    if current_pdf is None:
        return jsonify({"error": "No PDF available. Generate one first."}), 404
    
    buffer = current_pdf['buffer']
    filename = current_pdf['filename']
    
    # Cria cópia do buffer para envio seguro
    download_buffer = BytesIO(buffer.getvalue())
    
    # Limpa referência após preparo (evita vazamento de memória)
    current_pdf = None
    
    return send_file(
        download_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )

@app.route("/debug_fetch", methods=["POST"])
def debug_fetch():
    data = request.json
    if not data or not data.get("url"):
        return jsonify({"error": "Missing url"}), 400

    url = data.get("url")
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
    global status, current_pdf
    try:
        status.update({"state": "FETCHING_METADATA", "progress": 5, "message": "Fetching metadata"})

        result = fetch_manga_chapter(
            url=url,
            manga_name=name,
            chapter_number=chapter,
            status_callback=update_status
        )
        
        # Armazena buffer em memória para download via navegador
        if result and result.get('buffer'):
            current_pdf = {
                'buffer': result['buffer'],
                'filename': result['filename']
            }
            status.update({
                "state": "COMPLETED",
                "progress": 100,
                "message": "PDF ready for download"
            })
        else:
            status.update({"state": "ERROR", "message": "Failed to generate PDF"})

    except Exception as e:
        status.update({"state": "ERROR", "message": str(e)})
        print(f"[ERROR] Pipeline failed: {str(e)}")

def update_status(progress, message):
    status["progress"] = progress
    status["message"] = message

@app.route("/health")
def health():
    """Endpoint para verificação de saúde (corrigido de '/' para '/health')"""
    return {"status": "running"}, 200
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)