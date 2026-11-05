# Gera ícones para o MangaScraper
# Execute: python generate_icons.py

import os
from PIL import Image, ImageDraw, ImageFont

def create_icon(size):
    """Cria um ícone simples com a letra M"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Fundo arredondado
    margin = size // 8
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 6,
        fill=(245, 158, 11, 255)  # #F59E0B
    )

    # Letra M
    try:
        font = ImageFont.truetype("arial.ttf", int(size * 0.5))
    except:
        font = ImageFont.load_default()

    text = "M"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2 - size // 20

    draw.text((x, y), text, fill=(13, 13, 13, 255), font=font)

    return img

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Gerar PNG para Linux/macOS
    for size in [16, 32, 48, 64, 128, 256, 512]:
        img = create_icon(size)
        path = os.path.join(base_dir, f"icon_{size}.png")
        img.save(path)
        print(f"[OK] {path}")

    # Copiar como icon.png principal
    img = create_icon(512)
    img.save(os.path.join(base_dir, "icon.png"))
    print(f"[OK] icon.png")

    # Gerar ICO para Windows (multi-tamanho)
    ico_path = os.path.join(base_dir, "icon.ico")
    sizes = [16, 32, 48, 64, 128, 256]
    images = [create_icon(s) for s in sizes]
    images[-1].save(ico_path, format='ICO', sizes=[(s, s) for s in sizes])
    print(f"[OK] icon.ico")

    print("\nÍcones gerados com sucesso!")

if __name__ == "__main__":
    main()