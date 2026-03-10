// ============================================
// CypherConnect — Artist Profile Page
// ============================================

const ArtistProfilePage = {
  render(params) {
    const slug = params[0];
    const artist = AppData.artists.find(a => a.slug === slug);
    
    if (!artist) {
      NotFoundPage.render();
      return;
    }

    const matches = Matchmaker.getMatches(artist, AppData.artists, 5);
    const eventSugs = Matchmaker.getEventSuggestions(artist, AppData.events, 3);
    const artistEvents = AppData.events.filter(e => artist.upcoming_events?.includes(e.id));

    const socialIcons = {
      instagram: Icons.instagram('', 16),
      youtube: Icons.youtube('', 16),
      twitter: Icons.twitter('', 16),
      spotify: Icons.spotify('', 16),
      soundcloud: Icons.soundcloud('', 16),
      bandcamp: Icons.disc('', 16)
    };

    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main>
      <!-- Profile Header -->
      <section class="profile-header">
        <div class="profile-cover">
          <img src="${artist.photo}" alt="${artist.name} cover">
        </div>
        <div class="container">
          <div class="profile-info">
            <div class="profile-photo">
              <img src="${artist.photo}" alt="${artist.name}">
            </div>
            <div class="profile-details">
              <div class="profile-badges">
                ${artist.genres.map(g => `<span class="badge ${Utils.genreBadgeClass(g)}">${g}</span>`).join('')}
                ${artist.featured ? '<span class="badge badge-success">' + Icons.star('', 12) + ' Featured</span>' : ''}
                ${artist.availability ? '<span class="badge badge-teal">' + Icons.handshake('', 12) + ' Open for Collab</span>' : ''}
              </div>
              <h1>${artist.name}</h1>
              <div class="profile-location">${Icons.mapPin('', 16)} ${artist.city}</div>
              <div class="profile-actions">
                <button class="btn btn-primary" onclick="Utils.showToast('Following ${artist.name}!', 'success')">${Icons.heart('', 16)} Follow</button>
                <button class="btn btn-secondary" onclick="Utils.showToast('Message sent!', 'info')">${Icons.mail('', 16)} Message</button>
                <button class="btn btn-orange" id="collab-btn">${Icons.handshake('', 16)} Request Collab</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Profile Body -->
      <section class="container" style="margin-top: var(--space-10);">
        <div class="profile-body">
          <!-- Left Column -->
          <div>
            <div class="profile-section">
              <h3>About</h3>
              <p style="color: var(--text-secondary); line-height: 1.8;">${artist.bio}</p>
            </div>

            ${artist.collab_interests ? `
            <div class="profile-section">
              <h3>Collaboration Interests</h3>
              <p style="color: var(--text-secondary); line-height: 1.8;">${artist.collab_interests}</p>
            </div>` : ''}

            <div class="profile-section">
              <h3>Skills</h3>
              <div class="flex flex-wrap gap-2">
                ${artist.skills.map(s => `<span class="badge badge-purple">${s}</span>`).join('')}
              </div>
            </div>

            <div class="profile-section">
              <h3>Sample Tracks</h3>
              <div class="track-list">
                ${artist.sample_tracks.map((t, i) => `
                  <div class="track-item">
                    <div class="track-play" role="button" aria-label="Play ${t.title}">${Icons.play('', 16)}</div>
                    <div>
                      <div style="font-weight: 600; font-size: var(--text-sm);">${t.title}</div>
                      <div style="font-size: var(--text-xs); color: var(--text-muted);">Track ${i + 1}</div>
                    </div>
                    <div style="margin-left: auto; font-size: var(--text-xs); color: var(--text-muted);">3:${20 + i * 12}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            ${artistEvents.length > 0 ? `
            <div class="profile-section">
              <h3>Upcoming Appearances</h3>
              <div class="events-list">
                ${artistEvents.map(event => `
                  <div class="event-card">
                    <div class="event-card-date">
                      <span class="month">${Utils.getMonth(event.date_time)}</span>
                      <span class="day">${Utils.getDay(event.date_time)}</span>
                    </div>
                    <div class="event-card-content">
                      <h3 style="font-size: var(--text-base);">${event.title}</h3>
                      <div class="event-card-meta">
                        <span>${Icons.mapPin('', 14)} ${event.venue_name}, ${event.city}</span>
                        <span>${Icons.clock('', 14)} ${Utils.formatTime(event.date_time)}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>` : ''}

            <div class="profile-section">
              <h3>Tags</h3>
              <div class="flex flex-wrap gap-2">
                ${artist.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>

            <div class="profile-section">
              <h3>Connect</h3>
              <div class="flex gap-3">
                ${Object.entries(artist.socials).map(([platform, url]) => `
                  <a href="${url}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener" aria-label="${platform}">
                    ${socialIcons[platform] || Icons.link('', 16)}
                    ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Matchmaker -->
          <div>
            <div class="matchmaker-panel" role="complementary" aria-label="AI Matchmaker suggestions">
              <div class="matchmaker-header">
                <div class="ai-icon">${Icons.bot('', 24)}</div>
                <div>
                  <h3>AI Matchmaker</h3>
                  <p>Suggested collaborators for ${artist.name.split(' ')[0]}</p>
                </div>
              </div>
              ${matches.length > 0 ? matches.map(m => `
                <div class="match-item" data-route="#/artist/${m.artist.slug}" style="cursor:pointer;">
                  <div class="match-photo">
                    <img src="${m.artist.photo}" alt="${m.artist.name}">
                  </div>
                  <div class="match-info" style="flex:1;">
                    <h4>${m.artist.name}</h4>
                    <div class="match-reason">${m.reasons.join(' • ')}</div>
                    <div class="match-score">Match score: ${m.score}/9</div>
                  </div>
                  <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); Utils.showToast('Match request sent to ${m.artist.name}!', 'success')">
                    Match
                  </button>
                </div>
              `).join('') : '<div style="padding: var(--space-5); color: var(--text-muted); text-align: center;">No matches found.</div>'}
              
              <div class="matchmaker-footer">
                <p class="matchmaker-consent">
                  ${Icons.lock('', 14)} AI suggests matches based on public profile data — shared genres, location, and skills. 
                  You control all messages and bookings. <a data-route="#/about">Learn more ${Icons.arrowRight('', 12)}</a>
                </p>
              </div>
            </div>

            ${eventSugs.length > 0 ? `
            <div class="matchmaker-panel" style="margin-top: var(--space-6);">
              <div class="matchmaker-header">
                <div class="ai-icon" style="background: var(--gradient-orange);">${Icons.calendar('', 24)}</div>
                <div>
                  <h3>Suggested Events</h3>
                  <p>Based on genre & location</p>
                </div>
              </div>
              ${eventSugs.map(event => `
                <div class="match-item" style="cursor:pointer;" data-route="#/events">
                  <div style="min-width:48px; text-align:center;">
                    <div style="font-size: var(--text-xs); color: var(--purple-light); font-weight:700;">${Utils.getMonth(event.date_time)}</div>
                    <div style="font-family: var(--font-heading); font-size: var(--text-xl); font-weight:800;">${Utils.getDay(event.date_time)}</div>
                  </div>
                  <div style="flex:1;">
                    <h4 style="font-size: var(--text-sm);">${event.title}</h4>
                    <div style="font-size: var(--text-xs); color: var(--text-muted);">${Icons.mapPin('', 12)} ${event.venue_name}, ${event.city}</div>
                  </div>
                </div>
              `).join('')}
            </div>` : ''}
          </div>
        </div>
      </section>
    </main>
    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    
    // Collab request modal
    document.getElementById('collab-btn')?.addEventListener('click', () => {
      this.showCollabModal(artist);
    });
  },

  showCollabModal(artist) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${Icons.handshake('', 20)} Request Collaboration</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">
            Send a collaboration request to <strong>${artist.name}</strong>. They'll review your profile and respond.
          </p>
          <div style="margin-bottom: var(--space-4);">
            <label>Your Message</label>
            <textarea class="textarea" placeholder="Introduce yourself and describe the collaboration you have in mind..." rows="4"></textarea>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label>Project Type</label>
            <select class="select">
              <option>Song / Track Collaboration</option>
              <option>Live Performance Together</option>
              <option>Production / Beats</option>
              <option>Co-writing Session</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-send">${Icons.send('', 16)} Send Request</button>
        </div>
      </div>`;
    
    document.body.appendChild(overlay);
    overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#modal-send').addEventListener('click', () => {
      overlay.remove();
      Utils.showToast(`Collaboration request sent to ${artist.name}!`, 'success');
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }
};
