// ============================================
// CypherConnect — App Entry Point
// ============================================

// Global data store (loaded from JSON)
const AppData = {
  artists: [],
  events: [],
  posts: []
};

// Inject logo into loading screen
const loadingLogo = document.getElementById('loading-logo');
if (loadingLogo) loadingLogo.innerHTML = Icons.logo('', 64);

// Initialize the application
async function initApp() {
  try {
    // Load data
    const [artists, events, posts] = await Promise.all([
      fetch('data/artists.json').then(r => r.json()),
      fetch('data/events.json').then(r => r.json()),
      fetch('data/posts.json').then(r => r.json())
    ]);

    AppData.artists = artists;
    AppData.events = events;
    AppData.posts = posts;

    // Register routes
    Router.register('/', () => HomePage.render());
    Router.register('/artists', () => ArtistsPage.render());
    Router.register('/artist/:slug', (params) => ArtistProfilePage.render(params));
    Router.register('/events', () => EventsPage.render());
    Router.register('/community', () => CommunityPage.render());
    Router.register('/about', () => AboutPage.render());
    Router.register('/account', () => AccountPage.render());
    Router.register('/404', () => NotFoundPage.render());

    // Initialize router
    Router.init();

    // Initialize CypherBot
    CypherBot.init();

  } catch (err) {
    console.error('Failed to initialize CypherConnect:', err);
    document.getElementById('app').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem;text-align:center;">
        <div>
          ${Icons.logo('', 64)}
          <h2 style="margin: 1rem 0;">Failed to Load</h2>
          <p style="color:#a0aec0;">Please make sure you're running this from a local server (not file://).</p>
          <p style="color:#5a6a85;font-size:0.875rem;margin-top:1rem;">Try: python3 -m http.server 8080</p>
        </div>
      </div>`;
  }
}

// Boot
document.addEventListener('DOMContentLoaded', initApp);
