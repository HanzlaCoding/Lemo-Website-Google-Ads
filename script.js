document.addEventListener('DOMContentLoaded', () => {
    // Basic Form Validation & Submission Hook
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                // Simulate form submission
                const submitBtn = bookingForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerText;
                
                submitBtn.disabled = true;
                submitBtn.innerText = 'Calculating Quote...';

                // Simulate network delay
                setTimeout(() => {
                    // Google Ads Conversion Hook
                    trackGoogleAdsConversion();
                    
                    alert('Thank you! Your quote request has been sent. We will contact you shortly.');
                    bookingForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }, 1500);
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

// Google Maps Autocomplete Hook
// This function is called by the Google Maps API script callback
function initAutocomplete() {
    const pickupInput = document.getElementById('pickupAddress');
    const dropoffInput = document.getElementById('dropoffAddress');

    if (pickupInput && window.google) {
        new google.maps.places.Autocomplete(pickupInput, {
            types: ['geocode', 'establishment'],
            // Restrict to specific region if needed, e.g., Detroit
             componentRestrictions: { country: "us" }
        });
    }

    if (dropoffInput && window.google) {
        new google.maps.places.Autocomplete(dropoffInput, {
             types: ['geocode', 'establishment'],
             componentRestrictions: { country: "us" }
        });
    }
}

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
