from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 627

FONT_DIR = "C:/Windows/Fonts/"

def font(name, size):
    try:
        return ImageFont.truetype(FONT_DIR + name, size)
    except:
        return ImageFont.load_default()

# Regular fonts
f_logo       = font("segoeuib.ttf",  26)
f_hero       = font("bahnschrift.ttf", 52)
f_sub        = font("segoeuil.ttf",  21)
f_feat_text  = font("segoeui.ttf",   18)
f_badge      = font("segoeuib.ttf",  13)
f_url        = font("segoeui.ttf",   17)
f_trial      = font("segoeuil.ttf",  13)
f_eyebrow    = font("segoeuil.ttf",  13)
f_dot_label  = font("segoeuib.ttf",  10)
f_small      = font("segoeuib.ttf",   9)

# Emoji font
f_emoji_feat  = font("seguiemj.ttf",  17)
f_emoji_badge = font("seguiemj.ttf",  13)
f_emoji_small = font("seguiemj.ttf",  11)

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# ──────────────────────────────────────────────────────────
# Background gradient
img = Image.new("RGB", (W, H), "#080a0f")
draw = ImageDraw.Draw(img, "RGBA")

for y in range(H):
    r = int(8 + (y / H) * 5)
    g = int(10 + (y / H) * 3)
    b = int(15 + (y / H) * 9)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Grid texture
grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(grid)
for x in range(0, W, 48):
    gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 5))
for y in range(0, H, 48):
    gd.line([(0, y), (W, y)], fill=(255, 255, 255, 5))
img = Image.alpha_composite(img.convert("RGBA"), grid).convert("RGB")
draw = ImageDraw.Draw(img, "RGBA")

# Ambient glows
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd2 = ImageDraw.Draw(glow)
gd2.ellipse([-100, H - 130, 300, H + 200], fill=(59, 130, 246, 9))
gd2.ellipse([820, -100, 1120, 200],         fill=(59, 130, 246, 12))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(img, "RGBA")

# ──────────────────────────────────────────────────────────
# RIGHT VISUAL — orbital diagram
cx, cy = 955, 313

# Concentric rings
for r, a in [(230, 7), (190, 11), (150, 16), (110, 23), (70, 30)]:
    ring = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    rd.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(59, 130, 246, a), width=1)
    img = Image.alpha_composite(img.convert("RGBA"), ring).convert("RGB")
    draw = ImageDraw.Draw(img, "RGBA")

# Inner glass circle
draw.ellipse([cx - 62, cy - 62, cx + 62, cy + 62], fill=(59, 130, 246, 22))
draw.ellipse([cx - 62, cy - 62, cx + 62, cy + 62], outline=(80, 150, 255, 100), width=1)

# Shield
s = 40
pts = [
    (cx - s*0.55, cy - s*0.60),
    (cx + s*0.55, cy - s*0.60),
    (cx + s*0.55, cy + s*0.05),
    (cx,          cy + s*0.72),
    (cx - s*0.55, cy + s*0.05),
]
draw.polygon(pts, fill=(59, 130, 246, 70), outline=(110, 170, 255, 200))

# Checkmark
lw = 3
draw.line([(cx - 13, cy + 3), (cx - 4, cy + 12)], fill="#FFFFFF", width=lw)
draw.line([(cx - 4, cy + 12), (cx + 13, cy - 8)], fill="#FFFFFF", width=lw)

# Orbiting dots
orbit_data = [
    (0,   110, "#4285F4", "G"),
    (58,  150, "#FF1A1A", "Y"),
    (120, 122, "#1877F2", "F"),
    (195, 133, "#34E0A1", "TA"),
    (283, 112, "#F59E0B", "!"),
    (330, 158, "#A78BFA", "AI"),
]

for angle_deg, orbit_r, color, label in orbit_data:
    angle = math.radians(angle_deg)
    px = int(cx + math.cos(angle) * orbit_r)
    py = int(cy + math.sin(angle) * orbit_r)
    dot_r = 14
    rgb = hex_to_rgb(color)

    # Glow halo
    glow3 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd3 = ImageDraw.Draw(glow3)
    for gr in [dot_r + 10, dot_r + 6, dot_r + 2]:
        gd3.ellipse([px - gr, py - gr, px + gr, py + gr], fill=(rgb[0], rgb[1], rgb[2], 16))
    img = Image.alpha_composite(img.convert("RGBA"), glow3).convert("RGB")
    draw = ImageDraw.Draw(img, "RGBA")

    draw.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r],
                 fill=(rgb[0], rgb[1], rgb[2], 45), outline=color, width=1)
    draw.text((px, py), label, font=f_dot_label, fill=color, anchor="mm")

    # Connector line
    ix = cx + math.cos(angle) * 63
    iy = cy + math.sin(angle) * 63
    draw.line([(ix, iy), (px, py)], fill=(rgb[0], rgb[1], rgb[2], 35), width=1)

# ──────────────────────────────────────────────────────────
# LEFT CONTENT
LX = 60
TY = 55

# ── PRODUCT HUNT BADGE ───────────────────────────────────
badge_bg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bd = ImageDraw.Draw(badge_bg)
bd.rounded_rectangle([LX, TY, LX + 225, TY + 30], radius=6,
                      fill=(249, 115, 22, 22), outline=(249, 115, 22, 85), width=1)
img = Image.alpha_composite(img.convert("RGBA"), badge_bg).convert("RGB")
draw = ImageDraw.Draw(img, "RGBA")

# Badge text (emoji + text separately)
draw.text((LX + 12, TY + 7), "Now on Product Hunt ", font=f_badge, fill="#FB923C")
# Measure text width for placing emoji
bbox = f_badge.getbbox("Now on Product Hunt ")
txt_w = bbox[2] - bbox[0]
draw.text((LX + 12 + txt_w, TY + 6), "\U0001F525", font=f_emoji_badge, fill="#FB923C")

# ── LOGO ─────────────────────────────────────────────────
logo_y = TY + 55
shield_logo = [
    (LX + 2,  logo_y),
    (LX + 22, logo_y),
    (LX + 22, logo_y + 14),
    (LX + 12, logo_y + 22),
    (LX + 2,  logo_y + 14),
]
draw.polygon(shield_logo, fill="#3B82F6", outline="#60A5FA")
draw.text((LX + 12, logo_y + 11), "RS", font=f_small, fill="white", anchor="mm")
draw.text((LX + 30, logo_y + 1),  "ReviewShield", font=f_logo, fill="#FFFFFF")
draw.text((LX + 30, logo_y + 31), "Online Reputation Intelligence", font=f_eyebrow, fill="#4B5563")

# ── BLUE ACCENT BAR ──────────────────────────────────────
hero_y = logo_y + 72
draw.rectangle([LX, hero_y - 4, LX + 3, hero_y + 178], fill="#3B82F6")

# ── HEADLINE ─────────────────────────────────────────────
hero_lines = [("Protect Your",        "#FFFFFF"),
              ("Business Reputation", "#FFFFFF"),
              ("with AI",             "#3B82F6")]
for i, (line, col) in enumerate(hero_lines):
    draw.text((LX + 16, hero_y + i * 58), line, font=f_hero, fill=col)

# ── SUBHEADLINE ──────────────────────────────────────────
sub_y = hero_y + 202
draw.text((LX + 16, sub_y),
          "Monitor Google, Yelp & Facebook reviews — automatically",
          font=f_sub, fill="#94A3B8")

# ── FEATURES (emoji + text in two passes) ────────────────
feat_defs = [
    ("\U0001F916", "  AI-generated review responses",        "#3B82F6"),
    ("⚡",     "  Real-time alerts for negative reviews", "#F59E0B"),
    ("\U0001F4CA", "  Reputation analytics dashboard",       "#22C55E"),
]
feat_y = sub_y + 44
for emoji_char, text, color in feat_defs:
    rgb = hex_to_rgb(color)
    # Colored dot indicator
    draw.ellipse([LX + 16, feat_y + 5, LX + 24, feat_y + 13], fill=color)
    # Emoji
    draw.text((LX + 33, feat_y - 1), emoji_char, font=f_emoji_feat, fill=color)
    # Text
    draw.text((LX + 58, feat_y), text, font=f_feat_text, fill="#CBD5E1")
    feat_y += 30

# ── BOTTOM DIVIDER ────────────────────────────────────────
div_y = H - 70
draw.line([(LX, div_y), (700, div_y)], fill=(255, 255, 255, 14))

# ── URL ──────────────────────────────────────────────────
draw.text((LX, div_y + 14), "reviewshield.vykmorix.com", font=f_url, fill="#3B82F6")

# ── TRIAL ────────────────────────────────────────────────
draw.text((LX, div_y + 36), "✓  14-day free trial  ·  No credit card required",
          font=f_trial, fill="#475569")

# ── VERTICAL DIVIDER ─────────────────────────────────────
draw.line([(730, 50), (730, H - 50)], fill=(255, 255, 255, 9))

# ── OUTER FRAME ──────────────────────────────────────────
draw.rectangle([0, 0, W - 1, H - 1], outline=(255, 255, 255, 12), width=1)
draw.rectangle([0, 0, W - 1, 2], fill="#3B82F6")

# ── SAVE ─────────────────────────────────────────────────
out = r"D:\Projects\reviewshield-dashboard\reviewshield-linkedin-poster.png"
img.save(out, "PNG")
print(f"Saved: {out}")
