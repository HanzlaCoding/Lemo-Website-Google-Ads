/**
 * reviews.js — Seamless Infinite Carousel (3-up clone technique)
 * ───────────────────────────────────────────────────────────────
 * Real infinite loop: clones first/last CARDS_VISIBLE slides at both
 * ends of the track. When the track slides into a clone zone, it
 * instantly resets to the matching real slide — fully seamless.
 */

(function () {
  'use strict';

  /* ─── Config ──────────────────────────────────────────────── */
  var BUSINESS_QUERY = 'Rush Hour Limo Marietta GA';
  var CARDS_VISIBLE  = 3;

  /* ─── Fallback review pool ────────────────────────────────── */
  var FALLBACK = [
    { author_name: 'Jessica M.',  rating: 5, profile_photo_url: null,
      text: 'Absolutely outstanding service! The driver arrived early, the vehicle was immaculate, and the entire experience felt truly first class. Will book again!',
      relative_time_description: '2 weeks ago' },
    { author_name: 'David R.',    rating: 5, profile_photo_url: null,
      text: 'Rush Hour Limo exceeded every expectation. Professional, punctual, and the ride was incredibly smooth. Best limo service in Atlanta by far.',
      relative_time_description: '1 month ago' },
    { author_name: 'Amanda K.',   rating: 5, profile_photo_url: null,
      text: 'Used them for our wedding and it was flawless. The chauffeur was courteous and the sprinter was stunning inside. Couldn\'t have asked for better service!',
      relative_time_description: '3 months ago' },
    { author_name: 'Marcus T.',   rating: 5, profile_photo_url: null,
      text: 'Top-notch experience from booking to drop-off. The Mercedes Sprinter was spotless and our driver was incredibly professional. Highly recommend!',
      relative_time_description: '2 months ago' },
    { author_name: 'Sara L.',     rating: 5, profile_photo_url: null,
      text: 'I\'ve used many limo services and Rush Hour Limo is hands-down the best. On time, polished, car was pristine. Will book again without hesitation.',
      relative_time_description: '6 weeks ago' },
    { author_name: 'James P.',    rating: 5, profile_photo_url: null,
      text: 'Booked for a corporate airport run and the driver was 15 min early. Car was spotless, ride was silent and smooth. Our executives were impressed.',
      relative_time_description: '5 weeks ago' },
    { author_name: 'Linda H.',    rating: 5, profile_photo_url: null,
      text: 'Rush Hour Limo made our anniversary night so special. The interior was beautifully set up, driver polite, and the whole experience was just magical.',
      relative_time_description: '7 weeks ago' },
    { author_name: 'Carlos V.',   rating: 5, profile_photo_url: null,
      text: 'Used for a bachelorette party and everything was perfect. The Sprinter was luxurious, driver professional and fun — everyone had the time of their lives!',
      relative_time_description: '2 months ago' },
    { author_name: 'Patricia N.', rating: 5, profile_photo_url: null,
      text: 'Exceptional from start to finish. Easy booking, transparent pricing, and a true professional driver. 10/10 would recommend Rush Hour Limo!',
      relative_time_description: '3 months ago' },
    { author_name: 'Kevin B.',    rating: 5, profile_photo_url: null,
      text: 'Best limo experience in Atlanta. Clean, on-time, professional, fair pricing. Our group of 12 were all impressed — we\'ll definitely be back.',
      relative_time_description: '4 months ago' }
  ];

  /* ─── Carousel state ──────────────────────────────────────── */
  var realCount  = 0;   /* number of real (non-clone) slides */
  var vIndex     = 0;   /* virtual index including clone zones */
  var slideW     = 0;   /* px width of one slide */
  var isJumping  = false;

  /* ─── Entry point ─────────────────────────────────────────── */
  window.loadRushHourReviews = function () {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolvePlaceId();
    } else {
      buildCarousel(FALLBACK);
    }
  };

  /* ─── Step 1: find place ──────────────────────────────────── */
  function resolvePlaceId() {
    var svc = new google.maps.places.PlacesService(document.createElement('div'));
    svc.findPlaceFromQuery({ query: BUSINESS_QUERY, fields: ['place_id'] },
      function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0])
          fetchReviews(svc, results[0].place_id);
        else
          buildCarousel(FALLBACK);
      });
  }

  /* ─── Step 2: fetch details ───────────────────────────────── */
  function fetchReviews(svc, placeId) {
    svc.getDetails({ placeId: placeId, fields: ['reviews', 'rating', 'user_ratings_total'] },
      function (place, status) {
        var live = [];
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
          live = place.reviews.filter(function (r) { return r.rating === 5; });
          updateStats(place.rating, place.user_ratings_total);
        }
        /* merge: live first, then fallback entries not already present */
        var seen = {};
        live.forEach(function (r) { seen[r.author_name] = true; });
        var extras = FALLBACK.filter(function (r) { return !seen[r.author_name]; });
        buildCarousel(live.concat(extras).length ? live.concat(extras) : FALLBACK);
      });
  }

  /* ─── Build track with clones at both ends ────────────────── */
  function buildCarousel(reviews) {
    var container = document.getElementById('live-reviews-container');
    if (!container) return;

    realCount = reviews.length;
    container.innerHTML = '<div class="reviews-track" id="reviews-track"></div>';
    var track = document.getElementById('reviews-track');

    /* Append all real slides */
    reviews.forEach(function (r) { track.appendChild(makeSlide(r)); });

    /* Clone first CARDS_VISIBLE at the END */
    var origSlides = Array.prototype.slice.call(track.children);
    for (var i = 0; i < CARDS_VISIBLE && i < origSlides.length; i++) {
      track.appendChild(origSlides[i].cloneNode(true));
    }
    /* Clone last CARDS_VISIBLE at the START */
    for (var j = origSlides.length - CARDS_VISIBLE; j < origSlides.length; j++) {
      track.insertBefore(origSlides[j].cloneNode(true), track.firstChild);
    }

    /* vIndex starts at CARDS_VISIBLE (pointing to real slide 0) */
    vIndex = CARDS_VISIBLE;

    setSlideWidths(container, track);
    jumpTo(vIndex);    /* position without animation */
    initDots(reviews.length);
    initButtons();

    /* After each slide transition, silently reset if in clone zone */
    track.addEventListener('transitionend', function () {
      if (isJumping) return;
      var lastReal = CARDS_VISIBLE + realCount - 1;
      if (vIndex > lastReal) {
        jumpTo(vIndex - realCount);
      } else if (vIndex < CARDS_VISIBLE) {
        jumpTo(vIndex + realCount);
      }
    });

    window.addEventListener('resize', function () {
      setSlideWidths(container, track);
      jumpTo(vIndex);
    });
  }

  /* ─── Create one slide element ────────────────────────────── */
  function makeSlide(review) {
    var el = document.createElement('div');
    el.className = 'review-slide';
    el.innerHTML = buildCard(review);
    return el;
  }

  /* ─── Set pixel widths on all slides ─────────────────────── */
  function setSlideWidths(container, track) {
    var perView = window.innerWidth <= 768 ? 1 : CARDS_VISIBLE;
    slideW = container.offsetWidth / perView;
    var slides = track.querySelectorAll('.review-slide');
    slides.forEach(function (s) {
      s.style.minWidth = slideW + 'px';
      s.style.maxWidth = slideW + 'px';
    });
  }

  /* ─── Animated navigate ───────────────────────────────────── */
  function slideTo(idx) {
    var track = document.getElementById('reviews-track');
    if (!track || !slideW) return;
    isJumping = false;
    vIndex = idx;
    track.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)';
    track.style.transform  = 'translateX(-' + (vIndex * slideW) + 'px)';
    updateDots((vIndex - CARDS_VISIBLE + realCount) % realCount);
  }

  /* ─── Instant jump (no animation) ────────────────────────── */
  function jumpTo(idx) {
    var track = document.getElementById('reviews-track');
    if (!track || !slideW) return;
    isJumping = true;
    vIndex = idx;
    track.style.transition = 'none';
    track.style.transform  = 'translateX(-' + (vIndex * slideW) + 'px)';
    /* Force reflow then re-enable transitions */
    void track.offsetWidth;
    isJumping = false;
  }

  /* ─── Dots ────────────────────────────────────────────────── */
  function initDots(count) {
    var el = document.getElementById('carousel-dots');
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Review ' + (i + 1));
      d.dataset.idx = i;
      d.addEventListener('click', function () {
        slideTo(CARDS_VISIBLE + (+this.dataset.idx));
      });
      el.appendChild(d);
    }
  }

  function updateDots(realIdx) {
    document.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === realIdx);
    });
  }

  /* ─── Prev / Next buttons ─────────────────────────────────── */
  function initButtons() {
    var prev = document.getElementById('reviewPrev');
    var next = document.getElementById('reviewNext');
    if (prev) prev.addEventListener('click', function () { slideTo(vIndex - 1); });
    if (next) next.addEventListener('click', function () { slideTo(vIndex + 1); });
  }

  /* ─── Build one review card HTML ──────────────────────────── */
  function buildCard(review) {
    var stars = '';
    for (var s = 1; s <= 5; s++) stars += s <= review.rating ? '&#9733;' : '&#9734;';
    var name  = review.author_name || 'Anonymous';
    var init  = name.split(' ').map(function (w) { return w[0] || ''; }).join('').toUpperCase().substring(0, 2);
    var text  = review.text || '';
    var when  = review.relative_time_description || '';
    var photo = review.profile_photo_url || null;

    var avatar = photo
      ? '<img src="' + esc(photo) + '" alt="' + esc(name) + '" class="review-avatar-img"' +
        ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
        '<div class="review-avatar-fallback" style="display:none">' + esc(init) + '</div>'
      : '<div class="review-avatar-fallback">' + esc(init) + '</div>';

    return (
      '<div class="review-card">' +
        '<div class="review-quote-icon" aria-hidden="true">\u201c</div>' +
        '<div class="review-stars" aria-label="5 out of 5 stars">' + stars + '</div>' +
        '<p class="review-text">' + esc(text) + '</p>' +
        '<div class="review-card-footer">' +
          '<div style="display:flex;flex-shrink:0">' + avatar + '</div>' +
          '<div>' +
            '<div class="review-author">' + esc(name) + '</div>' +
            (when ? '<div style="font-size:.78rem;color:var(--text-secondary);margin-top:.15rem">' + esc(when) + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ─── Stats ───────────────────────────────────────────────── */
  function updateStats(rating, count) {
    var rEl = document.getElementById('live-rating');
    var cEl = document.getElementById('live-review-count');
    if (rEl && rating) rEl.textContent = parseFloat(rating).toFixed(1);
    if (cEl && count)  cEl.textContent = count + '+';
  }

  /* ─── XSS escaping ────────────────────────────────────────── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

})();
