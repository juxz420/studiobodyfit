// Google Reviews Script for Studio Body Fit
// Place ID: ChIJ-6pkv2lvFkcR91FjgdcqoNk

(function() {
    'use strict';
    
    const PLACE_ID = 'ChIJ-6pkv2lvFkcR91FjgdcqoNk';
    
    // Function to load Google Reviews
    window.loadGoogleReviews = function() {
        console.log('Loading Google Reviews for Place ID:', PLACE_ID);
        
        // Update the Google Reviews link
        const reviewsLink = document.getElementById('google-reviews-link');
        if (reviewsLink) {
            reviewsLink.href = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`;
        }
        
        // Note: To fetch actual Google Reviews, you need:
        // 1. Google Maps API Key
        // 2. Google Places API enabled
        // 3. The following code structure:
        
        /*
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            
            service.getDetails({
                placeId: PLACE_ID,
                fields: ['name', 'rating', 'user_ratings_total', 'reviews']
            }, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    displayReviews(place);
                } else {
                    console.error('Error fetching place details:', status);
                    displayFallbackReviews();
                }
            });
        } else {
            console.warn('Google Maps API not loaded. Using fallback reviews.');
            displayFallbackReviews();
        }
        */
        
        // For now, using fallback reviews (the static ones in HTML)
        displayFallbackReviews();
    };
    
    function displayReviews(place) {
        // Update summary
        const summaryStars = document.getElementById('summary-stars');
        const summaryText = document.getElementById('summary-text');
        
        if (summaryStars && place.rating) {
            summaryStars.innerHTML = generateStars(place.rating);
        }
        
        if (summaryText && place.rating && place.user_ratings_total) {
            summaryText.textContent = `${place.rating} na podstawie ${place.user_ratings_total} opinii`;
        }
        
        // Display individual reviews
        if (place.reviews && place.reviews.length > 0) {
            const container = document.getElementById('reviews-container');
            if (container) {
                container.innerHTML = '';
                
                // Filter and sort reviews
                const filteredReviews = place.reviews
                    // Filtruj tylko wysokie oceny (4-5 gwiazdek)
                    .filter(review => review.rating >= 4)
                    // Sortuj według daty (najnowsze najpierw)
                    .sort((a, b) => b.time - a.time);
                
                // Show first 6 filtered reviews
                const reviewsToShow = filteredReviews.slice(0, 6);
                
                if (reviewsToShow.length > 0) {
                    reviewsToShow.forEach(review => {
                        container.appendChild(createReviewCard(review));
                    });
                } else {
                    // Jeśli nie ma opinii spełniających kryteria, pokaż fallback
                    displayFallbackReviews();
                }
            }
        }
    }
    
    function displayFallbackReviews() {
        // Jeśli API nie załadował opinii, nie pokazuj nic
        const container = document.getElementById('reviews-container');
        if (container && container.children.length === 0) {
            container.innerHTML = '';
        }
    }
    
    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        const stars = document.createElement('div');
        stars.className = 'review-stars';
        stars.innerHTML = generateStars(review.rating);
        
        const text = document.createElement('p');
        text.className = 'review-text';
        text.textContent = review.text || '';
        
        const author = document.createElement('p');
        author.className = 'review-author';
        author.textContent = review.author_name || 'Anonim';
        
        if (review.relative_time_description) {
            const time = document.createElement('p');
            time.className = 'review-time';
            time.style.color = '#888';
            time.style.fontSize = '0.85rem';
            time.style.marginTop = '5px';
            time.textContent = review.relative_time_description;
            card.appendChild(stars);
            card.appendChild(text);
            card.appendChild(author);
            card.appendChild(time);
        } else {
            card.appendChild(stars);
            card.appendChild(text);
            card.appendChild(author);
        }
        
        return card;
    }
    
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '⭐';
        }
        
        if (hasHalfStar) {
            starsHtml += '⭐'; // Using full star for simplicity
        }
        
        return starsHtml;
    }
    
    // Auto-load reviews when script is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.loadGoogleReviews);
    } else {
        window.loadGoogleReviews();
    }
})();
