// ============================================
// CypherConnect — Events Page
// ============================================

const EventsPage = {
  currentGenre: 'all',
  viewMode: 'list',

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main class="page-content">
      <div class="container">
        <div class="page-header">
          <h1>Events & Open Mics</h1>
          <p>Discover live events, open mics, cyphers, and jam sessions near you.</p>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: var(--space-6);">
          <div class="genre-tabs" role="tablist" aria-label="Filter by genre">
            <button class="genre-tab active" data-genre="all" role="tab">All</button>
            <button class="genre-tab" data-genre="Hip-Hop" role="tab">${Icons.mic('', 14)} Hip-Hop</button>
            <button class="genre-tab" data-genre="Ghazal" role="tab">${Icons.musicNote('', 14)} Ghazal</button>
            <button class="genre-tab" data-genre="Singer-Songwriter" role="tab">${Icons.guitar('', 14)} Singer</button>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm ${this.viewMode === 'list' ? 'active' : ''}" id="view-list">${Icons.list('', 14)} List</button>
            <button class="btn btn-ghost btn-sm ${this.viewMode === 'calendar' ? 'active' : ''}" id="view-calendar">${Icons.calendar('', 14)} Calendar</button>
            <button class="btn btn-primary btn-sm" id="create-event-btn">${Icons.plus('', 14)} Create Event</button>
          </div>
        </div>

        <!-- Events Content -->
        <div id="events-content">
          ${this.renderListView(AppData.events)}
        </div>
      </div>
    </main>
    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    this.initControls();
  },

  renderListView(events) {
    if (events.length === 0) {
      return `<div class="text-center text-muted" style="padding: var(--space-16);">
        <h3>No events found</h3><p>Try a different genre filter.</p>
      </div>`;
    }
    return `<div class="events-list">${events.map(event => `
      <div class="event-card animate-fade-in-up" role="article">
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
            <span>${Icons.ticket('', 14)} ${event.rsvp_count} RSVPs</span>
            <span>${Icons.mic('', 14)} ${event.performer_slots} slots</span>
          </div>
          <p class="event-card-desc">${event.description}</p>
          ${event.instructions ? `<p style="font-size: var(--text-xs); color: var(--teal); margin-bottom: var(--space-3);">${Icons.info('', 12)} ${event.instructions}</p>` : ''}
          <div class="event-card-actions">
            <button class="btn btn-primary btn-sm" onclick="EventsPage.showRSVPModal(${event.id})">RSVP to Attend</button>
            <button class="btn btn-orange btn-sm" onclick="EventsPage.showPerformerSignup(${event.id})">Sign Up to Perform</button>
          </div>
        </div>
      </div>
    `).join('')}</div>`;
  },

  renderCalendarView(events) {
    const months = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const year = 2026, month = 3;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const eventsByDay = {};
    events.forEach(e => {
      const d = new Date(e.date_time);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push(e);
      }
    });

    let cells = months.map(d => `<div class="calendar-header-cell">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) cells += '<div class="calendar-cell empty"></div>';
    for (let day = 1; day <= daysInMonth; day++) {
      const evts = eventsByDay[day] || [];
      cells += `<div class="calendar-cell">
        <div class="calendar-day">${day}</div>
        ${evts.map(e => `<div class="calendar-event" onclick="EventsPage.showRSVPModal(${e.id})" title="${e.title}">${e.title}</div>`).join('')}
      </div>`;
    }

    return `
      <div style="margin-bottom: var(--space-4); text-align: center;">
        <h3>April 2026</h3>
      </div>
      <div class="calendar-grid">${cells}</div>
    `;
  },

  filterEvents() {
    let events = [...AppData.events];
    if (this.currentGenre !== 'all') {
      events = events.filter(e => e.genre === this.currentGenre);
    }
    const content = document.getElementById('events-content');
    if (content) {
      content.innerHTML = this.viewMode === 'list' ? this.renderListView(events) : this.renderCalendarView(events);
    }
  },

  initControls() {
    document.querySelectorAll('.genre-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.genre-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentGenre = tab.dataset.genre;
        this.filterEvents();
      });
    });

    document.getElementById('view-list')?.addEventListener('click', () => {
      this.viewMode = 'list';
      this.filterEvents();
    });
    document.getElementById('view-calendar')?.addEventListener('click', () => {
      this.viewMode = 'calendar';
      this.filterEvents();
    });
    document.getElementById('create-event-btn')?.addEventListener('click', () => this.showCreateEventForm());
  },

  showRSVPModal(eventId) {
    const event = AppData.events.find(e => e.id === eventId);
    if (!event) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${Icons.calendar('', 20)} RSVP — ${event.title}</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: var(--space-4);">
            <div class="flex gap-3" style="margin-bottom: var(--space-3);">
              <span class="badge ${Utils.genreBadgeClass(event.genre)}">${event.genre}</span>
            </div>
            <p><strong>${Icons.mapPin('', 14)} Venue:</strong> ${event.venue_name}, ${event.venue_address}</p>
            <p><strong>${Icons.calendar('', 14)} Date:</strong> ${Utils.formatDate(event.date_time)}</p>
            <p><strong>${Icons.clock('', 14)} Time:</strong> ${Utils.formatTime(event.date_time)}</p>
            <p><strong>${Icons.ticket('', 14)} RSVPs:</strong> ${event.rsvp_count}</p>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label>Your Name</label>
            <input type="text" class="input" placeholder="Enter your name">
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label>Email</label>
            <input type="email" class="input" placeholder="you@example.com">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary modal-confirm-btn">${Icons.check('', 14)} Confirm RSVP</button>
        </div>
      </div>`;
    
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.querySelector('.modal-cancel-btn').addEventListener('click', close);
    overlay.querySelector('.modal-confirm-btn').addEventListener('click', () => {
      close();
      Utils.showToast(`RSVP confirmed for ${event.title}!`, 'success');
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  showPerformerSignup(eventId) {
    const event = AppData.events.find(e => e.id === eventId);
    if (!event) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${Icons.mic('', 20)} Performer Sign-Up</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">
            Sign up to perform at <strong>${event.title}</strong>. 
            ${event.performer_slots} slots available.
          </p>
          ${event.instructions ? `<div class="badge badge-teal" style="margin-bottom: var(--space-4); display:block; text-align:left; padding: var(--space-3);">${Icons.info('', 14)} ${event.instructions}</div>` : ''}
          <div style="margin-bottom: var(--space-4);">
            <label>Stage Name</label>
            <input type="text" class="input" placeholder="Your stage name">
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label>Genre / Style</label>
            <select class="select">
              <option>Hip-Hop / Rap</option>
              <option>Ghazal</option>
              <option>Singer-Songwriter</option>
              <option>Spoken Word</option>
              <option>Freestyle</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Notes for Organizer</label>
            <textarea class="textarea" placeholder="Any special requirements or info?" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost modal-cancel-btn">Cancel</button>
          <button class="btn btn-orange modal-confirm-btn">${Icons.mic('', 14)} Submit Sign-Up</button>
        </div>
      </div>`;
    
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.querySelector('.modal-cancel-btn').addEventListener('click', close);
    overlay.querySelector('.modal-confirm-btn').addEventListener('click', () => {
      close();
      Utils.showToast('Performance sign-up submitted! The organizer will confirm your slot.', 'success');
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  showCreateEventForm() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h3>${Icons.calendar('', 20)} Create Event</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
          <div style="margin-bottom: var(--space-4);">
            <label>Event Title</label>
            <input type="text" class="input" placeholder="e.g. Underground Cypher Night">
          </div>
          <div class="flex gap-4" style="margin-bottom: var(--space-4);">
            <div style="flex:1;"><label>Genre</label>
              <select class="select"><option>Hip-Hop</option><option>Ghazal</option><option>Singer-Songwriter</option></select>
            </div>
            <div style="flex:1;"><label>Date & Time</label>
              <input type="datetime-local" class="input">
            </div>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label>Venue Name</label>
            <input type="text" class="input" placeholder="e.g. Cafe Sur">
          </div>
          <div class="flex gap-4" style="margin-bottom: var(--space-4);">
            <div style="flex:1;"><label>City</label>
              <input type="text" class="input" placeholder="e.g. Mumbai">
            </div>
            <div style="flex:1;"><label>Performer Slots</label>
              <input type="number" class="input" value="10" min="1">
            </div>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <label>Description</label>
            <textarea class="textarea" rows="3" placeholder="Describe your event..."></textarea>
          </div>
          <div>
            <label>Instructions for Performers</label>
            <textarea class="textarea" rows="2" placeholder="Slot duration, rules, etc."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary modal-confirm-btn">Create Event</button>
        </div>
      </div>`;
    
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.querySelector('.modal-cancel-btn').addEventListener('click', close);
    overlay.querySelector('.modal-confirm-btn').addEventListener('click', () => {
      close();
      Utils.showToast('Event created! It will appear after organizer verification.', 'success');
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }
};
