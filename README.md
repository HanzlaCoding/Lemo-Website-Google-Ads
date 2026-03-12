# Luxury Limo Detroit 🚗✨

A high-performance, premium landing page for **Luxury Limo Detroit**, designed for maximum conversion and speed. This project features a modern UI, live integrations, and advanced performance optimizations.

## 🚀 Live Demo
[lemo-website-google-ads.vercel.app](https://lemo-website-google-ads.vercel.app)

---

## ✨ Key Features

- **Live Google Reviews**: Dynamically fetches 5-star reviews directly from the Google Places API for "Rush Hour Limo".
- **Custom Infinite Carousel**: A smooth, touch-responsive review slider with seamless looping and dot indicators.
- **Smart Booking Form**: Integrated with **EmailJS** for instant quote requests and **Google Places Autocomplete** for precise location selection.
- **Glassmorphism UI**: High-end aesthetic with frosted-glass effects, elegant serif typography (Playfair Display), and sleek gradients.
- **Performance Optimized**: 
  - **Service Worker (PWA-ready)**: Advanced caching with `sw.js` (limo-v9).
  - **Optimized Assets**: Uses WebP images with responsive source sets and preloading for the hero section.
  - **Lighthouse Ready**: Designed for 100/100 scores in Performance, SEO, and Best Practices.
- **Vercel Optimized**: Custom `vercel.json` configuration for strict security headers (CSP) and optimized caching policies.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern Flexbox/Grid), JavaScript (ES6+)
- **APIs & Tools**:
  - [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) (Business Details & Reviews)
  - [Google Maps JS API](https://developers.google.com/maps/documentation/javascript/overview) (Address Autocomplete)
  - [EmailJS](https://www.emailjs.com/) (Form Submission)
  - [Vercel](https://vercel.com/) (Deployment & Hosting)

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HanzlaCoding/Lemo-Website-Google-Ads.git
   ```
2. **Setup API Keys**:
   The project requires the following keys (configured in `index.html` and `reviews.js`):
   - Google Maps API Key (with Places library enabled).
   - EmailJS Service & Template IDs.
3. **Local Development**:
   Simply open `index.html` or use a local development server like **Live Server**.

---

## 🔧 Configuration

### Caching & Security
The project uses `vercel.json` to manage cache headers and a strict **Content Security Policy (CSP)**. 
- `index.html` and `sw.js` are configured with `max-age=0` to ensure users always receive the latest updates.

### Service Worker
Updates are forced by incrementing the `CACHE_NAME` in `sw.js`. Current version: `limo-v9`.

---

## 🤝 Contact & Credits

Developed by **Hanzla Coding**.

- **GitHub**: [@HanzlaCoding](https://github.com/HanzlaCoding)
- **Email**: [hanzla.coding@gmail.com](mailto:hanzla.coding@gmail.com)
- **Portfolio**: [hanzlacoding.github.io](https://hanzlacoding.github.io)
- **Phone**: [+92 301-1954994](tel:03011954994)

---

## ⚖️ License
This project is for demonstration purposes. All rights reserved.
