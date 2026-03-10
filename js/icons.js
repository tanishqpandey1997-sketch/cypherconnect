// ============================================
// CypherConnect — SVG Icon System
// ============================================
// All icons are inline SVGs for crisp rendering at any size.
// Usage: Icons.mic()  →  returns SVG string
//        Icons.mic('w-5 h-5')  →  with custom class
//        Icons.mic('', 20)  →  with custom size

const Icons = {
  // Helper to wrap SVG
  _svg(paths, cls = '', size = 20, viewBox = '0 0 24 24', fill = 'none', stroke = 'currentColor') {
    return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="${viewBox}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  },

  // ── CypherConnect Logo (custom) ──────────────────────────
  logo(cls = '', size = 32) {
    return `<svg class="icon-logo ${cls}" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF6B3D"/>
          <stop offset="100%" stop-color="#E55A2F"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#logo-grad)" opacity="0.15"/>
      <circle cx="24" cy="24" r="22" stroke="url(#logo-grad)" stroke-width="2" fill="none"/>
      <path d="M24 12 C22 12 18 13 18 18 L18 28 C18 31 20 33 24 33 C28 33 30 31 30 28 L30 18 C30 13 26 12 24 12Z" fill="url(#logo-grad)" opacity="0.3"/>
      <rect x="21" y="10" width="6" height="18" rx="3" fill="url(#logo-grad)"/>
      <path d="M17 24 C17 28.5 20 32 24 32 C28 32 31 28.5 31 24" stroke="url(#logo-grad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="24" y1="32" x2="24" y2="38" stroke="url(#logo-grad)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="20" y1="38" x2="28" y2="38" stroke="url(#logo-grad)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`;
  },

  // ── Favicon SVG ──────────────────────────────────────────
  faviconSvg() {
    return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><defs><linearGradient id='fg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23FF6B3D'/><stop offset='100%25' stop-color='%23E55A2F'/></linearGradient></defs><circle cx='24' cy='24' r='22' fill='url(%23fg)' opacity='0.15'/><circle cx='24' cy='24' r='22' stroke='url(%23fg)' stroke-width='2' fill='none'/><rect x='21' y='10' width='6' height='18' rx='3' fill='url(%23fg)'/><path d='M17 24C17 28.5 20 32 24 32C28 32 31 28.5 31 24' stroke='url(%23fg)' stroke-width='2.5' fill='none' stroke-linecap='round'/><line x1='24' y1='32' x2='24' y2='38' stroke='url(%23fg)' stroke-width='2.5' stroke-linecap='round'/><line x1='20' y1='38' x2='28' y2='38' stroke='url(%23fg)' stroke-width='2.5' stroke-linecap='round'/></svg>`;
  },

  // ── Navigation / General ─────────────────────────────────
  home(cls = '', size = 20) {
    return this._svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', cls, size);
  },

  search(cls = '', size = 20) {
    return this._svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', cls, size);
  },

  menu(cls = '', size = 20) {
    return this._svg('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>', cls, size);
  },

  close(cls = '', size = 20) {
    return this._svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', cls, size);
  },

  chevronDown(cls = '', size = 20) {
    return this._svg('<polyline points="6 9 12 15 18 9"/>', cls, size);
  },

  arrowRight(cls = '', size = 20) {
    return this._svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', cls, size);
  },

  externalLink(cls = '', size = 20) {
    return this._svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>', cls, size);
  },

  // ── Music / Artists ──────────────────────────────────────
  mic(cls = '', size = 20) {
    return this._svg('<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>', cls, size);
  },

  musicNote(cls = '', size = 20) {
    return this._svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', cls, size);
  },

  headphones(cls = '', size = 20) {
    return this._svg('<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>', cls, size);
  },

  guitar(cls = '', size = 20) {
    return this._svg('<path d="M20 4L4 20M16 4l4 4M14.5 9.5l-5 5M5 15a4 4 0 0 0 4 4"/><circle cx="6" cy="18" r="2"/>', cls, size);
  },

  play(cls = '', size = 20) {
    return this._svg('<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>', cls, size, '0 0 24 24', 'currentColor', 'none');
  },

  // ── Events / Calendar ────────────────────────────────────
  calendar(cls = '', size = 20) {
    return this._svg('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', cls, size);
  },

  clock(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', cls, size);
  },

  ticket(cls = '', size = 20) {
    return this._svg('<path d="M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="13" y1="5" x2="13" y2="9"/><line x1="13" y1="15" x2="13" y2="19"/>', cls, size);
  },

  // ── Location ─────────────────────────────────────────────
  mapPin(cls = '', size = 20) {
    return this._svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', cls, size);
  },

  // ── Social / Communication ───────────────────────────────
  heart(cls = '', size = 20) {
    return this._svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', cls, size);
  },

  heartFilled(cls = '', size = 20) {
    return this._svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>', cls, size);
  },

  messageCircle(cls = '', size = 20) {
    return this._svg('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>', cls, size);
  },

  mail(cls = '', size = 20) {
    return this._svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>', cls, size);
  },

  send(cls = '', size = 20) {
    return this._svg('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', cls, size);
  },

  share(cls = '', size = 20) {
    return this._svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>', cls, size);
  },

  link(cls = '', size = 20) {
    return this._svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>', cls, size);
  },

  // ── Users / Account ──────────────────────────────────────
  user(cls = '', size = 20) {
    return this._svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', cls, size);
  },

  users(cls = '', size = 20) {
    return this._svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', cls, size);
  },

  // ── AI / Bot ─────────────────────────────────────────────
  sparkles(cls = '', size = 20) {
    return this._svg('<path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" fill="currentColor" stroke="none"/>', cls, size, '0 0 24 24', 'currentColor', 'none');
  },

  bot(cls = '', size = 20) {
    return this._svg('<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="11"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/>', cls, size);
  },

  // ── Status / Feedback ────────────────────────────────────
  star(cls = '', size = 20) {
    return this._svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/>', cls, size, '0 0 24 24', 'currentColor', 'none');
  },

  starOutline(cls = '', size = 20) {
    return this._svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', cls, size);
  },

  check(cls = '', size = 20) {
    return this._svg('<polyline points="20 6 9 17 4 12"/>', cls, size);
  },

  checkCircle(cls = '', size = 20) {
    return this._svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', cls, size);
  },

  alertCircle(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', cls, size);
  },

  // ── Security / Privacy ───────────────────────────────────
  lock(cls = '', size = 20) {
    return this._svg('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', cls, size);
  },

  shield(cls = '', size = 20) {
    return this._svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', cls, size);
  },

  eye(cls = '', size = 20) {
    return this._svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>', cls, size);
  },

  // ── Media / Content ──────────────────────────────────────
  image(cls = '', size = 20) {
    return this._svg('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', cls, size);
  },

  camera(cls = '', size = 20) {
    return this._svg('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>', cls, size);
  },

  // ── Actions ──────────────────────────────────────────────
  handshake(cls = '', size = 20) {
    return this._svg('<path d="M7 11L12 6L14 8L9 13" stroke-width="2"/><path d="M17 11L12 6L10 8L15 13" stroke-width="2"/><path d="M2 12h4M22 12h-4"/><path d="M6 8l-4 4 4 4M18 8l4 4-4 4"/>', cls, size);
  },

  zap(cls = '', size = 20) {
    return this._svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"/>', cls, size, '0 0 24 24', 'currentColor', 'none');
  },

  rocket(cls = '', size = 20) {
    return this._svg('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>', cls, size);
  },

  save(cls = '', size = 20) {
    return this._svg('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>', cls, size);
  },

  list(cls = '', size = 20) {
    return this._svg('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>', cls, size);
  },

  grid(cls = '', size = 20) {
    return this._svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', cls, size);
  },

  // ── Social Media ─────────────────────────────────────────
  instagram(cls = '', size = 20) {
    return this._svg('<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>', cls, size);
  },

  youtube(cls = '', size = 20) {
    return this._svg('<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>', cls, size);
  },

  twitter(cls = '', size = 20) {
    return this._svg('<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>', cls, size);
  },

  spotify(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><path d="M8 15c3-1 6-1 9 1" stroke-width="1.5"/><path d="M7 12c4-1.5 8-1.5 12 1" stroke-width="1.5"/><path d="M6 9c5-2 10-2 15 1" stroke-width="1.5"/>', cls, size);
  },

  soundcloud(cls = '', size = 20) {
    return this._svg('<path d="M3 18v-4m3 4v-6m3 6v-8m3 8V8m3 10V6"/><path d="M18 10a4 4 0 1 1 0 8h-3V10z"/>', cls, size);
  },

  disc(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>', cls, size);
  },

  github(cls = '', size = 20) {
    return this._svg('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>', cls, size);
  },

  google(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>', cls, size);
  },

  // ── Misc / Info ──────────────────────────────────────────
  info(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>', cls, size);
  },

  ban(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>', cls, size);
  },

  toggle(cls = '', size = 20) {
    return this._svg('<rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="16" cy="12" r="3" fill="currentColor"/>', cls, size);
  },

  filter(cls = '', size = 20) {
    return this._svg('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>', cls, size);
  },

  plus(cls = '', size = 20) {
    return this._svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>', cls, size);
  },

  settings(cls = '', size = 20) {
    return this._svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>', cls, size);
  },

  logOut(cls = '', size = 20) {
    return this._svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', cls, size);
  },

  tag(cls = '', size = 20) {
    return this._svg('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>', cls, size);
  },

  // Helper: inline icon with text
  withText(iconFn, text, cls = '') {
    return `<span class="icon-text ${cls}">${iconFn}${text}</span>`;
  }
};
