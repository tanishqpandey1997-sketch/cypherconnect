// ============================================
// CypherConnect — Home Page
// ============================================

const HomePage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    
    <main>
      <!-- Hero Section -->
      <section class="hero" aria-label="Hero">
        <div class="hero-bg">
          <img src="images/hero_stage.png" alt="Underground concert stage with purple and orange lighting" loading="eager">
        </div>
        <div class="container hero-content">
          <div class="hero-badge" style="animation: fadeInUp 0.6s ease both;">
            ${Icons.sparkles('', 16)} India's Underground Music Community
          </div>
          <h1 style="animation: fadeInUp 0.7s ease 0.1s both;">
            Find Your Next<br>
            <span class="gradient-text">Beat</span>
          </h1>
          <p class="hero-subtitle" style="animation: fadeInUp 0.7s ease 0.2s both;">
            Connecting Hip-Hop, Ghazal & Vocal Talents — discover artists, 
            join open mics, and find your perfect collaborator.
          </p>
          <div class="hero-actions" style="animation: fadeInUp 0.7s ease 0.3s both;">
            <button class="btn btn-primary btn-lg" data-route="#/account">
              ${Icons.rocket('', 18)} Join CypherConnect
            </button>
            <button class="btn btn-secondary btn-lg" data-route="#/artists">
              ${Icons.musicNote('', 18)} Discover Artists
            </button>
          </div>
          <div class="hero-stats" style="animation: fadeInUp 0.7s ease 0.4s both;">
            <div class="hero-stat">
              <div class="number">150+</div>
              <div class="label">Artists</div>
            </div>
            <div class="hero-stat">
              <div class="number">40+</div>
              <div class="label">Open Mics</div>
            </div>
            <div class="hero-stat">
              <div class="number">12</div>
              <div class="label">Cities</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Search Section -->
      <section class="search-section container">
        <div class="search-bar" role="search">
          <span class="search-icon" aria-hidden="true">${Icons.search('', 20)}</span>
          <input type="text" id="home-search" placeholder="Search by artist name, genre, or city..." 
                 aria-label="Search artists, genres, or cities">
          <button class="btn btn-primary" id="home-search-btn">Search</button>
        </div>
      </section>

      <!-- Action Cards -->
      <section class="section container">
        <div class="action-cards">
          <div class="action-card animate-fade-in-up stagger-1" data-route="#/artists" role="button" tabindex="0" aria-label="Discover Artists">
            <div class="action-card-icon">${Icons.musicNote('', 32)}</div>
            <h3>Discover Artists</h3>
            <p>Browse hip-hop MCs, ghazal vocalists, and singer-songwriters from across India. Filter by genre, city, and skills.</p>
          </div>
          <div class="action-card animate-fade-in-up stagger-2" data-route="#/events" role="button" tabindex="0" aria-label="Find Events">
            <div class="action-card-icon">${Icons.calendar('', 32)}</div>
            <h3>Find Events</h3>
            <p>Open mics, cyphers, jam sessions — discover live events near you and RSVP to perform or attend.</p>
          </div>
          <div class="action-card animate-fade-in-up stagger-3" data-route="#/account" role="button" tabindex="0" aria-label="Get AI Matched">
            <div class="action-card-icon">${Icons.bot('', 32)}</div>
            <h3>Get Matched</h3>
            <p>Our AI matchmaker suggests collaborators based on your genre, skills, and location — with full transparency.</p>
          </div>
        </div>
      </section>

      <!-- Featured Artists Carousel -->
      <section class="section carousel-section container">
        <div class="section-header">
          <h2>Featured Artists</h2>
          <div class="section-line"></div>
          <a class="btn btn-ghost btn-sm" data-route="#/artists">View All ${Icons.arrowRight('', 14)}</a>
        </div>
        <div class="carousel-wrapper">
          <div class="carousel-track" id="featured-carousel" role="list" aria-label="Featured artists">
            ${this.renderFeaturedArtists()}
          </div>
        </div>
      </section>

      <!-- Upcoming Events -->
      <section class="section container">
        <div class="section-header">
          <h2>Upcoming Events</h2>
          <div class="section-line"></div>
          <a class="btn btn-ghost btn-sm" data-route="#/events">View All ${Icons.arrowRight('', 14)}</a>
        </div>
        <div class="events-list" id="upcoming-events">
          ${this.renderUpcomingEvents()}
        </div>
      </section>

      <!-- CTA Section -->
      <section class="section container text-center" style="padding: var(--space-20) 0;">
        <h2 style="margin-bottom: var(--space-4);">Join the <span class="text-purple">Beat</span></h2>
        <p class="text-muted" style="max-width: 500px; margin: 0 auto var(--space-8); font-size: var(--text-lg);">
          Connect, collab, perform — be part of India's growing underground music community.
        </p>
        <button class="btn btn-orange btn-lg" data-route="#/account">
          ${Icons.mic('', 18)} Sign Up Free
        </button>
      </section>
    </main>

    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    this.initSearch();
  },

  renderFeaturedArtists() {
    const featured = AppData.artists.filter(a => a.featured);
    const all = [...featured, ...AppData.artists.filter(a => !a.featured)];
    return all.map(artist => `
      <div class="card artist-card" data-route="#/artist/${artist.slug}" role="listitem" aria-label="${artist.name}">
        <div class="artist-card-image">
          <img src="${artist.photo}" alt="${artist.name}" loading="lazy">
          <div class="artist-card-overlay">
            <button class="btn btn-sm btn-primary">View Profile</button>
            <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); Utils.showToast('Following ${artist.name}!', 'success')">${Icons.heart('', 14)} Follow</button>
          </div>
        </div>
        <div class="artist-card-body">
          <div class="artist-card-name">${artist.name}</div>
          <div class="artist-card-meta">
            ${artist.genres.map(g => `<span class="badge ${Utils.genreBadgeClass(g)}">${g}</span>`).join('')}
            <span>${Icons.mapPin('', 14)} ${artist.city}</span>
          </div>
          <div class="artist-card-bio">${artist.bio}</div>
          <div class="artist-card-tags">
            ${artist.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
        ${artist.availability ? '<div class="artist-card-footer"><span class="badge badge-success">' + Icons.check('', 14) + ' Open for Collab</span></div>' : ''}
      </div>
    `).join('');
  },

  renderUpcomingEvents() {
    return AppData.events.slice(0, 3).map(event => `
      <div class="event-card" role="article">
        <div class="event-card-date">
          <span class="month">${Utils.getMonth(event.date_time)}</span>
          <span class="day">${Utils.getDay(event.date_time)}</span>
        </div>
        <div class="event-card-content">
          <h3>${event.title}</h3>
          <div class="event-card-meta">
            <span class="badge ${Utils.genreBadgeClass(event.genre)}">${event.genre}</span>
            <span>${Icons.mapPin('', 14)} ${event.venue_name}, ${event.city}</span>
            <span>${Icons.clock('', 14)} ${Utils.formatTime(event.date_time)}</span>
          </div>
          <p class="event-card-desc">${event.description}</p>
          <div class="event-card-actions">
            <button class="btn btn-primary btn-sm" onclick="EventsPage.showRSVPModal(${event.id})">RSVP</button>
            <button class="btn btn-ghost btn-sm" data-route="#/events">Details ${Icons.arrowRight('', 12)}</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  initSearch() {
    const searchBtn = document.getElementById('home-search-btn');
    const searchInput = document.getElementById('home-search');
    if (searchBtn && searchInput) {
      const doSearch = () => {
        const q = searchInput.value.trim();
        if (q) Router.navigate(`/artists?q=${encodeURIComponent(q)}`);
      };
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    }
  }
};
