// ============================================
// CypherConnect — Account & Onboarding Page
// ============================================

const AccountPage = {
  mode: 'signin', // signin | signup | onboarding | dashboard

  render() {
    if (Utils.isLoggedIn()) {
      this.mode = 'dashboard';
    }
    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main class="page-content">
      <div class="container">
        ${this.mode === 'dashboard' ? this.renderDashboard() : this.renderAuth()}
      </div>
    </main>
    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    this.initEvents();
  },

  renderAuth() {
    return `
      <div class="auth-container" style="padding-top: var(--space-8);">
        <div class="text-center" style="margin-bottom: var(--space-8);">
          <h1>Join <span class="text-purple">CypherConnect</span></h1>
          <p class="text-muted">Connect, collab, perform.</p>
        </div>
        <div class="auth-card">
          <div class="auth-tabs">
            <button class="auth-tab ${this.mode === 'signin' ? 'active' : ''}" data-tab="signin">Sign In</button>
            <button class="auth-tab ${this.mode === 'signup' ? 'active' : ''}" data-tab="signup">Sign Up</button>
          </div>

          <!-- Sign In Form -->
          <div id="signin-form" style="${this.mode === 'signup' ? 'display:none;' : ''}">
            <form class="auth-form" id="signin-submit">
              <div><label>Email</label><input type="email" class="input" placeholder="you@example.com" required></div>
              <div><label>Password</label><input type="password" class="input" placeholder="Your password" required></div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Sign In</button>
            </form>
            <div class="divider">or continue with</div>
            <div class="social-login">
              <button class="social-btn" onclick="AccountPage.socialLogin('Google')">${Icons.google('', 18)} Google</button>
              <button class="social-btn" onclick="AccountPage.socialLogin('GitHub')">${Icons.github('', 18)} GitHub</button>
            </div>
          </div>

          <!-- Sign Up Form -->
          <div id="signup-form" style="${this.mode === 'signin' ? 'display:none;' : ''}">
            <form class="auth-form" id="signup-submit">
              <div><label>Full Name</label><input type="text" class="input" id="signup-name" placeholder="Your name" required></div>
              <div><label>Email</label><input type="email" class="input" id="signup-email" placeholder="you@example.com" required></div>
              <div><label>Password</label><input type="password" class="input" placeholder="Create a password" required></div>
              <div><label>I am a...</label>
                <select class="select" id="signup-role">
                  <option value="artist">Artist / Performer</option>
                  <option value="organizer">Event Organizer</option>
                  <option value="fan">Fan / Audience</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Create Account</button>
            </form>
            <div class="divider">or continue with</div>
            <div class="social-login">
              <button class="social-btn" onclick="AccountPage.socialLogin('Google')">${Icons.google('', 18)} Google</button>
              <button class="social-btn" onclick="AccountPage.socialLogin('GitHub')">${Icons.github('', 18)} GitHub</button>
            </div>
          </div>
        </div>
      </div>`;
  },

  renderDashboard() {
    const user = Utils.getUser();
    return `
      <div style="max-width: 800px; margin: 0 auto; padding-top: var(--space-8);">
        <div class="flex items-center justify-between" style="margin-bottom: var(--space-8);">
          <div>
            <h1>Welcome, <span class="text-purple">${user.name}</span></h1>
            <p class="text-muted">${user.email} · ${user.role}</p>
          </div>
          <button class="btn btn-ghost btn-sm" id="logout-btn">${Icons.logOut('', 16)} Sign Out</button>
        </div>

        <!-- Quick Stats -->
        <div class="action-cards" style="margin-bottom: var(--space-8);">
          <div class="action-card" style="cursor:default;">
            <div class="action-card-icon">${Icons.musicNote('', 28)}</div>
            <h3>3</h3><p>Artists Followed</p>
          </div>
          <div class="action-card" style="cursor:default;">
            <div class="action-card-icon">${Icons.calendar('', 28)}</div>
            <h3>2</h3><p>Events RSVPed</p>
          </div>
          <div class="action-card" style="cursor:default;">
            <div class="action-card-icon">${Icons.handshake('', 28)}</div>
            <h3>1</h3><p>Collab Requests</p>
          </div>
        </div>

        <!-- Onboarding / Profile Settings -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
          <h3 style="margin-bottom: var(--space-4);">${Icons.settings('', 20)} Profile Settings</h3>
          <form class="auth-form" id="profile-form">
            <div class="flex gap-4">
              <div style="flex:1;"><label>Genres</label>
                <div class="flex flex-wrap gap-2">
                  <label class="checkbox-group"><input type="checkbox" value="Hip-Hop" ${user.genres?.includes('Hip-Hop') ? 'checked' : ''}> Hip-Hop</label>
                  <label class="checkbox-group"><input type="checkbox" value="Ghazal" ${user.genres?.includes('Ghazal') ? 'checked' : ''}> Ghazal</label>
                  <label class="checkbox-group"><input type="checkbox" value="Singer-Songwriter" ${user.genres?.includes('Singer-Songwriter') ? 'checked' : ''}> Singer-Songwriter</label>
                </div>
              </div>
              <div style="flex:1;"><label>City</label>
                <input type="text" class="input" id="profile-city" value="${user.city || ''}" placeholder="Your city">
              </div>
            </div>
            <div>
              <label>Skills</label>
              <div class="flex flex-wrap gap-2">
                ${['Vocalist','Lyricist','Producer','Guitarist','Songwriter','Beat Maker','Composer','Mixing Engineer'].map(s =>
                  `<label class="checkbox-group"><input type="checkbox" value="${s}" ${user.skills?.includes(s) ? 'checked' : ''}> ${s}</label>`
                ).join('')}
              </div>
            </div>
            <div>
              <label>Bio</label>
              <textarea class="textarea" rows="3" placeholder="Tell us about yourself...">${user.bio || ''}</textarea>
            </div>
          </form>
        </div>

        <!-- AI Opt-in -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6); border-color: var(--purple); background: linear-gradient(135deg, rgba(138,75,255,0.05), transparent);">
          <div class="flex items-center gap-3" style="margin-bottom: var(--space-4);">
            ${Icons.bot('', 24)}
            <h3 style="margin:0;">AI Matchmaking</h3>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-4); line-height: 1.7;">
            Enable AI-powered collaborator suggestions based on your genre, skills, and location. 
            All suggestions are transparent and require your manual approval.
          </p>
          <label class="checkbox-group" style="margin-bottom: var(--space-3);">
            <input type="checkbox" id="ai-optin" ${user.aiOptIn ? 'checked' : ''}>
            <span>I consent to AI matchmaking using my public profile data</span>
          </label>
          <label class="checkbox-group">
            <input type="checkbox" id="social-scan" ${user.socialScan ? 'checked' : ''}>
            <span>Allow scanning of linked social profiles for better matches</span>
          </label>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-3);">
            ${Icons.lock('', 12)} You can opt out anytime. AI never auto-messages or auto-books on your behalf.
            <a data-route="#/about">Learn more ${Icons.arrowRight('', 10)}</a>
          </p>
        </div>

        <button class="btn btn-primary" id="save-profile-btn" style="width:100%;">${Icons.save('', 16)} Save Profile</button>
      </div>`;
  },

  socialLogin(provider) {
    Utils.showToast(`${provider} sign-in is a demo placeholder.`, 'info');
  },

  initEvents() {
    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const isSignin = tab.dataset.tab === 'signin';
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        if (signinForm) signinForm.style.display = isSignin ? '' : 'none';
        if (signupForm) signupForm.style.display = isSignin ? 'none' : '';
      });
    });

    // Sign In
    document.getElementById('signin-submit')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Utils.store.set('user', { name: 'Demo User', email: 'demo@cypherconnect.in', role: 'Artist', genres: ['Hip-Hop'], skills: ['Vocalist'], city: 'Delhi', aiOptIn: true, socialScan: false, bio: '' });
      Utils.showToast('Welcome back!', 'success');
      setTimeout(() => this.render(), 500);
    });

    // Sign Up
    document.getElementById('signup-submit')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value || 'New Artist';
      const email = document.getElementById('signup-email')?.value || '';
      const role = document.getElementById('signup-role')?.value || 'artist';
      Utils.store.set('user', { name, email, role, genres: [], skills: [], city: '', aiOptIn: false, socialScan: false, bio: '' });
      Utils.showToast(`Welcome to CypherConnect, ${name}!`, 'success');
      setTimeout(() => this.render(), 500);
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Utils.store.remove('user');
      Utils.showToast('Signed out. See you next time!', 'info');
      this.mode = 'signin';
      setTimeout(() => this.render(), 500);
    });

    // Save profile
    document.getElementById('save-profile-btn')?.addEventListener('click', () => {
      const user = Utils.getUser() || {};
      user.city = document.getElementById('profile-city')?.value || '';
      user.aiOptIn = document.getElementById('ai-optin')?.checked || false;
      user.socialScan = document.getElementById('social-scan')?.checked || false;
      Utils.store.set('user', user);
      Utils.showToast('Profile saved!', 'success');
    });
  }
};

// ============================================
// 404 Page
// ============================================
const NotFoundPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main class="page-content">
      <div class="container text-center" style="padding: var(--space-20) 0;">
        ${Icons.mic('', 64)}
        <h2 style="margin-top: var(--space-4); margin-bottom: var(--space-4);">Page Not Found</h2>
        <p class="text-muted" style="margin-bottom: var(--space-8);">The beat you're looking for doesn't exist... yet.</p>
        <button class="btn btn-primary btn-lg" data-route="#/">${Icons.home('', 18)} Back to Home</button>
      </div>
    </main>
    ${Layout.renderFooter()}`;
    Layout.initNavbar();
  }
};
