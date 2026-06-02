from PIL import Image, ImageDraw, ImageFont
import os

# Create a 512x512 image with primary color #004ac6
size = (512, 512)
img = Image.new('RGB', size, color='#004ac6')
draw = ImageDraw.Draw(img)

# We might not have a good font, just draw some shapes or use default font
try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 200)
except:
    font = ImageFont.load_default()

text = "RB"
# Get text bounding box
bbox = draw.textbbox((0, 0), text, font=font)
w = bbox[2] - bbox[0]
h = bbox[3] - bbox[1]

# Draw text in center
draw.text(((size[0]-w)/2, (size[1]-h)/2 - 40), text, font=font, fill="white")

# Save 512x512
img.save("icon-512.png")

# Resize to 192x192
img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
img_192.save("icon-192.png")
