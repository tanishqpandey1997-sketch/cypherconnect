// ============================================
// CypherConnect — Utility Helpers
// ============================================

const Utils = {
  // Format date for display
  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
  },

  formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  },

  getMonth(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  },

  getDay(dateStr) {
    return new Date(dateStr).getDate();
  },

  // Relative time
  timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return Utils.formatDate(dateStr);
  },

  // Simple search filter
  filterBySearch(items, query, fields) {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      fields.some(f => {
        const val = item[f];
        if (Array.isArray(val)) return val.some(v => v.toLowerCase().includes(q));
        return String(val).toLowerCase().includes(q);
      })
    );
  },

  // Genre badge class
  genreBadgeClass(genre) {
    switch (genre) {
      case 'Hip-Hop': return 'badge-indigo';
      case 'Ghazal': return 'badge-rose';
      case 'Singer-Songwriter': return 'badge-forest';
      default: return 'badge-orange';
    }
  },

  // Post type badge
  postTypeBadge(type) {
    switch (type) {
      case 'collab_call': return { label: 'Collab Call', class: 'badge-orange' };
      case 'announcement': return { label: 'Announcement', class: 'badge-purple' };
      case 'recording': return { label: 'Recording', class: 'badge-teal' };
      default: return { label: 'Post', class: 'badge-purple' };
    }
  },

  // Toast notifications
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // LocalStorage helpers
  store: {
    get(key) {
      try { return JSON.parse(localStorage.getItem(`cc_${key}`)); }
      catch { return null; }
    },
    set(key, val) {
      localStorage.setItem(`cc_${key}`, JSON.stringify(val));
    },
    remove(key) {
      localStorage.removeItem(`cc_${key}`);
    }
  },

  // Check if user is "logged in"
  isLoggedIn() {
    return !!Utils.store.get('user');
  },

  getUser() {
    return Utils.store.get('user');
  }
};
