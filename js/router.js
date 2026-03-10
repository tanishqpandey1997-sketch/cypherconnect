// ============================================
// CypherConnect — SPA Router
// ============================================

const Router = {
  routes: {},
  currentRoute: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    // Strip leading # if present (data-route attributes include it)
    const cleanPath = path.startsWith('#') ? path.slice(1) : path;
    window.location.hash = cleanPath;
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        this.navigate(link.dataset.route);
      }
    });
    // Immediately handle current route
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...params] = hash.split('/').filter(Boolean);
    const route = '/' + (path || '');
    
    // Handle parameterized routes
    let handler = this.routes[route];
    let routeParams = params;
    
    if (!handler && params.length > 0) {
      // Try dynamic routes like /artist/:slug
      const dynamicKey = route + '/:slug';
      handler = this.routes[dynamicKey];
    }
    
    if (!handler) {
      handler = this.routes['/404'] || this.routes['/'];
    }

    this.currentRoute = route;
    this.updateActiveNav(route);
    
    const app = document.getElementById('app');
    if (app) {
      app.style.opacity = '0';
      setTimeout(() => {
        handler(routeParams);
        app.style.opacity = '1';
        window.scrollTo(0, 0);
      }, 150);
    }
  },

  updateActiveNav(route) {
    document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.route === '#' + route) {
        link.classList.add('active');
      }
    });
  }
};
