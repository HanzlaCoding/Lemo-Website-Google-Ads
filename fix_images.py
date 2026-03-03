import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix Services Wrappers
html = re.sub(
    r'<div class="service-img-wrapper"[^>]*>',
    r'<div class="service-img-wrapper">',
    html
)

# Fix Services Images
html = re.sub(
    r'<img src="([^"]+)"\s*alt="([^"]*)"\s*loading="lazy"\s*style="([^"]+)">',
    r'<img src="\1" alt="\2" loading="lazy">',
    html
)

# Fix Fleet Wrappers
html = re.sub(
    r'<div class="fleet-img-wrapper"[^>]*>',
    r'<div class="fleet-img-wrapper">',
    html
)

# Fix Fleet Images
html = re.sub(
    r'<img src="([^"]+)"\s*alt="([^"]*)"\s*loading="lazy"\s*class="fleet-img"\s*style="([^"]+)">',
    r'<img src="\1" alt="\2" loading="lazy" class="fleet-img">',
    html
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
