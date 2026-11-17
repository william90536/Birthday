import os
import io
import base64
from PIL import Image
from rembg import remove, new_session

INPUT_GIF = "stitch.gif"
SKIP_BACKGROUND_REMOVAL = False
OUTPUT_DIR = "output"
name = os.path.splitext(os.path.basename(INPUT_GIF))[0]

PNG_DIR = os.path.join(OUTPUT_DIR, "PNG")
SVG_DIR = os.path.join(OUTPUT_DIR, "SVG")

os.makedirs(PNG_DIR, exist_ok=True)
os.makedirs(SVG_DIR, exist_ok=True)

MODEL_NAME = "isnet-general-use"

KEEP_SIZE = True

os.makedirs(OUTPUT_DIR, exist_ok=True)

session = new_session(MODEL_NAME)

def png_to_svg(image, output_path):

    width, height = image.size

    buffer = io.BytesIO()

    image.save(buffer, format="PNG")

    image_base64 = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="{width}"
     height="{height}"
     viewBox="0 0 {width} {height}">

    <image
        width="{width}"
        height="{height}"
        x="0"
        y="0"
        xlink:href="data:image/png;base64,{image_base64}"
    />

</svg>'''

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

def convert_gif():

    gif = Image.open(INPUT_GIF)

    total_frames = gif.n_frames

    print(f"GIF 總幀數：{total_frames}")

    for index in range(total_frames):
        # 取得當前影格
        gif.seek(index)
        frame = gif.convert("RGBA")
        # 轉PNG
        buffer = io.BytesIO()
        frame.save(buffer, format="PNG")
        input_data = buffer.getvalue()
        # AI去背
        if SKIP_BACKGROUND_REMOVAL:
            transparent_image = frame
        else:
            output_data = remove(
                input_data,
                session=session
            )

            transparent_image = Image.open(
                io.BytesIO(output_data)
            ).convert("RGBA")

        png_path = os.path.join(
            PNG_DIR,
            f"{name}{index}.png"
        )

        transparent_image.save(png_path)

        svg_path = os.path.join(
            SVG_DIR,
            f"{name}{index}.svg"
        )

        png_to_svg(
            transparent_image,
            svg_path
        )

        print(
            f"[{index + 1}/{total_frames}] "
            f"完成：{name}{index}.svg"
        )

    print("\n全部影格處理完成")


# ==========================================
# 執行
# ==========================================

if __name__ == "__main__":
    convert_gif()
