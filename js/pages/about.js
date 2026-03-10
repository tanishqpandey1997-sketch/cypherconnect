// ============================================
// CypherConnect — About / Contact / FAQ Page
// ============================================

const AboutPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main class="page-content">
      <div class="container">
        <div class="page-header text-center">
          <h1>About <span class="text-purple">CypherConnect</span></h1>
          <p style="margin: 0 auto;">Connecting underground artists across India — one beat at a time.</p>
        </div>

        <!-- Mission -->
        <section class="section" style="padding-top:0;">
          <div class="about-grid">
            <div>
              <h2 style="margin-bottom: var(--space-4);">Our Mission</h2>
              <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: var(--space-4);">
                CypherConnect exists to bridge the gap between underground artists — hip-hop MCs, ghazal vocalists, 
                and singer-songwriters — and the community that supports them. We believe every artist deserves a 
                platform to be discovered, a community to belong to, and opportunities to perform.
              </p>
              <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: var(--space-4);">
                Our platform makes it easy to find collaborators, discover open mics and events, and connect with 
                fellow musicians who share your passion. Whether you're dropping bars in Delhi, singing ghazals in 
                Lucknow, or writing songs in Bengaluru — CypherConnect is your stage.
              </p>

              <h3 style="margin: var(--space-8) 0 var(--space-4);">Code of Conduct</h3>
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-6);">
                <ul style="color: var(--text-secondary); line-height: 2; list-style: none;">
                  <li>${Icons.handshake('', 16)} <strong>Respect</strong> — Treat every artist with dignity regardless of genre, skill level, or background.</li>
                  <li>${Icons.musicNote('', 16)} <strong>Originality</strong> — Share original work and give credit where due.</li>
                  <li>${Icons.ban('', 16)} <strong>No Spam</strong> — Keep promotions relevant and community-focused.</li>
                  <li>${Icons.lock('', 16)} <strong>Privacy</strong> — Never share another artist's contact info without consent.</li>
                  <li>${Icons.messageCircle('', 16)} <strong>Constructive Feedback</strong> — Build up, don't tear down.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 style="margin-bottom: var(--space-4);">FAQ</h2>
              <div id="faq-container">
                ${this.renderFAQs()}
              </div>
            </div>
          </div>
        </section>

        <!-- Privacy & AI -->
        <section class="section">
          <div style="background: linear-gradient(135deg, rgba(138,75,255,0.08), rgba(0,230,255,0.05)); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: var(--space-8);">
            <h2 style="margin-bottom: var(--space-6);">${Icons.lock('', 24)} Privacy & AI Transparency</h2>
            <div class="about-grid" style="gap: var(--space-8);">
              <div>
                <h4 style="margin-bottom: var(--space-3); color: var(--teal);">How AI Matching Works</h4>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                  Our AI matchmaker suggests collaborators based on <strong>public profile data only</strong> — your genres, 
                  skills, city, and availability. It uses a simple scoring algorithm (not machine learning) to find complementary artists.
                </p>
                <ul style="color: var(--text-secondary); line-height: 2; margin-top: var(--space-3); list-style:none;">
                  <li>${Icons.checkCircle('', 14)} Shared genre: +3 points</li>
                  <li>${Icons.checkCircle('', 14)} Same city: +2 points</li>
                  <li>${Icons.checkCircle('', 14)} Complementary skills: +2 points</li>
                  <li>${Icons.checkCircle('', 14)} Both available: +1 point</li>
                </ul>
              </div>
              <div>
                <h4 style="margin-bottom: var(--space-3); color: var(--orange);">Your Controls</h4>
                <ul style="color: var(--text-secondary); line-height: 2; list-style:none;">
                  <li>${Icons.toggle('', 16)} <strong>Opt-in only</strong> — AI matching is off by default. Enable it in your settings.</li>
                  <li>${Icons.toggle('', 16)} <strong>Opt-out anytime</strong> — Disable matching from your account dashboard.</li>
                  <li>${Icons.toggle('', 16)} <strong>No auto-actions</strong> — AI never sends messages, books venues, or makes decisions for you.</li>
                  <li>${Icons.eye('', 16)} <strong>Explainable</strong> — Every suggestion comes with a clear reason why.</li>
                  <li>${Icons.user('', 16)} <strong>Human approval</strong> — You review and approve every match request.</li>
                </ul>
                <div class="badge badge-success" style="margin-top: var(--space-4); padding: var(--space-3);">
                  ${Icons.shield('', 16)} AI suggests matches based on public data — you control messages and bookings.
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact -->
        <section class="section">
          <div class="about-grid">
            <div>
              <h2 style="margin-bottom: var(--space-6);">Contact Us</h2>
              <form class="contact-form" id="contact-form">
                <div>
                  <label>Name</label>
                  <input type="text" class="input" placeholder="Your name" required>
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" class="input" placeholder="you@example.com" required>
                </div>
                <div>
                  <label>Subject</label>
                  <select class="select">
                    <option>General Inquiry</option>
                    <option>Partner / Sponsor</option>
                    <option>Press / Media</option>
                    <option>Report an Issue</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div>
                  <label>Message</label>
                  <textarea class="textarea" rows="4" placeholder="Your message..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">${Icons.send('', 16)} Send Message</button>
              </form>
            </div>
            <div>
              <h2 style="margin-bottom: var(--space-6);">Get In Touch</h2>
              <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-6);">
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: var(--space-4);">
                  We'd love to hear from organizers, sponsors, and media. CypherConnect is community-driven 
                  and always open to partnerships that benefit underground artists.
                </p>
                <div style="display:flex; flex-direction:column; gap: var(--space-3);">
                  <div class="flex items-center gap-3">${Icons.mail('', 18)} <span style="color:var(--text-secondary);">hello@cypherconnect.in</span></div>
                  <div class="flex items-center gap-3">${Icons.instagram('', 18)} <span style="color:var(--text-secondary);">@cypherconnect</span></div>
                  <div class="flex items-center gap-3">${Icons.twitter('', 18)} <span style="color:var(--text-secondary);">@cypherconnect</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    this.initFAQ();
    this.initContactForm();
  },

  renderFAQs() {
    const faqs = [
      { q: 'Is CypherConnect free?', a: 'Yes! CypherConnect is free for all artists. We believe in keeping the platform accessible to grassroots talent.' },
      { q: 'How do I get featured?', a: 'Featured status is awarded to active community members who regularly perform, collaborate, and contribute. Stay active and engage with the community!' },
      { q: 'Can I list my event?', a: 'Absolutely! Go to the Events page and click "Create Event." Your event will be reviewed by our team before going live to ensure quality.' },
      { q: 'How does AI matching work?', a: 'Our matchmaker uses a simple scoring algorithm based on shared genres, location, and complementary skills. It\'s opt-in only and fully transparent — every suggestion explains why.' },
      { q: 'Is my data safe?', a: 'We only use your public profile data for matching. We never sell data or share it with third parties. You can opt out of AI features anytime.' },
      { q: 'Can I delete my account?', a: 'Yes, you can delete your account and all associated data from your account settings at any time.' }
    ];
    return faqs.map((faq, i) => `
      <div class="faq-item" id="faq-${i}">
        <button class="faq-question" aria-expanded="false">
          ${faq.q}
          <span class="faq-icon">${Icons.chevronDown('', 16)}</span>
        </button>
        <div class="faq-answer">${faq.a}</div>
      </div>
    `).join('');
  },

  initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
        btn.setAttribute('aria-expanded', !wasOpen);
      });
    });
  },

  initContactForm() {
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Utils.showToast('Message sent! We\'ll get back to you soon.', 'success');
      e.target.reset();
    });
  }
};
