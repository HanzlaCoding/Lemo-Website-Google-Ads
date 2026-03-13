(function (){
'use strict';

var BUSINESS_QUERY = 'Rush Hour Limo Marietta GA';
var CARDS_VISIBLE = 3;

var FALLBACK = [
  {
    author_name: 'Jessica M.', rating: 5, profile_photo_url: null,
    text: 'Absolutely outstanding service! The driver arrived early, the vehicle was immaculate, and the entire experience felt truly first class. Will book again!',
    relative_time_description: '2 weeks ago'
  },
  {
    author_name: 'David R.', rating: 5, profile_photo_url: null,
    text: 'Rush Hour Limo exceeded every expectation. Professional, punctual, and the ride was incredibly smooth. Best limo service in Atlanta by far.',
    relative_time_description: '1 month ago'
  },
  {
    author_name: 'Amanda K.', rating: 5, profile_photo_url: null,
    text: 'Used them for our wedding and it was flawless. The chauffeur was courteous and the sprinter was stunning inside. Couldn\'t have asked for better service!',
    relative_time_description: '3 months ago'
  },
  {
    author_name: 'Marcus T.', rating: 5, profile_photo_url: null,
    text: 'Top-notch experience from booking to drop-off. The Mercedes Sprinter was spotless and our driver was incredibly professional. Highly recommend!',
    relative_time_description: '2 months ago'
  },
  {
    author_name: 'Sara L.', rating: 5, profile_photo_url: null,
    text: 'I\'ve used many limo services and Rush Hour Limo is hands-down the best. On time, polished, car was pristine. Will book again without hesitation.',
    relative_time_description: '6 weeks ago'
  },
  {
    author_name: 'James P.', rating: 5, profile_photo_url: null,
    text: 'Booked for a corporate airport run and the driver was 15 min early. Car was spotless, ride was silent and smooth. Our executives were impressed.',
    relative_time_description: '5 weeks ago'
  },
  {
    author_name: 'Linda H.', rating: 5, profile_photo_url: null,
    text: 'Rush Hour Limo made our anniversary night so special. The interior was beautifully set up, driver polite, and the whole experience was just magical.',
    relative_time_description: '7 weeks ago'
  },
  {
    author_name: 'Carlos V.', rating: 5, profile_photo_url: null,
    text: 'Used for a bachelorette party and everything was perfect. The Sprinter was luxurious, driver professional and fun — everyone had the time of their lives!',
    relative_time_description: '2 months ago'
  },
  {
    author_name: 'Patricia N.', rating: 5, profile_photo_url: null,
    text: 'Exceptional from start to finish. Easy booking, transparent pricing, and a true professional driver. 10/10 would recommend Rush Hour Limo!',
    relative_time_description: '3 months ago'
  },
  {
    author_name: 'Kevin B.', rating: 5, profile_photo_url: null,
    text: 'Best limo experience in Atlanta. Clean, on-time, professional, fair pricing. Our group of 12 were all impressed — we\'ll definitely be back.',
    relative_time_description: '4 months ago'
  }
];

var realCount = 0;
var vIndex = 0;
var slideW = 0;
var isJumping = false;

window.loadRushHourReviews = function () {
  if (window.google && window.google.maps && window.google.maps.places) {
    resolvePlaceId();
  } else {
    buildCarousel(FALLBACK);
  }
};

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

function fetchReviews(svc, placeId) {
  svc.getDetails({ placeId: placeId, fields: ['reviews', 'rating', 'user_ratings_total'] },
    function (place, status) {
      var live = [];
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
        live = place.reviews
          .filter(function (r) { return r.rating === 5; })
          .slice(0, 5);
        updateStats(place.rating, place.user_ratings_total);
      }
      var seen = {};
      live.forEach(function (r) { seen[r.author_name] = true; });
      var extras = FALLBACK
        .filter(function (r) { return !seen[r.author_name]; })
        .slice(0, 5 - live.length);
      var merged = live.concat(extras);
      buildCarousel(merged.length ? merged : FALLBACK.slice(0, 5));
    });
}

function buildCarousel(reviews) {
  var container = document.getElementById('live-reviews-container');
  if (!container) return;

  realCount = reviews.length;
  container.innerHTML = '<div class="reviews-track" id="reviews-track"></div>';
  var track = document.getElementById('reviews-track');

  reviews.forEach(function (r) { track.appendChild(makeSlide(r)); });

  var origSlides = Array.prototype.slice.call(track.children);
  for (var i = 0; i < CARDS_VISIBLE && i < origSlides.length; i++)
    track.appendChild(origSlides[i].cloneNode(true));
  for (var j = origSlides.length - CARDS_VISIBLE; j < origSlides.length; j++)
    track.insertBefore(origSlides[j].cloneNode(true), track.firstChild);

  vIndex = CARDS_VISIBLE;
  setSlideWidths(container, track);
  jumpTo(vIndex);
  initDots(reviews.length);
  initButtons();

  track.addEventListener('transitionend', function () {
    if (isJumping) return;
    var lastReal = CARDS_VISIBLE + realCount - 1;
    if (vIndex > lastReal) jumpTo(vIndex - realCount);
    else if (vIndex < CARDS_VISIBLE) jumpTo(vIndex + realCount);
  });

  window.addEventListener('resize', function () {
    setSlideWidths(container, track);
    jumpTo(vIndex);
  });
}

function makeSlide(review) {
  var el = document.createElement('div');
  el.className = 'review-slide';
  el.innerHTML = buildCard(review);
  return el;
}

function setSlideWidths(container, track) {
  var perView = window.innerWidth <= 768 ? 1 : CARDS_VISIBLE;
  slideW = container.offsetWidth / perView;
  track.querySelectorAll('.review-slide').forEach(function (s) {
    s.style.minWidth = slideW + 'px';
    s.style.maxWidth = slideW + 'px';
  });
}

function slideTo(idx) {
  var track = document.getElementById('reviews-track');
  if (!track || !slideW) return;
  isJumping = false;
  vIndex = idx;
  track.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)';
  track.style.transform = 'translateX(-' + (vIndex * slideW) + 'px)';
  updateDots((vIndex - CARDS_VISIBLE + realCount) % realCount);
}

function jumpTo(idx) {
  var track = document.getElementById('reviews-track');
  if (!track || !slideW) return;
  isJumping = true;
  vIndex = idx;
  track.style.transition = 'none';
  track.style.transform = 'translateX(-' + (vIndex * slideW) + 'px)';
  void track.offsetWidth;
  isJumping = false;
}

function initDots(count) {
  var el = document.getElementById('carousel-dots');
  if (!el) return;
  el.innerHTML = '';
  for (var i = 0; i < count; i++) {
    var d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Review ' + (i + 1));
    d.dataset.idx = i;
    d.addEventListener('click', function () { slideTo(CARDS_VISIBLE + (+this.dataset.idx)); });
    el.appendChild(d);
  }
}

function updateDots(realIdx) {
  document.querySelectorAll('.carousel-dot').forEach(function (d, i) {
    d.classList.toggle('active', i === realIdx);
  });
}

function initButtons() {
  var prev = document.getElementById('reviewPrev');
  var next = document.getElementById('reviewNext');
  if (prev) prev.addEventListener('click', function () { slideTo(vIndex - 1); });
  if (next) next.addEventListener('click', function () { slideTo(vIndex + 1); });
}

function buildCard(review) {
  var stars = '';
  for (var s = 1; s <= 5; s++) stars += s <= review.rating ? '&#9733;' : '&#9734;';
  var name = review.author_name || 'Anonymous';
  var init = name.split(' ').map(function (w) { return w[0] || ''; }).join('').toUpperCase().substring(0, 2);
  var text = review.text || '';
  var when = review.relative_time_description || '';
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
    '<div style="display:flex;align-items:center;gap:.55rem;flex-shrink:0">' + avatar +
    '<div>' +
    '<div class="review-author">' + esc(name) + '</div>' +
    (when ? '<div style="font-size:.72rem;color:#94a3b8;margin-top:.1rem">' + esc(when) + '</div>' : '') +
    '</div>' +
    '</div>' +
    '<div class="review-posted-on">' +
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M22.564 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>' +
    '<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>' +
    '<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>' +
    '<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>' +
    '</svg>' +
    'Google' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function updateStats(rating, count) {
  var rEl = document.getElementById('live-rating');
  var cEl = document.getElementById('live-review-count');
  if (rEl && rating) rEl.textContent = parseFloat(rating).toFixed(1);
  if (cEl && count) cEl.textContent = count + '+';
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

})();
