// OpenStreetMap Autocomplete Hook (Free Alternative)
function setupAutocomplete(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    let timeoutId;

    if (!input || !list) return;

    input.addEventListener('input', function () {
        const query = this.value;

        // Clear previous timeout (debounce)
        clearTimeout(timeoutId);

        if (query.length < 3) {
            list.innerHTML = '';
            list.classList.remove('active');
            return;
        }

        // Wait 300ms after typing stops before calling API
        timeoutId = setTimeout(() => {
            fetchAddress(query, list, input);
        }, 300);
    });

    // Close list when clicking outside
    document.addEventListener('click', function (e) {
        if (e.target !== input && e.target !== list) {
            list.classList.remove('active');
        }
    });
}

function fetchAddress(query, list, input) {
    // Nominatim Search API (Free)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&addressdetails=1&limit=5`;

    fetch(url, { headers: { 'User-Agent': 'LemoLimoPage/1.0' } })
        .then(response => response.json())
        .then(data => {
            list.innerHTML = '';

            if (data.length > 0) {
                list.classList.add('active');

                data.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'suggestion-item';

                    // Icon
                    const icon = document.createElement('span');
                    icon.className = 'suggestion-icon';
                    icon.innerHTML = '📍'; // Simple pin icon

                    // Text
                    const text = document.createElement('span');
                    text.textContent = item.display_name;

                    li.appendChild(icon);
                    li.appendChild(text);

                    li.addEventListener('click', () => {
                        input.value = item.display_name;
                        list.classList.remove('active');
                    });

                    list.appendChild(li);
                });
            } else {
                list.classList.remove('active');
            }
        })
        .catch(err => console.error('Nominatim API Error:', err));
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Autocomplete
    setupAutocomplete('pickupAddress', 'pickup-suggestions');
    setupAutocomplete('dropoffAddress', 'dropoff-suggestions');

    // Basic Form Validation & Submission Hook
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                const submitBtn = bookingForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerText;

                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending Quote...';

                // Use simple FormData
                const formData = new FormData(bookingForm);

                // Use the AJAX endpoint for formsubmit.co
                fetch("https://formsubmit.co/ajax/daniel.futureofaiweb@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                })
                    .then(response => response.json())
                    .then(data => {
                        // Google Ads Conversion Hook
                        trackGoogleAdsConversion();

                        alert('Success! Your quote request has been sent. We will contact you shortly.');
                        bookingForm.reset();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Your request may have been sent, but we encountered a network issue. Please call us at (586) 474-4195 to confirm if urgent.');
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                    });
            }
        });
    }

    // Lazy load images that might have missed the attribute (though HTML has it)
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
    } else {
        // Fallback for very old browsers (optional, given constraints)
        // Dynamically import intersection observer or just load them
        lazyImages.forEach(img => {
            img.src = img.src;
        });
    }
});

// Validation Helper
function validateForm() {
    // Browser default validation takes care of required fields
    // Custom validation logic can go here
    const pickup = document.getElementById('pickupAddress').value;
    const dropoff = document.getElementById('dropoffAddress').value;

    if (pickup.length < 5 || dropoff.length < 5) {
        alert('Please enter valid addresses.');
        return false;
    }

    return true;
}

// Google Ads Conversion Tracking Hook
function trackGoogleAdsConversion() {
    console.log('Google Ads Conversion Triggered');

    // Example gtag implementation:
    // gtag('event', 'conversion', {
    //      'send_to': 'AW-CONVERSION_ID/LABEL',
    //      'value': 1.0,
    //      'currency': 'USD'
    // });
}
