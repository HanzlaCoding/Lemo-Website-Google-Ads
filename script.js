// Form Submission Handler
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');

            if (!validateForm()) return;

            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending…';

            const formData = new FormData(bookingForm);

            fetch('https://formsubmit.co/41757e77266e7223e0b126c967d36688', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                trackGoogleAdsConversion();
                alert('✅ Your quote request has been sent! We will contact you shortly.');
                bookingForm.reset();
            })
            .catch(err => {
                console.error('Submit Error:', err);
                alert('Your request may have been sent. If urgent, please call us at 0301-1954994.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            });
        });
    }

    // Book-This buttons — scroll to form
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('quoteForm').scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Validation
function validateForm() {
    const pickup  = document.getElementById('pickupAddress').value.trim();
    const dropoff = document.getElementById('dropoffAddress').value.trim();
    const pass    = document.getElementById('passengers').value;

    if (pickup.length < 3) {
        alert('Please enter a valid pickup location.');
        document.getElementById('pickupAddress').focus();
        return false;
    }
    if (dropoff.length < 3) {
        alert('Please enter a valid drop-off location.');
        document.getElementById('dropoffAddress').focus();
        return false;
    }
    if (!pass || Number(pass) < 1) {
        alert('Please enter the number of passengers.');
        document.getElementById('passengers').focus();
        return false;
    }
    return true;
}

// Google Ads Conversion Tracking Hook
function trackGoogleAdsConversion() {
    console.log('Google Ads Conversion Triggered');
    // Uncomment and fill in your conversion info:
    // if (typeof gtag === 'function') {
    //     gtag('event', 'conversion', {
    //         'send_to': 'AW-CONVERSION_ID/LABEL',
    //         'value': 1.0,
    //         'currency': 'USD'
    //     });
    // }
}
