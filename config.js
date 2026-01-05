// Configuration for Studio Body Fit
const GOOGLE_PLACE_ID = 'ChIJ-6pkv2lvFkcR91FjgdcqoNk';
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

(function () {
  const offersUrl = 'offers.json';

  async function fetchOffers() {
    // Helper to read inline JSON (supports both offers-data and offers-fallback ids)
    const readInline = () => {
      const el = document.getElementById('offers-data') || document.getElementById('offers-fallback');
      if (!el) return [];
      try {
        return JSON.parse(el.textContent);
      } catch (err) {
        console.error('Failed to parse inline offers data:', err);
        return [];
      }
    };

    // On file:// protocol, use inline only
    if (location.protocol === 'file:') {
      return readInline();
    }

    // On http/https, try to fetch from server
    try {
      const res = await fetch(offersUrl, { cache: 'no-store' });
      if (res.ok) return await res.json();
      console.warn('Fetch offers returned non-ok status:', res.status);
    } catch (err) {
      console.warn('Fetch offers failed. Falling back to inline data. Error:', err && err.message);
    }

    // Fallback to inline data
    return readInline();
  }

  function createOfferCard(offer) {
    const article = document.createElement('article');
    article.className = 'offer-card';

    const link = document.createElement('a');
    link.href = offer.url || '#';
    link.target = '_blank';
    link.rel = 'noopener';

    const img = document.createElement('img');
    img.src = offer.image || '';
    img.alt = offer.title || '';

    const body = document.createElement('div');
    body.className = 'offer-body';

    const h3 = document.createElement('h3');
    h3.textContent = offer.title || 'Brak tytułu';

    const p = document.createElement('p');
    p.className = 'price';
    p.textContent = offer.price || '';

    body.appendChild(h3);
    body.appendChild(p);
    link.appendChild(img);
    link.appendChild(body);
    article.appendChild(link);

    return article;
  }

  function renderPreview(offers, limit = 3) {
    if (!offers.length) return; // keep existing fallback markup
    const container = document.querySelector('.offers-preview .offers-grid');
    if (!container) return;
    container.innerHTML = '';
    offers.slice(0, limit).forEach(o => container.appendChild(createOfferCard(o)));
  }

  function renderFullList(offers) {
    if (!offers.length) return; // keep existing static list if no data
    const container = document.querySelector('.offers-section .offers-grid');
    if (!container) return;
    container.innerHTML = '';
    offers.forEach(o => container.appendChild(createOfferCard(o)));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const offers = await fetchOffers();
    renderPreview(offers, 3);
    renderFullList(offers);
  });
})();
