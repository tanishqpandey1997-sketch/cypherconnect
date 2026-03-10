// ============================================
// CypherConnect — Community Hub Page
// ============================================

const CommunityPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
    ${Layout.renderNavbar()}
    <main class="page-content">
      <div class="container" style="max-width: 800px;">
        <div class="page-header text-center">
          <h1>Community Hub</h1>
          <p style="margin: 0 auto;">Announcements, collab calls, and conversations from the CypherConnect community.</p>
        </div>

        <!-- Post Composer -->
        <div class="card" style="margin-bottom: var(--space-8); padding: var(--space-6);">
          <div class="flex gap-3" style="margin-bottom: var(--space-4);">
            <div style="width:44px;height:44px;background:var(--gradient-purple);border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;">${Icons.mic('', 22)}</div>
            <textarea class="textarea" id="post-composer" placeholder="Share something with the community — a collab call, recording, or announcement..." rows="3" style="flex:1;"></textarea>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm" title="Add media">${Icons.camera('', 14)} Media</button>
              <button class="btn btn-ghost btn-sm" title="Tag genre">${Icons.musicNote('', 14)} Genre</button>
            </div>
            <button class="btn btn-primary btn-sm" id="post-submit-btn">${Icons.send('', 14)} Post</button>
          </div>
        </div>

        <!-- Feed -->
        <div class="flex flex-col gap-6" id="community-feed">
          ${AppData.posts.map(post => this.renderPost(post)).join('')}
        </div>
      </div>
    </main>
    ${Layout.renderFooter()}`;

    Layout.initNavbar();
    this.initComposer();
  },

  renderPost(post) {
    const typeBadge = Utils.postTypeBadge(post.type);
    return `
      <article class="post-card animate-fade-in-up">
        <div class="post-header">
          <div class="post-avatar">
            <img src="${post.author_photo}" alt="${post.author_name}">
          </div>
          <div>
            <div class="post-author-name">${post.author_name}</div>
            <div class="post-time">${Utils.timeAgo(post.created_at)}</div>
          </div>
          <div class="post-type-badge">
            <span class="badge ${typeBadge.class}">${typeBadge.label}</span>
          </div>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-body">${post.body}</p>
        <div class="post-actions">
          <button class="post-action" onclick="this.querySelector('span').textContent = parseInt(this.querySelector('span').textContent) + 1">
            ${Icons.heartFilled('', 16)} <span>${post.likes}</span>
          </button>
          <button class="post-action">
            ${Icons.messageCircle('', 16)} <span>${post.comments}</span> comments
          </button>
          <button class="post-action" onclick="Utils.showToast('Post shared!', 'info')">
            ${Icons.share('', 16)} Share
          </button>
        </div>
      </article>`;
  },

  initComposer() {
    document.getElementById('post-submit-btn')?.addEventListener('click', () => {
      const textarea = document.getElementById('post-composer');
      const text = textarea?.value?.trim();
      if (!text) {
        Utils.showToast('Write something before posting!', 'error');
        return;
      }
      const newPost = {
        id: Date.now(),
        author_id: 0,
        author_name: Utils.isLoggedIn() ? Utils.getUser().name : 'You',
        author_photo: 'images/artist_1_ayesha.png',
        title: text.split('\n')[0].slice(0, 60),
        body: text,
        media: null,
        created_at: new Date().toISOString(),
        type: 'announcement',
        likes: 0,
        comments: 0
      };
      const feed = document.getElementById('community-feed');
      if (feed) {
        feed.insertAdjacentHTML('afterbegin', this.renderPost(newPost));
      }
      textarea.value = '';
      Utils.showToast('Posted successfully!', 'success');
    });
  }
};
