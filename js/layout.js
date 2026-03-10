// ============================================
// CypherConnect — Layout (Navbar + Footer)
// ============================================

const Layout = {
  renderNavbar() {
    return `
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar-inner">
        <a class="navbar-logo" data-route="/" aria-label="CypherConnect Home">
          ${Icons.logo('', 36)}
          Cypher<span class="accent">Connect</span>
        </a>
        
        <ul class="navbar-links" role="menubar">
          <li role="none"><a data-route="#/" role="menuitem">${Icons.home('', 16)} Home</a></li>
          <li role="none"><a data-route="#/artists" role="menuitem">${Icons.musicNote('', 16)} Artists</a></li>
          <li role="none"><a data-route="#/events" role="menuitem">${Icons.calendar('', 16)} Events</a></li>
          <li role="none"><a data-route="#/community" role="menuitem">${Icons.messageCircle('', 16)} Community</a></li>
          <li role="none"><a data-route="#/about" role="menuitem">${Icons.info('', 16)} About</a></li>
        </ul>
        
        <div class="navbar-actions">
          <button class="btn btn-primary btn-sm" data-route="#/account" id="nav-account-btn">
            ${Utils.isLoggedIn() ? Icons.user('', 16) + ' Dashboard' : Icons.rocket('', 16) + ' Join Now'}
          </button>
          <button class="navbar-hamburger" id="hamburger-btn" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    
    <div class="mobile-menu" id="mobile-menu" role="menu">
      <a data-route="#/" role="menuitem">${Icons.home('', 18)} Home</a>
      <a data-route="#/artists" role="menuitem">${Icons.musicNote('', 18)} Artists</a>
      <a data-route="#/events" role="menuitem">${Icons.calendar('', 18)} Events</a>
      <a data-route="#/community" role="menuitem">${Icons.messageCircle('', 18)} Community</a>
      <a data-route="#/about" role="menuitem">${Icons.info('', 18)} About</a>
      <a data-route="#/account" role="menuitem">${Icons.user('', 18)} ${Utils.isLoggedIn() ? 'Dashboard' : 'Join / Sign In'}</a>
    </div>`;
  },

  renderFooter() {
    return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="navbar-logo" data-route="/" style="margin-bottom: var(--space-3);">
              ${Icons.logo('', 32)}
              Cypher<span class="accent">Connect</span>
            </a>
            <p>Connecting Hip-Hop, Ghazal & Vocal talents. Discover, collaborate, perform — all in one community.</p>
            <div class="footer-socials" style="margin-top: var(--space-4);">
              <a href="#" aria-label="Instagram">${Icons.instagram('', 20)}</a>
              <a href="#" aria-label="YouTube">${Icons.youtube('', 20)}</a>
              <a href="#" aria-label="Twitter">${Icons.twitter('', 20)}</a>
              <a href="#" aria-label="Discord">${Icons.messageCircle('', 20)}</a>
            </div>
          </div>
          
          <div>
            <h4 class="footer-heading">Explore</h4>
            <ul class="footer-links">
              <li><a data-route="#/artists">Artist Directory</a></li>
              <li><a data-route="#/events">Open Mic Events</a></li>
              <li><a data-route="#/community">Community Hub</a></li>
              <li><a data-route="#/account">Your Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="footer-heading">Resources</h4>
            <ul class="footer-links">
              <li><a data-route="#/about">About Us</a></li>
              <li><a data-route="#/about">FAQ</a></li>
              <li><a data-route="#/about">Code of Conduct</a></li>
              <li><a data-route="#/about">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="footer-heading">For Organizers</h4>
            <ul class="footer-links">
              <li><a data-route="#/events">List Your Event</a></li>
              <li><a data-route="#/about">Partner With Us</a></li>
              <li><a data-route="#/about">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <span>© 2026 CypherConnect. All rights reserved.</span>
          <span>Made with ${Icons.heartFilled('', 14)} for underground artists</span>
        </div>
      </div>
    </footer>`;
  },

  initNavbar() {
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
    });
  }
};
