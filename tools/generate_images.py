"""
Generates the illustrated SVG artwork used by Mazag (moods, places, film title cards).
Run from the project root:  python3 tools/generate_images.py
Replace any generated file with your own photo to upgrade it.
"""
import json, math, os, random, html

W, H = 1200, 750

# Two palettes per mood: [0] = light of day / sunset, [1] = dusk or night.
PAL = {
  'nostalgic': [
    dict(top='#cf8387', bot='#f6d9a9', sun='#fff3cf', far='#c58a85', mid='#9a6458', near='#5b3b2e', water1='#d7a58f', water2='#7d5148'),
    dict(top='#5d4560', bot='#eaa588', sun='#ffe3b8', far='#8e6070', mid='#6d4455', near='#33222b', water1='#c98c86', water2='#4c3040')],
  'adventurous': [
    dict(top='#e29a52', bot='#f8e2ae', sun='#fff6d6', far='#d9a766', mid='#b5532c', near='#7a3418', water1='#9fb8a0', water2='#5f7a5a'),
    dict(top='#1e2442', bot='#d9784c', sun='#ffe6b0', far='#8a4a3c', mid='#5a2f2c', near='#2c1618', water1='#5a4a6a', water2='#2a2038')],
  'romantic': [
    dict(top='#7d1f3a', bot='#f4b57c', sun='#fff0c8', far='#a8475a', mid='#6e2a3f', near='#2f1220', water1='#e3a07a', water2='#6a2a40'),
    dict(top='#2b1020', bot='#b14b5a', sun='#f8d9a0', far='#6a2a44', mid='#40182c', near='#1a0a14', water1='#a8506a', water2='#2a1020')],
  'calm': [
    dict(top='#b4cfd3', bot='#f3f0de', sun='#fffbe8', far='#a9c0b3', mid='#7f9f8e', near='#4a6b5a', water1='#cfe0e0', water2='#8fb0b8'),
    dict(top='#8fb1a6', bot='#ece9d6', sun='#fffde8', far='#9db7a8', mid='#6f9080', near='#3a5a49', water1='#bfd6d2', water2='#6f98a6')],
}

def f(n): return f"{n:.1f}"

def wrap_svg(body, p, night=False, rnd=None):
    defs = (
      '<defs>'
      f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{p["top"]}"/><stop offset="1" stop-color="{p["bot"]}"/></linearGradient>'
      f'<radialGradient id="glow"><stop offset="0" stop-color="{p["sun"]}" stop-opacity=".85"/><stop offset="1" stop-color="{p["sun"]}" stop-opacity="0"/></radialGradient>'
      f'<linearGradient id="wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{p["water1"]}"/><stop offset="1" stop-color="{p["water2"]}"/></linearGradient>'
      '</defs>')
    stars = ''
    if night and rnd:
        stars = ''.join(f'<circle cx="{f(rnd.uniform(0,W))}" cy="{f(rnd.uniform(0,330))}" r="{f(rnd.uniform(0.8,2.2))}" fill="#fff" opacity="{f(rnd.uniform(.4,.9))}"/>' for _ in range(70))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">'
            f'{defs}<rect width="{W}" height="{H}" fill="url(#sky)"/>{stars}{body}</svg>')

def sun(x, y, r, p):
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r*3.2)}" fill="url(#glow)"/><circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{p["sun"]}"/>'

def hills(color, base, amp, rnd, n=6, opacity=1):
    xs = [i * W / n for i in range(n + 1)]
    ys = [base - rnd.uniform(0, amp) for _ in xs]
    d = f'M0,{H} L0,{f(ys[0])} '
    for i in range(1, n + 1):
        dx = xs[i] - xs[i - 1]
        d += f'C{f(xs[i-1]+dx/2)},{f(ys[i-1])} {f(xs[i]-dx/2)},{f(ys[i])} {f(xs[i])},{f(ys[i])} '
    d += f'L{W},{H} Z'
    return f'<path d="{d}" fill="{color}" opacity="{opacity}"/>'

def peaks(color, base, amp, rnd, n=7):
    pts = [(0, H)]
    for i in range(n + 1):
        x = i * W / n
        pts.append((x, base - (amp if i % 2 else rnd.uniform(0, amp * .35)) * rnd.uniform(.7, 1)))
    pts.append((W, H))
    return f'<polygon points="{" ".join(f"{f(x)},{f(y)}" for x, y in pts)}" fill="{color}"/>'

def water(y, sx, p, rnd):
    s = f'<rect y="{y}" width="{W}" height="{H-y}" fill="url(#wat)"/>'
    for i in range(7):
        w = 260 - i * 32
        s += f'<rect x="{f(sx-w/2)}" y="{y+8+i*18}" width="{w}" height="5" rx="2.5" fill="{p["sun"]}" opacity="{f(.5-i*.06)}"/>'
    for _ in range(26):
        x, yy = rnd.uniform(0, W), rnd.uniform(y + 20, H - 10)
        s += f'<rect x="{f(x)}" y="{f(yy)}" width="{f(rnd.uniform(20,70))}" height="2" fill="{p["sun"]}" opacity=".18"/>'
    return s

def palm(x, y, h, color, rnd):
    lean = rnd.uniform(-35, 35)
    tx, ty = x + lean, y - h
    s = f'<path d="M{f(x)},{f(y)} Q{f(x+lean*1.6)},{f(y-h*.55)} {f(tx)},{f(ty)}" stroke="{color}" stroke-width="{f(max(6,h/22))}" fill="none" stroke-linecap="round"/>'
    L = h * .55
    for ang in (-170, -140, -110, -80, -50, -20, 10, 165):
        a = math.radians(ang)
        dx, dy = L * math.cos(a), L * math.sin(a)
        s += (f'<path d="M{f(tx)},{f(ty)} Q{f(tx+dx*.5)},{f(ty+dy*.5-L*.35)} {f(tx+dx)},{f(ty+dy+L*.28)}" '
              f'stroke="{color}" stroke-width="{f(max(5,h/26))}" fill="none" stroke-linecap="round"/>')
    return s

def column(x, y, w, h, color):
    return (f'<rect x="{f(x)}" y="{f(y-h)}" width="{f(w)}" height="{f(h)}" fill="{color}"/>'
            f'<rect x="{f(x-w*.25)}" y="{f(y-h-14)}" width="{f(w*1.5)}" height="16" fill="{color}"/>'
            f'<rect x="{f(x-w*.2)}" y="{f(y-8)}" width="{f(w*1.4)}" height="10" fill="{color}"/>')

def felucca(x, y, s, color, sail):
    return (f'<path d="M{f(x-70*s)},{f(y)} Q{f(x)},{f(y+34*s)} {f(x+80*s)},{f(y)} L{f(x+60*s)},{f(y-16*s)} L{f(x-54*s)},{f(y-16*s)} Z" fill="{color}"/>'
            f'<line x1="{f(x)}" y1="{f(y-16*s)}" x2="{f(x-6*s)}" y2="{f(y-190*s)}" stroke="{color}" stroke-width="{f(4*s)}"/>'
            f'<path d="M{f(x-6*s)},{f(y-186*s)} L{f(x+125*s)},{f(y-34*s)} L{f(x+2*s)},{f(y-30*s)} Z" fill="{sail}"/>')

def birds(rnd, n, ymin, ymax, color):
    s = ''
    for _ in range(n):
        x, y, k = rnd.uniform(80, W - 80), rnd.uniform(ymin, ymax), rnd.uniform(.7, 1.5)
        s += f'<path d="M{f(x)},{f(y)} q{f(9*k)},{f(-9*k)} {f(18*k)},0 q{f(9*k)},{f(-9*k)} {f(18*k)},0" stroke="{color}" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    return s

def reeds(x0, x1, rnd, color):
    s = ''
    for _ in range(45):
        x = rnd.uniform(x0, x1); h = rnd.uniform(90, 230); b = H + 5
        s += f'<path d="M{f(x)},{b} Q{f(x+rnd.uniform(-25,25))},{f(b-h*.6)} {f(x+rnd.uniform(-40,40))},{f(b-h)}" stroke="{color}" stroke-width="3" fill="none" stroke-linecap="round"/>'
    return s

# ---------------- scenes ----------------
def scene_sea(p, rnd, v, palms=False):
    hor = 440; sx = rnd.uniform(380, 820)
    b = sun(sx, hor - 70, 46, p)
    for i in range(16):  # far skyline
        w = rnd.uniform(30, 70); h = rnd.uniform(18, 70); x = i * 78 + rnd.uniform(-10, 10)
        if x < 520 or v: b += f'<rect x="{f(x)}" y="{f(hor-h)}" width="{f(w)}" height="{f(h)}" fill="{p["far"]}" opacity=".8"/>'
    b += water(hor, sx, p, rnd)
    b += f'<rect y="650" width="{W}" height="100" fill="{p["near"]}"/>'
    for i in range(7):
        x = 90 + i * 180
        b += f'<line x1="{x}" y1="650" x2="{x}" y2="585" stroke="{p["near"]}" stroke-width="6"/><circle cx="{x}" cy="580" r="26" fill="url(#glow)"/><circle cx="{x}" cy="580" r="7" fill="{p["sun"]}"/>'
    if palms or v:
        b += palm(1010, 650, 330, p['near'], rnd) + palm(120, 650, 260, p['near'], rnd)
    return b

def scene_fortress(p, rnd, v):
    hor = 470; sx = rnd.uniform(220, 480)
    b = sun(sx, hor - 90, 44, p) + water(hor, sx, p, rnd)
    b += f'<path d="M520,{H} L560,560 L1180,560 L1200,{H} Z" fill="{p["near"]}"/>'
    b += f'<rect x="620" y="400" width="500" height="170" fill="{p["mid"]}"/><rect x="900" y="300" width="150" height="110" fill="{p["mid"]}"/><rect x="620" y="360" width="90" height="50" fill="{p["mid"]}"/>'
    for x in range(620, 1120, 36): b += f'<rect x="{x}" y="382" width="22" height="20" fill="{p["mid"]}"/>'
    for x in range(900, 1050, 32): b += f'<rect x="{x}" y="282" width="20" height="20" fill="{p["mid"]}"/>'
    b += f'<rect x="965" y="340" width="20" height="40" rx="10" fill="{p["bot"]}" opacity=".8"/>'
    b += f'<rect y="680" width="{W}" height="70" fill="{p["near"]}" opacity=".9"/>'
    return b

def scene_library(p, rnd, v):
    hor = 450; sx = rnd.uniform(250, 450)
    b = sun(sx, hor - 80, 44, p) + water(hor, sx, p, rnd)
    b += f'<rect x="360" y="505" width="560" height="120" fill="{p["mid"]}"/>'
    b += f'<ellipse cx="640" cy="500" rx="330" ry="72" transform="rotate(-9 640 500)" fill="{p["near"]}"/>'
    b += f'<ellipse cx="640" cy="492" rx="300" ry="58" transform="rotate(-9 640 492)" fill="{p["far"]}" opacity=".55"/>'
    for i in range(10): b += f'<rect x="{390+i*52}" y="540" width="14" height="70" fill="{p["bot"]}" opacity=".35"/>'
    b += f'<rect y="665" width="{W}" height="90" fill="{p["near"]}"/>'
    return b

def scene_oasis(p, rnd, v):
    b = sun(rnd.uniform(300, 900), 250, 52, p)
    b += hills(p['far'], 430, 70, rnd) + hills(p['mid'], 500, 60, rnd)
    b += f'<ellipse cx="600" cy="560" rx="430" ry="74" fill="url(#wat)"/><ellipse cx="560" cy="548" rx="300" ry="20" fill="{p["sun"]}" opacity=".25"/>'
    b += hills(p['near'], 690, 60, rnd, 5)
    for x, h in ((140, 300), (260, 220), (980, 320), (1090, 240), (860, 190)): b += palm(x, 620 + rnd.uniform(-10, 20), h, p['near'], rnd)
    return b

def scene_whitedesert(p, rnd, v):
    b = sun(rnd.uniform(250, 950), 210, 60, p)
    b += hills(p['far'], 470, 40, rnd) + hills(p['mid'], 540, 40, rnd, 5) + hills(p['near'], 700, 40, rnd, 4)
    light, shade = ('#f6efde', '#d8cdb4') if not v else ('#d9cfd9', '#8f84a0')
    for i in range(8):
        x = 80 + i * 150 + rnd.uniform(-30, 30); y = rnd.uniform(560, 680); s = rnd.uniform(.6, 1.6)
        b += (f'<path d="M{f(x-40*s)},{f(y)} L{f(x-22*s)},{f(y-70*s)} Q{f(x-70*s)},{f(y-80*s)} {f(x-48*s)},{f(y-125*s)} Q{f(x)},{f(y-160*s)} {f(x+50*s)},{f(y-122*s)} Q{f(x+70*s)},{f(y-80*s)} {f(x+24*s)},{f(y-70*s)} L{f(x+42*s)},{f(y)} Z" fill="{light}"/>'
              f'<path d="M{f(x+8*s)},{f(y)} L{f(x+14*s)},{f(y-70*s)} Q{f(x+66*s)},{f(y-84*s)} {f(x+46*s)},{f(y-122*s)} L{f(x+50*s)},{f(y-120*s)} Q{f(x+70*s)},{f(y-80*s)} {f(x+24*s)},{f(y-70*s)} L{f(x+42*s)},{f(y)} Z" fill="{shade}" opacity=".7"/>')
    return b

def scene_mountain(p, rnd, v):
    b = sun(rnd.uniform(450, 750), 330, 50, p)
    b += peaks(p['far'], 420, 250, rnd, 8) + peaks(p['mid'], 520, 230, rnd, 6) + peaks(p['near'], 640, 200, rnd, 5)
    b += f'<path d="M120,{H} L330,600 L420,560 L520,520 L610,470" stroke="{p["sun"]}" stroke-width="3" stroke-dasharray="8 10" fill="none" opacity=".6"/>'
    return b

def scene_whales(p, rnd, v):
    b = sun(rnd.uniform(300, 900), 230, 55, p)
    b += hills(p['far'], 440, 60, rnd) + hills(p['mid'], 540, 60, rnd, 5) + hills(p['near'], 690, 50, rnd, 4)
    bone = '#f3ead6'
    b += f'<path d="M180,610 Q480,570 760,620 T1050,600" stroke="{bone}" stroke-width="9" fill="none" stroke-linecap="round"/>'
    for i in range(9):
        x = 270 + i * 70; yy = 600 + (math.sin(i / 1.5) * 8)
        b += f'<path d="M{x},{f(yy-4)} q{f(-12-i*1.5)},{f(40+i*1.2)} {f(-34)},{f(66)}" stroke="{bone}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    b += f'<ellipse cx="1090" cy="598" rx="64" ry="30" fill="{bone}"/><circle cx="1110" cy="590" r="6" fill="{p["near"]}"/>'
    return b

def temple_group(p, kind):
    c = p['near']
    if kind == 'pylon':
        g = f'<polygon points="330,520 370,300 500,300 540,520" fill="{c}"/><polygon points="660,520 700,300 830,300 870,520" fill="{c}"/><rect x="530" y="400" width="140" height="120" fill="{c}"/>'
        for i in range(6): g += column(555 + i * 20, 520, 10, 100, p['mid'])
        g += f'<rect x="300" y="505" width="600" height="25" fill="{c}"/>'
    else:
        g = f'<rect x="160" y="305" width="880" height="26" fill="{c}"/>'
        for i in range(9): g += column(190 + i * 100, 520, 38, 190, c)
        g += f'<rect x="120" y="515" width="960" height="20" fill="{c}"/>'
    return g

def scene_temple(p, rnd, v, kind='pylon'):
    hor = 520
    b = sun(rnd.uniform(150, 1050), 200, 40, p) + f'<rect y="{hor}" width="{W}" height="{H-hor}" fill="url(#wat)"/>'
    g = temple_group(p, kind)
    if kind == 'columns':
        b += f'<rect x="140" y="320" width="920" height="200" fill="{p["sun"]}" opacity=".18"/>'
    b += g + f'<g transform="translate(0,{hor*2}) scale(1,-1)" opacity=".28">{g}</g>'
    b += palm(80, hor + 4, 260, p['near'], rnd) + palm(1130, hor + 4, 300, p['near'], rnd)
    b += f'<rect y="{hor}" width="{W}" height="6" fill="{p["sun"]}" opacity=".35"/>'
    return b

def scene_island(p, rnd, v):
    hor = 470; sx = rnd.uniform(400, 800)
    b = sun(sx, hor - 60, 50, p) + water(hor, sx, p, rnd)
    b += f'<path d="M250,{hor+10} Q450,{hor-90} 700,{hor-60} Q900,{hor-40} 980,{hor+10} Z" fill="{p["far"]}"/>'
    for i, x in enumerate((360, 470, 590, 720, 840)):
        b += f'<rect x="{x}" y="{hor-38-i%2*8}" width="44" height="34" fill="{p["near"]}" opacity=".85"/>'
    for x, h in ((330, 190), (520, 150), (790, 210), (930, 150)): b += palm(x, hor, h, p['near'], rnd)
    b += felucca(rnd.uniform(430, 760), 640, 1.35, p['near'], p['bot'])
    return b

def scene_lake(p, rnd, v, dunes=70, reeds_on=True, bird_count=7):
    hor = 430
    b = sun(rnd.uniform(300, 900), 250, 48, p)
    b += hills(p['far'], hor, dunes, rnd) + hills(p['mid'], hor + 25, dunes * .5, rnd, 5)
    b += f'<rect y="{hor+20}" width="{W}" height="{H-hor-20}" fill="url(#wat)"/>'
    for i in range(10): b += f'<rect x="{f(rnd.uniform(0,W-200))}" y="{f(hor+50+i*28)}" width="{f(rnd.uniform(80,240))}" height="3" fill="{p["sun"]}" opacity=".3"/>'
    if reeds_on: b += reeds(0, 330, rnd, p['near']) + reeds(900, W, rnd, p['near'])
    b += birds(rnd, bird_count, 120, 320, p['near'])
    return b

def scene_coast(p, rnd, v):
    hor = 460; sx = rnd.uniform(450, 800)
    b = sun(sx, hor - 120, 44, p) + peaks(p['far'], hor, 220, rnd, 8) + peaks(p['mid'], hor + 10, 120, rnd, 6)
    b += water(hor + 10, sx, p, rnd)
    for i, x in enumerate((140, 300, 460)):
        b += f'<polygon points="{x},640 {x+60},590 {x+120},640" fill="{p["near"]}"/><rect x="{x+58}" y="640" width="4" height="40" fill="{p["near"]}"/>'
    b += f'<rect y="690" width="{W}" height="60" fill="{p["near"]}"/>'
    return b

SCENES = {
  'alexandria-corniche': lambda p, r, v: scene_sea(p, r, v),
  'montaza-gardens': lambda p, r, v: scene_sea(p, r, v, palms=True),
  'qaitbay-citadel': scene_fortress,
  'bibliotheca-alexandrina': scene_library,
  'siwa-oasis': scene_oasis,
  'white-desert': scene_whitedesert,
  'mount-sinai': scene_mountain,
  'wadi-el-hitan': scene_whales,
  'philae-temple': lambda p, r, v: scene_temple(p, r, v, 'pylon'),
  'luxor-temple': lambda p, r, v: scene_temple(p, r, v, 'columns'),
  'elephantine-island': scene_island,
  'dahab': scene_coast,
  'wadi-el-rayan': lambda p, r, v: scene_lake(p, r, v, dunes=130, reeds_on=False, bird_count=4),
  'lake-qarun': lambda p, r, v: scene_lake(p, r, v, dunes=40, reeds_on=True, bird_count=9),
}
MOOD_SCENE = {'nostalgic': scene_sea, 'adventurous': scene_whitedesert, 'romantic': scene_island, 'calm': scene_lake}

def poster(movie, mood):
    p = PAL[mood][0]; rnd = random.Random(movie['id'])
    import textwrap
    lines = textwrap.wrap(movie['title'], 15)
    body = hills(p['mid'], 640, 80, rnd, 5) + hills(p['near'], 740, 60, rnd, 4)
    t = ''
    y = 330 - (len(lines) - 1) * 36
    for ln in lines:
        t += f'<text x="300" y="{y}" text-anchor="middle" font-family="Georgia, \'Times New Roman\', serif" font-size="54" font-weight="700" fill="#fff">{html.escape(ln)}</text>'; y += 68
    if movie.get('arabicTitle'):
        t += f'<text x="300" y="{y+10}" text-anchor="middle" direction="rtl" font-family="Tahoma, Arial, sans-serif" font-size="38" fill="{p["sun"]}">{html.escape(movie["arabicTitle"])}</text>'
    t += f'<text x="300" y="800" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#fff">{movie["year"]}</text>'
    t += f'<text x="300" y="840" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#fff" opacity=".9">{html.escape(movie["director"])}</text>'
    frame = '<rect x="22" y="22" width="556" height="856" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>'
    defs = (f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{p["top"]}"/><stop offset="1" stop-color="{p["bot"]}"/></linearGradient>'
            '<linearGradient id="dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient></defs>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">{defs}'
            f'<rect width="600" height="900" fill="url(#sky)"/>'
            f'<svg x="0" y="0" width="600" height="900" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">{body}</svg>'
            f'<rect width="600" height="900" fill="url(#dark)"/>{t}{frame}</svg>')

def write(path, s):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(s)

def main():
    moods = json.load(open('src/data/moods.json', encoding='utf-8'))
    places = json.load(open('src/data/places.json', encoding='utf-8'))
    movies = json.load(open('src/data/movies.json', encoding='utf-8'))
    for m in moods:
        rnd = random.Random('hero-' + m['id'])
        write(f"public/images/moods/{m['id']}.svg", wrap_svg(MOOD_SCENE[m['id']](PAL[m['id']][0], rnd, 0), PAL[m['id']][0]))
    for pl in places:
        mood = pl['moodIds'][0]
        for v in (0, 1):
            pal = PAL[mood][v]; rnd = random.Random(f"{pl['id']}-{v}")
            write(f"public/images/places/{pl['id']}-{v+1}.svg", wrap_svg(SCENES[pl['id']](pal, rnd, v), pal, night=(v == 1 and mood in ('adventurous', 'romantic')), rnd=rnd))
    mm = {'alexandria-why': 'nostalgic', 'the-mummy-1999': 'adventurous', 'nahr-el-hob': 'romantic', 'al-mummia': 'calm'}
    for mv in movies:
        write(f"public/images/posters/{mv['id']}.svg", poster(mv, mm[mv['id']]))
    print('generated', len(moods), 'mood,', len(places) * 2, 'place,', len(movies), 'poster images')

if __name__ == '__main__':
    main()
