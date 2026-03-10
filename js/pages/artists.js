// ============================================
// CypherConnect — Artists Directory Page
// ============================================

const ArtistsPage = {
  currentFilters: { genres: [], cities: [], skills: [], available: false },
  currentSort: 'featured',
  searchQuery: '',

  render() {
    // Check for search query from URL
    const hash = window.location.hash;
    if (hash.includes('?q=')) {
      this.searchQuery = decodeURIComponent(hash.split('?q=')[1] || '');
    }

    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main class="page-content">
      <div class="container">
        <div class="directory-layout">
          <!-- Filter Sidebar -->
          <aside class="filter-sidebar" role="complementary" aria-label="Filters">
            <div class="filter-section">
              <h4>${Icons.search('', 16)} Search</h4>
              <input type="text" class="input" id="artist-search" placeholder="Search artists..." 
                     value="${this.searchQuery}" aria-label="Search artists">
            </div>
            
            <div class="filter-section">
              <h4>${Icons.musicNote('', 16)} Genre</h4>
              <div class="filter-options">
                <label class="checkbox-group"><input type="checkbox" value="Hip-Hop" class="genre-filter"> Hip-Hop</label>
                <label class="checkbox-group"><input type="checkbox" value="Ghazal" class="genre-filter"> Ghazal</label>
                <label class="checkbox-group"><input type="checkbox" value="Singer-Songwriter" class="genre-filter"> Singer-Songwriter</label>
              </div>
            </div>
            
            <div class="filter-section">
              <h4>${Icons.mapPin('', 16)} City</h4>
              <div class="filter-options">
                ${this.getCities().map(c => `
                  <label class="checkbox-group"><input type="checkbox" value="${c}" class="city-filter"> ${c}</label>
                `).join('')}
              </div>
            </div>
            
            <div class="filter-section">
              <h4>${Icons.tag('', 16)} Skills</h4>
              <div class="filter-options">
                ${this.getSkills().map(s => `
                  <label class="checkbox-group"><input type="checkbox" value="${s}" class="skill-filter"> ${s}</label>
                `).join('')}
              </div>
            </div>
            
            <div class="filter-section">
              <h4>${Icons.handshake('', 16)} Availability</h4>
              <div class="filter-options">
                <label class="checkbox-group"><input type="checkbox" id="avail-filter"> Open for Collab</label>
              </div>
            </div>
            
            <button class="btn btn-ghost btn-sm" id="clear-filters" style="width:100%; margin-top: var(--space-4);">
              Clear All Filters
            </button>
          </aside>
          
          <!-- Artist Grid -->
          <div>
            <div class="directory-header">
              <div>
                <h1>Artist Directory</h1>
                <p class="directory-count" id="artist-count">Showing all artists</p>
              </div>
              <div class="sort-controls">
                <label style="margin-bottom:0; white-space:nowrap;">Sort by:</label>
                <select class="select" id="sort-select" style="width: auto; min-width: 140px;">
                  <option value="featured">${Icons.star('', 12)} Featured</option>
                  <option value="name">A-Z Name</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
            <div class="artist-grid" id="artist-grid" role="list" aria-label="Artists directory">
              <!-- Dynamically filled -->
            </div>
            <div class="text-center" style="margin-top: var(--space-8);">
              <button class="btn btn-ghost" id="load-more-btn" style="display:none;">Load More Artists</button>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    this.initFilters();
    this.applyFilters();
  },

  getCities() {
    return [...new Set(AppData.artists.map(a => a.city))].sort();
  },

  getSkills() {
    return [...new Set(AppData.artists.flatMap(a => a.skills))].sort();
  },

  renderArtistCards(artists) {
    if (artists.length === 0) {
      return `<div class="text-center text-muted" style="grid-column: 1/-1; padding: var(--space-16);">
        <h3>No artists found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>`;
    }
    return artists.map((artist, i) => `
      <div class="card artist-card animate-fade-in-up stagger-${(i % 5) + 1}" data-route="#/artist/${artist.slug}" role="listitem">
        <div class="artist-card-image">
          <img src="${artist.photo}" alt="${artist.name}" loading="lazy">
          <div class="artist-card-overlay">
            <button class="btn btn-sm btn-primary">View Profile</button>
          </div>
        </div>
        <div class="artist-card-body">
          <div class="artist-card-name">${artist.name} ${artist.featured ? Icons.star('', 14) : ''}</div>
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

  applyFilters() {
    let results = [...AppData.artists];

    // Search
    const q = document.getElementById('artist-search')?.value?.trim() || '';
    if (q) {
      results = Utils.filterBySearch(results, q, ['name', 'bio', 'genres', 'city', 'skills', 'tags']);
    }

    // Genre filter
    const genres = [...document.querySelectorAll('.genre-filter:checked')].map(el => el.value);
    if (genres.length > 0) {
      results = results.filter(a => a.genres.some(g => genres.includes(g)));
    }

    // City filter
    const cities = [...document.querySelectorAll('.city-filter:checked')].map(el => el.value);
    if (cities.length > 0) {
      results = results.filter(a => cities.includes(a.city));
    }

    // Skill filter
    const skills = [...document.querySelectorAll('.skill-filter:checked')].map(el => el.value);
    if (skills.length > 0) {
      results = results.filter(a => a.skills.some(s => skills.includes(s)));
    }

    // Availability
    if (document.getElementById('avail-filter')?.checked) {
      results = results.filter(a => a.availability);
    }

    // Sort
    const sort = document.getElementById('sort-select')?.value || 'featured';
    if (sort === 'featured') results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    else if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'newest') results.sort((a, b) => b.id - a.id);

    const grid = document.getElementById('artist-grid');
    const count = document.getElementById('artist-count');
    if (grid) grid.innerHTML = this.renderArtistCards(results);
    if (count) count.textContent = `Showing ${results.length} artist${results.length !== 1 ? 's' : ''}`;
  },

  initFilters() {
    document.querySelectorAll('.genre-filter, .city-filter, .skill-filter, #avail-filter').forEach(el => {
      el.addEventListener('change', () => this.applyFilters());
    });
    document.getElementById('sort-select')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('artist-search')?.addEventListener('input', () => this.applyFilters());
    document.getElementById('clear-filters')?.addEventListener('click', () => {
      document.querySelectorAll('.genre-filter, .city-filter, .skill-filter, #avail-filter').forEach(el => el.checked = false);
      const search = document.getElementById('artist-search');
      if (search) search.value = '';
      this.applyFilters();
    });
  }
};
