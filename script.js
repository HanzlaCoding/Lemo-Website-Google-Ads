/**
 * Premium Limo Service - Optimized Scripts
 * Handles Google Maps, Form Interaction, and Conversion Tracking
 */

/* --- Conversion Tracking --- */
function trackConversion() {
    console.log("Conversion tracked: Get Quote Button Clicked");
    // Placeholder for Google Ads conversion tag
    // gtag('event', 'conversion', { 'send_to': 'AW-CONVERSION-ID/LABEL' });
}

/* --- Smooth Scrolling --- */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Attach conversion tracking to form button
    const quoteBtn = document.querySelector('button[type="submit"]');
    if (quoteBtn) {
        quoteBtn.addEventListener('click', trackConversion);
    }
});

/* --- Google Maps Integration --- */
async function initMap() {
    console.log("Initializing map...");

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Clear placeholder
    mapContainer.innerHTML = '';

    const center = { lat: 40.7128, lng: -74.0060 }; // New York Metro Area

    // Premium Dark Theme JSON
    const darkMapStyle = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
    ];

    try {
        const map = new google.maps.Map(mapContainer, {
            center: center,
            zoom: 12,
            styles: darkMapStyle,
            disableDefaultUI: true,
            zoomControl: true,
            backgroundColor: '#0a0a0a',
        });

        // Initialize Places Autocomplete
        const pickupInput = document.getElementById('pickup');
        const dropoffInput = document.getElementById('dropoff');
        const options = { fields: ["formatted_address", "geometry", "name"], strictBounds: false };

        if (pickupInput) {
            new google.maps.places.Autocomplete(pickupInput, options);
        }
        if (dropoffInput) {
            new google.maps.places.Autocomplete(dropoffInput, options);
        }

        // Hide overlay on interaction
        const overlay = document.querySelector('.map-overlay-btn');
        const hideOverlay = () => {
            if (overlay) overlay.classList.add('fade-out');
        };

        // Listen for map interactions
        map.addListener('mousedown', hideOverlay);
        map.addListener('dragstart', hideOverlay);
        map.addListener('zoom_changed', hideOverlay);

        // Also allow clicking the map container itself to hide it (in case events bubble)
        mapContainer.addEventListener('mousedown', hideOverlay);
        mapContainer.addEventListener('touchstart', hideOverlay);

    } catch (error) {
        console.error("Google Maps Error:", error);
    }
}

// Make initMap globally available for the callback
window.initMap = initMap;

// Global handler for Google Maps Auth/Billing errors
window.gm_authFailure = function () {
    console.error("Google Maps Authentication/Billing Failure");
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Keep the static fallback image that is already in HTML, or ensure it's visible.
        // Since we refactored HTML to have the image by default, we just need to make sure we don't clear it if auth fails.
        // But initMap clears it first thing. So if auth fails, we put it back?
        // Actually, gm_authFailure might trigger AFTER initMap clears it?
        // If initMap runs, it clears innerHTML.
        // So we should put it back here.
        mapContainer.innerHTML = `
            <img src="assets/service-map.webp" 
                 alt="Service Coverage Map" 
                 style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 80%;">
                <p class="text-gold uppercase tracking-widest" style="background: rgba(0,0,0,0.8); padding: 1rem;">
                    Service Map Unavailable<br><span style="font-size: 0.7em; color: #fff;">(Check Google Cloud Billing)</span>
                </p>
            </div>
        `;
        // Ensure overlay can still hide if needed (though static map doesn't interact)
        const overlay = document.querySelector('.map-overlay-btn');
        if (overlay) {
            // Optional: hide the "Service Coverage Map" button since we are showing an error/static map
            // or keep it. I'll keep it as the static image is still a "map".
        }
    }
};

// Dynamic Script Loading for Performance (Fixes NO_FCP)
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBx6MNny-YHWTeLsZYdbh0_SMiWi0-QetQ&libraries=places&callback=initMap&loading=async";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

// Load Maps after main content is parsed and painted (delayed)
if (document.readyState === 'complete') {
    setTimeout(loadGoogleMaps, 2500);
} else {
    window.addEventListener('load', () => setTimeout(loadGoogleMaps, 2500));
}
