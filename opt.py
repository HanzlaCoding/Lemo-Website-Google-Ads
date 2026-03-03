import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Preload hero
preload = '<link rel="preload" as="image" href="https://van.peterstransit.com/wp-content/uploads/2026/01/Brown_Leather_Interior_Of_A_Limo.webp">'
if preload not in html:
    html = html.replace('</head>', f'    {preload}\n</head>')

# Scripts: Google Maps
html = re.sub(r'<script\s+src="https://maps.googleapis.com', r'<script async defer src="https://maps.googleapis.com', html)

# Make sure script.js has defer
if 'defer src="script.js"' not in html:
    html = html.replace('src="script.js"', 'defer src="script.js"')

# Forms Accessibility
html = html.replace('placeholder="Full Name"', 'placeholder="Full Name" aria-label="Full Name"')
html = html.replace('placeholder="Phone Number"', 'placeholder="Phone Number" aria-label="Phone Number"')
html = html.replace('placeholder="Email Address"', 'placeholder="Email Address" aria-label="Email Address"')
html = html.replace('placeholder="Passengers"', 'placeholder="Passengers" aria-label="Number of Passengers"')
html = html.replace('type="date"', 'type="date" aria-label="Pickup Date"')
html = html.replace('type="time"', 'type="time" aria-label="Pickup Time"')
html = html.replace('placeholder="Pickup Address"', 'placeholder="Pickup Address" aria-label="Pickup Address"')
html = html.replace('placeholder="Drop-off Address"', 'placeholder="Drop-off Address" aria-label="Drop-off Address"')
html = html.replace('<select id="vehicle" required>', '<select id="vehicle" required aria-label="Select Vehicle">')
html = html.replace('<select id="tripType" required>', '<select id="tripType" required aria-label="Trip Type">')
html = html.replace('<button type="submit" class="submit-btn" id="submitBtn">', '<button type="submit" class="submit-btn" id="submitBtn" aria-label="Get Instant Quote">')

# More Buttons
html = re.sub(r'(<a href="https://wa.me/[^"]+" class="floating-cta")', r'\1 aria-label="Chat with us on WhatsApp"', html)
html = re.sub(r'(<button class="book-btn"[^>]*?)>', r'\1 aria-label="Book This Vehicle">', html)

# Images lazy loading, dims, and better alts
# Avatars
html = re.sub(r'class="review-avatar"(\s*)>', r'class="review-avatar" loading="lazy" width="48" height="48">', html)
# Fleet images
html = re.sub(r'alt="([^"]+)" loading="lazy" class="fleet-img"', r'alt="\1 Luxury Vehicle" loading="lazy" width="800" height="450" class="fleet-img"', html)
# Service images 
html = re.sub(r'(<div class="service-img-wrapper">\s*)<img src="([^"]+)" alt="([^"]+)">', r'\1<img src="\2" alt="\3 Service - Luxury Vehicle" loading="lazy" width="800" height="450">', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
# 2. Minify style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Minify process
css = re.sub(r'/\*[\s\S]*?\*/', '', css)
css = css.replace('\n', '').replace('\r', '').replace('\t', '')
css = re.sub(r'\s+', ' ', css)
css = re.sub(r'\s*{\s*', '{', css)
css = re.sub(r'\s*}\s*', '}', css)
css = re.sub(r'\s*;\s*', ';', css)
css = re.sub(r'\s*:\s*', ':', css)
css = re.sub(r'\s*,\s*', ',', css)
css = css.strip()

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Optimization complete!")
