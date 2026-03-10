// ============================================
// CypherConnect — CypherBot AI Agent
// ============================================
// Conversational AI powered by Google Gemini API
// with local NLP fallback when no API key is set.

const CypherBot = {
  isOpen: false,
  messages: [],
  conversationHistory: [],
  isTyping: false,
  apiKey: null,
  useAI: false,

  // ── Intent patterns (local NLP fallback) ───────
  intents: {
    greeting: {
      patterns: [/^(hi|hello|hey|sup|yo|what'?s up|howdy|namaste|hola)/i, /^(good\s*(morning|evening|afternoon|night))/i],
      handler: 'handleGreeting'
    },
    help: {
      patterns: [/\b(help|what can you do|commands|options|features|how to use)\b/i, /\b(guide|assist|support)\b/i],
      handler: 'handleHelp'
    },
    find_artist: {
      patterns: [
        /\b(find|search|show|list|who)\b.*\b(artist|rapper|singer|vocalist|producer|musician|beat\s*maker|lyricist|composer)\b/i,
        /\b(artist|rapper|singer|vocalist|producer|musician)\b.*\b(in|from|based)\b/i,
        /\b(find|search|show|list)\b.*\b(in|from)\s+(mumbai|delhi|bengaluru|bangalore|pune|lucknow|chennai|kolkata|hyderabad)\b/i,
        /\b(hip[\s-]?hop|ghazal|singer[\s-]?songwriter|rap|folk|acoustic|classical)\b.*\b(artist|singer|rapper|musician|performer)s?\b/i,
        /\b(who|show|list|find)\b.*\b(hip[\s-]?hop|ghazal|singer[\s-]?songwriter)\b/i,
      ],
      handler: 'handleFindArtist'
    },
    find_event: {
      patterns: [
        /\b(find|search|show|list|what|any|upcoming)\b.*\b(event|open\s*mic|cypher|jam|show|gig|concert|session)\b/i,
        /\bevent\b.*\b(in|from|at|near)\b/i,
        /\b(happening|going on|coming up)\b/i,
      ],
      handler: 'handleFindEvent'
    },
    match_collab: {
      patterns: [
        /\b(match|collab|collaborate|pair|team up|work with)\b/i,
        /\bwho should\b.*\b(collab|work|pair|team)\b/i,
        /\bfind.*(collab|partner|match)\b/i,
        /\bsugg.*(collab|partner|match)\b/i,
      ],
      handler: 'handleMatchCollab'
    },
    artist_info: {
      patterns: [
        /\b(tell|info|about|who is|know about|details|profile)\b/i,
      ],
      handler: 'handleArtistInfo'
    },
    event_info: {
      patterns: [
        /\b(tell|info|about|details)\b.*\b(event|open\s*mic|cypher|jam|show|gig)\b/i,
      ],
      handler: 'handleEventInfo'
    },
    about: {
      patterns: [
        /\b(what is|tell me about|explain)\s+(cypherconnect|this (app|platform|site|website))\b/i,
      ],
      handler: 'handleAbout'
    }
  },

  // ── Gemini API Integration ─────────────────────
  _buildSystemPrompt() {
    const artistSummary = AppData.artists.map(a =>
      `- ${a.name} (${a.genres.join(', ')}) from ${a.city}. Skills: ${a.skills.join(', ')}. ` +
      `${a.availability ? 'Available' : 'Busy'}. Bio: ${a.bio.substring(0, 120)}. ` +
      `Collab interests: ${a.collab_interests}. Slug: ${a.slug}`
    ).join('\n');

    const eventSummary = AppData.events.map(e =>
      `- "${e.title}" — ${e.genre} event at ${e.venue_name}, ${e.city} on ${e.date_time}. ` +
      `${e.rsvp_count} RSVPs, ${e.performer_slots} slots. ${e.description.substring(0, 100)}`
    ).join('\n');

    return `You are CypherBot, the AI collaboration agent for CypherConnect — India's underground music community platform connecting Hip-Hop, Ghazal, and Singer-Songwriter artists.

Your personality: Friendly, enthusiastic about music, knowledgeable about the underground scene. Use emojis naturally. Be concise but informative.

You help users with:
1. Finding artists by genre, city, or skills
2. Discovering upcoming events and open mics
3. Suggesting collaboration matches between artists
4. Providing detailed artist profiles and event info
5. General questions about CypherConnect

IMPORTANT FORMATTING RULES:
- Use **bold** for emphasis and names
- Use _italic_ for quotes and bios
- Use line breaks (\\n) for readability
- For artist profile links, use: [→ View Profile](#/artist/SLUG)
- Keep responses concise — no more than 200 words
- Use bullet points with • for lists
- Do NOT use markdown headers (##)

AVAILABLE DATA:

ARTISTS:
${artistSummary}

EVENTS:
${eventSummary}

COMMUNITY POSTS:
${AppData.posts.map(p => `- "${p.title}" by ${p.author_name} (${p.type})`).join('\n')}

When suggesting collabs, consider:
- Shared genres get matched
- Complementary skills (e.g., Vocalist + Producer)
- Same or nearby cities
- Both being available for collaboration

Always base your answers on the actual data above. If asked about artists or events not in our database, say so honestly.`;
  },

  async callGeminiAPI(userMsg) {
    const apiKey = this.apiKey;
    if (!apiKey) return null;

    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMsg }]
    });

    // Keep last 10 turns to avoid token limits
    const recentHistory = this.conversationHistory.slice(-20);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: this._buildSystemPrompt() }]
            },
            contents: recentHistory,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
              topP: 0.9,
              topK: 40
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', response.status, errData);
        if (response.status === 400 && errData?.error?.message?.includes('API key')) {
          return { error: 'invalid_key' };
        }
        if (response.status === 429) {
          return { error: 'rate_limited' };
        }
        if (response.status === 403) {
          return { error: 'forbidden' };
        }
        return { error: 'api_error', status: response.status };
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        // Add assistant response to conversation history
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text }]
        });
        return { text };
      }
      return { error: 'empty_response' };
    } catch (err) {
      console.error('Gemini API call failed:', err);
      return { error: 'network' };
    }
  },

  // ── Generate smart suggestions from AI response ──
  _generateSuggestions(text) {
    const suggestions = [];
    const lower = text.toLowerCase();

    // Context-aware suggestions based on response content
    if (lower.includes('artist') || lower.includes('singer') || lower.includes('rapper')) {
      const mentioned = AppData.artists.filter(a => lower.includes(a.name.toLowerCase()));
      if (mentioned.length > 0) {
        suggestions.push(`Collab match for ${mentioned[0].name.split(' ')[0]}`);
      }
      if (!lower.includes('event')) suggestions.push('Find events');
    }
    if (lower.includes('event') || lower.includes('open mic')) {
      suggestions.push('Browse artists');
    }
    if (lower.includes('collab')) {
      suggestions.push('Find events');
    }

    // Always add some defaults
    if (suggestions.length === 0) {
      suggestions.push('Find artists', 'Upcoming events', 'Suggest a collab');
    }
    if (suggestions.length < 3) {
      const defaults = ['Find artists', 'Upcoming events', 'Suggest a collab', 'Help'];
      for (const d of defaults) {
        if (!suggestions.includes(d) && suggestions.length < 4) suggestions.push(d);
      }
    }

    return suggestions.slice(0, 4);
  },

  // ── Entity extraction ─────────────────────────
  extractEntities(msg) {
    const lower = msg.toLowerCase();
    const entities = { cities: [], genres: [], skills: [], artistNames: [] };

    const cityMap = {
      'mumbai': 'Mumbai', 'delhi': 'Delhi', 'bengaluru': 'Bengaluru',
      'bangalore': 'Bengaluru', 'pune': 'Pune', 'lucknow': 'Lucknow',
      'chennai': 'Chennai', 'kolkata': 'Kolkata', 'hyderabad': 'Hyderabad'
    };
    for (const [key, val] of Object.entries(cityMap)) {
      if (lower.includes(key)) entities.cities.push(val);
    }

    if (/hip[\s-]?hop|rap|rapper|emcee|mc\b/i.test(lower)) entities.genres.push('Hip-Hop');
    if (/ghazal|classical|urdu/i.test(lower)) entities.genres.push('Ghazal');
    if (/singer[\s-]?songwriter|acoustic|folk|indie/i.test(lower)) entities.genres.push('Singer-Songwriter');

    const skillPatterns = {
      'Vocalist': /vocalist|singer|vocal/i, 'Producer': /producer|produce/i,
      'Lyricist': /lyricist|lyric/i, 'Beat Maker': /beat\s*maker|beatmaker/i,
      'Guitarist': /guitarist|guitar/i, 'Songwriter': /songwriter/i,
      'Composer': /composer|compose/i, 'Mixing Engineer': /mixing|mix\s*engineer/i,
    };
    for (const [skill, regex] of Object.entries(skillPatterns)) {
      if (regex.test(lower)) entities.skills.push(skill);
    }

    if (AppData.artists) {
      for (const artist of AppData.artists) {
        const nameLower = artist.name.toLowerCase();
        const nameParts = nameLower.split(/[\s"]+/).filter(p => p.length > 2);
        if (lower.includes(nameLower)) {
          entities.artistNames.push(artist.name);
        } else {
          for (const part of nameParts) {
            if (part.length > 3 && lower.includes(part)) {
              entities.artistNames.push(artist.name);
              break;
            }
          }
        }
      }
    }
    return entities;
  },

  // ── Detect intent (local NLP) ─────────────────
  detectIntent(msg) {
    const entities = this.extractEntities(msg);
    if (entities.artistNames.length > 0) {
      if (/\b(tell|about|who|info|details|profile|know)\b/i.test(msg)) return 'artist_info';
    }
    const priorityOrder = ['greeting', 'help', 'about', 'event_info', 'find_event', 'match_collab', 'find_artist', 'artist_info'];
    for (const intentName of priorityOrder) {
      const intent = this.intents[intentName];
      if (intent.patterns.some(p => p.test(msg))) return intentName;
    }
    if (entities.artistNames.length > 0) return 'artist_info';
    if (entities.genres.length > 0 || entities.cities.length > 0) return 'find_artist';
    return 'unknown';
  },

  // ── Inline icon helper (renders SVG in text) ──
  _i(name, size = 14) {
    const map = {
      mic: Icons.mic, music: Icons.musicNote, cal: Icons.calendar,
      handshake: Icons.handshake, user: Icons.user, info: Icons.info,
      pin: Icons.mapPin, sparkles: Icons.sparkles, star: Icons.star,
      users: Icons.users, mail: Icons.mail, search: Icons.search,
      chat: Icons.messageCircle, settings: Icons.settings, list: Icons.list,
      tag: Icons.tag, zap: Icons.zap, lock: Icons.lock, close: Icons.close,
      check: Icons.checkCircle, alert: Icons.alertCircle, play: Icons.play,
      headphones: Icons.headphones, heart: Icons.heart, rocket: Icons.rocket,
    };
    const fn = map[name];
    return fn ? fn('cb-icon', size) : '';
  },

  // ── Local response handlers ───────────────────
  handleGreeting() {
    const mic = this._i('mic');
    const zap = this._i('zap');
    const music = this._i('music');
    const greetings = [
      `Hey! ${mic} I'm **CypherBot**, your AI matchmaker for the underground music scene. Ask me anything about artists, events, or collaborations!`,
      `Yo! ${zap} Welcome to CypherConnect. I can help you find artists, discover events, or suggest perfect collabs. What are you looking for?`,
      `Namaste! ${music} I'm CypherBot — think of me as your personal music scene navigator. What can I help you with today?`,
    ];
    return { text: greetings[Math.floor(Math.random() * greetings.length)], suggestions: ['Find artists', 'Upcoming events', 'Suggest a collab', 'About CypherConnect'] };
  },

  handleHelp() {
    return {
      text: `Here's what I can do for you ${this._i('sparkles')}\n\n${this._i('mic')} **Find Artists** — "Show me rappers in Delhi"\n${this._i('cal')} **Find Events** — "What events are happening in Mumbai?"\n${this._i('handshake')} **Suggest Collabs** — "Who should Ayesha collaborate with?"\n${this._i('user')} **Artist Info** — "Tell me about Riaz Ansari"\n${this._i('info')} **About** — "What is CypherConnect?"\n\nJust type naturally — I'll figure out what you need!`,
      suggestions: ['Find rappers', 'Events in Delhi', 'Suggest a collab', 'About CypherConnect']
    };
  },

  handleAbout() {
    return {
      text: `**CypherConnect** is India's underground music community platform ${this._i('music')}\n\nWe connect **Hip-Hop**, **Ghazal**, and **Singer-Songwriter** artists for:\n• ${this._i('search')} **Discovery** — Find talented artists across India\n• ${this._i('handshake')} **Collaboration** — Get matched with complementary artists\n• ${this._i('mic')} **Events** — Discover open mics, cyphers, and jam sessions\n• ${this._i('chat')} **Community** — Share your work and connect with peers\n\nCurrently featuring **${AppData.artists.length} artists** and **${AppData.events.length} upcoming events**!`,
      suggestions: ['Browse artists', 'View events', 'Find a collab match']
    };
  },

  handleFindArtist(msg) {
    const entities = this.extractEntities(msg);
    let results = [...AppData.artists];
    let filterDesc = [];
    if (entities.genres.length > 0) {
      results = results.filter(a => a.genres.some(g => entities.genres.includes(g)));
      filterDesc.push(entities.genres.join(' / '));
    }
    if (entities.cities.length > 0) {
      results = results.filter(a => entities.cities.includes(a.city));
      filterDesc.push(`in ${entities.cities.join(', ')}`);
    }
    if (entities.skills.length > 0) {
      results = results.filter(a => a.skills.some(s => entities.skills.includes(s)));
      filterDesc.push(`with skills: ${entities.skills.join(', ')}`);
    }
    if (results.length === 0) {
      return { text: `I couldn't find any artists matching ${filterDesc.join(' ')} 😕\n\nTry broadening your search!`, suggestions: ['Show all artists', 'Hip-Hop artists', 'Ghazal singers', 'Events near me'] };
    }
    const header = filterDesc.length > 0 ? `Found **${results.length} artist${results.length > 1 ? 's' : ''}** ${filterDesc.join(' ')} ${this._i('music')}\n\n` : `Here are all **${results.length} artists** on CypherConnect ${this._i('music')}\n\n`;
    const cards = results.map(a => {
      const status = a.availability ? '<span class="cb-dot cb-dot-green"></span> Open for collab' : '<span class="cb-dot cb-dot-red"></span> Currently busy';
      return `**${a.name}** — ${a.genres.join(', ')}\n${this._i('pin')} ${a.city} · ${status}\n_${a.bio.substring(0, 100)}..._\n[→ View Profile](#/artist/${a.slug})`;
    }).join('\n\n---\n\n');
    return { text: header + cards, suggestions: this._buildArtistSuggestions(results) };
  },

  handleFindEvent(msg) {
    const entities = this.extractEntities(msg);
    let results = [...AppData.events];
    let filterDesc = [];
    if (entities.genres.length > 0) {
      results = results.filter(e => entities.genres.some(g => g.toLowerCase() === e.genre.toLowerCase()));
      filterDesc.push(entities.genres.join(' / '));
    }
    if (entities.cities.length > 0) {
      results = results.filter(e => entities.cities.includes(e.city));
      filterDesc.push(`in ${entities.cities.join(', ')}`);
    }
    if (results.length === 0) {
      return { text: `No events found ${filterDesc.length > 0 ? 'for ' + filterDesc.join(' ') : ''} 😕\n\nCheck back soon!`, suggestions: ['All events', 'Hip-Hop events', 'Ghazal events', 'Find artists'] };
    }
    const header = filterDesc.length > 0 ? `Found **${results.length} event${results.length > 1 ? 's' : ''}** ${filterDesc.join(' ')} ${this._i('cal')}\n\n` : `Here are all **${results.length} upcoming events** ${this._i('cal')}\n\n`;
    const cards = results.map(e => {
      return `${this._i('mic')} **${e.title}**\n${this._i('pin')} ${e.venue_name}, ${e.city}\n${this._i('cal')} ${Utils.formatDate(e.date_time)} at ${Utils.formatTime(e.date_time)}\n${this._i('users')} ${e.rsvp_count} RSVPs · ${e.performer_slots} slots\n_${e.description.substring(0, 100)}..._`;
    }).join('\n\n---\n\n');
    return { text: header + cards, suggestions: ['Find artists for this event', 'View all events', 'Browse artists'] };
  },

  handleMatchCollab(msg) {
    const entities = this.extractEntities(msg);
    if (entities.artistNames.length > 0) {
      const artist = AppData.artists.find(a => a.name === entities.artistNames[0]);
      if (artist) {
        const matches = Matchmaker.getMatches(artist, AppData.artists, 3);
        if (matches.length === 0) return { text: `I couldn't find strong collab matches for **${artist.name}** right now ${this._i('sparkles')}`, suggestions: ['Find artists', 'View events', 'Help'] };
        let text = `${this._i('handshake')} Top matches for **${artist.name}** (${artist.genres.join(', ')} · ${artist.city}):\n\n`;
        matches.forEach((m, i) => {
          text += `**${i + 1}. ${m.artist.name}** — ${this._i('star').repeat(Math.min(m.score, 5))}\n${this._i('pin')} ${m.artist.city} · ${m.artist.genres.join(', ')}\n${this._i('sparkles')} ${m.reasons.join(' · ')}\n[→ View Profile](#/artist/${m.artist.slug})\n\n`;
        });
        text += `${this._i('zap')} **${artist.name}'s interests:** _"${artist.collab_interests}"_`;
        return { text, suggestions: matches.map(m => `About ${m.artist.name}`).concat(['Find events']) };
      }
    }
    let text = `I'd love to help with collab matching! ${this._i('handshake')}\n\nTry asking about a specific artist:\n`;
    text += AppData.artists.slice(0, 3).map(a => `• _"Who should ${a.name} collaborate with?"_`).join('\n');
    return { text, suggestions: AppData.artists.slice(0, 4).map(a => `Match for ${a.name.split(' ')[0]}`) };
  },

  handleArtistInfo(msg) {
    const entities = this.extractEntities(msg);
    if (entities.artistNames.length === 0) {
      return { text: `Which artist would you like to know about?\n\n` + AppData.artists.map(a => `• **${a.name}** — ${a.genres.join(', ')} · ${a.city}`).join('\n'), suggestions: AppData.artists.slice(0, 4).map(a => `About ${a.name.split(' ')[0]}`) };
    }
    const artist = AppData.artists.find(a => a.name === entities.artistNames[0]);
    if (!artist) return { text: `Couldn't find that artist. Try:\n` + AppData.artists.map(a => `• ${a.name}`).join('\n'), suggestions: AppData.artists.slice(0, 4).map(a => `About ${a.name.split(' ')[0]}`) };
    const status = artist.availability ? '<span class="cb-dot cb-dot-green"></span> Open for collaboration' : '<span class="cb-dot cb-dot-red"></span> Currently busy';
    const events = (artist.upcoming_events || []).map(eid => AppData.events.find(e => e.id === eid)).filter(Boolean);
    let text = `**${artist.name}**\n\n${this._i('music')} ${artist.genres.join(', ')} · ${this._i('pin')} ${artist.city}\n${this._i('settings')} ${artist.skills.join(', ')} · ${status}\n\n${this._i('list')} _${artist.bio}_\n\n${this._i('tag')} ${artist.tags.join(' · ')}\n${this._i('zap')} _"${artist.collab_interests}"_\n\n${this._i('headphones')} **Tracks:** ${artist.sample_tracks.map(t => t.title).join(', ')}`;
    if (events.length > 0) { text += `\n\n${this._i('cal')} **Upcoming:**\n` + events.map(e => `• ${e.title} — ${Utils.formatDate(e.date_time)}, ${e.city}`).join('\n'); }
    text += `\n\n[→ View Full Profile](#/artist/${artist.slug})`;
    return { text, suggestions: [`Collab match for ${artist.name.split(' ')[0]}`, 'Find similar artists', 'View events', 'Help'] };
  },

  handleEventInfo(msg) {
    const lower = msg.toLowerCase();
    let event = null;
    for (const e of AppData.events) {
      const matchCount = e.title.toLowerCase().split(/\s+/).filter(w => w.length > 3 && lower.includes(w)).length;
      if (matchCount >= 2) { event = e; break; }
    }
    if (!event) return this.handleFindEvent(msg);
    let text = `**${event.title}**\n\n${this._i('music')} ${event.genre} · ${this._i('pin')} ${event.venue_name}, ${event.venue_address}\n${this._i('cal')} ${Utils.formatDate(event.date_time)} at ${Utils.formatTime(event.date_time)}\n${this._i('users')} ${event.rsvp_count} RSVPs · ${event.performer_slots} slots\n\n${this._i('list')} _${event.description}_\n\n${this._i('list')} ${event.instructions}\n${this._i('mail')} ${event.organizer_contact}`;
    return { text, suggestions: ['Find artists for this event', 'All events', 'Browse artists'] };
  },

  handleUnknown(msg) {
    const responses = [
      `Hmm, I'm not sure what you mean ${this._i('alert')} Try asking me to find artists, events, or suggest collaborations!`,
      `I didn't quite catch that! Try one of the suggestions below ${this._i('sparkles')}`,
    ];
    return { text: responses[Math.floor(Math.random() * responses.length)], suggestions: ['Find artists', 'Upcoming events', 'Suggest a collab', 'Help'] };
  },

  // ── Helpers ────────────────────────────────────
  _buildArtistSuggestions(artists) {
    const s = [];
    if (artists.length > 0) s.push(`About ${artists[0].name.split(' ')[0]}`);
    if (artists.length > 1) s.push(`About ${artists[1].name.split(' ')[0]}`);
    s.push('Find events', 'Suggest a collab');
    return s;
  },

  formatMessage(text) {
    return text
      .replace(/^## (.+)$/gm, '<strong style="font-size:1.1em;display:block;margin-bottom:0.5rem;">$1</strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((#\/.+?)\)/g, '<a href="$2" class="cypherbot-link" data-route="$2">$1</a>')
      .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:0.75rem 0;">')
      .replace(/\n/g, '<br>');
  },

  // ── Process message (AI or local) ──────────────
  processMessage(userMsg) {
    const intent = this.detectIntent(userMsg);
    let response;
    switch (intent) {
      case 'greeting': response = this.handleGreeting(); break;
      case 'help': response = this.handleHelp(); break;
      case 'about': response = this.handleAbout(); break;
      case 'find_artist': response = this.handleFindArtist(userMsg); break;
      case 'find_event': response = this.handleFindEvent(userMsg); break;
      case 'match_collab': response = this.handleMatchCollab(userMsg); break;
      case 'artist_info': response = this.handleArtistInfo(userMsg); break;
      case 'event_info': response = this.handleEventInfo(userMsg); break;
      default: response = this.handleUnknown(userMsg);
    }
    return response;
  },

  // ── API Key Management ────────────────────────
  loadApiKey() {
    this.apiKey = Utils.store.get('gemini_api_key');
    this.useAI = !!this.apiKey;
  },

  saveApiKey(key) {
    if (key && key.trim()) {
      this.apiKey = key.trim();
      Utils.store.set('gemini_api_key', this.apiKey);
      this.useAI = true;
    } else {
      this.apiKey = null;
      Utils.store.remove('gemini_api_key');
      this.useAI = false;
    }
    this._updateModeIndicator();
  },

  _updateModeIndicator() {
    const statusEl = document.querySelector('.cypherbot-header-status');
    if (statusEl) {
      statusEl.innerHTML = this.useAI
        ? `<span class="cypherbot-status-dot cypherbot-dot-ai"></span> Gemini AI · Connected`
        : `<span class="cypherbot-status-dot"></span> Local Mode`;
    }
    // Update settings icon state
    const settingsBtn = document.getElementById('cypherbot-settings-btn');
    if (settingsBtn) {
      settingsBtn.classList.toggle('active', this.useAI);
    }
  },

  showSettingsModal() {
    // Remove existing modal
    const existing = document.querySelector('.cypherbot-settings-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'cypherbot-settings-overlay';
    overlay.innerHTML = `
      <div class="cypherbot-settings-modal">
        <div class="cypherbot-settings-header">
          <h3>${Icons.settings('', 18)} CypherBot Settings</h3>
          <button class="cypherbot-settings-close" id="cypherbot-settings-close" aria-label="Close Settings">${Icons.close('', 16)}</button>
        </div>
        <div class="cypherbot-settings-body">
          <div class="cypherbot-settings-section">
            <div class="cypherbot-settings-mode">
              <div class="cypherbot-mode-badge ${this.useAI ? 'ai' : 'local'}">
                ${this.useAI ? `${Icons.sparkles('cb-icon', 14)} Gemini AI Mode` : `${Icons.settings('cb-icon', 14)} Local Mode`}
              </div>
              <p class="cypherbot-mode-desc">${this.useAI
        ? 'CypherBot is powered by Google Gemini AI for natural conversations.'
        : 'CypherBot uses built-in pattern matching. Add an API key for AI-powered responses!'}</p>
            </div>
          </div>

          <div class="cypherbot-settings-section">
            <label for="cypherbot-api-key-input">Google Gemini API Key</label>
            <div class="cypherbot-key-input-wrap">
              <input type="password" id="cypherbot-api-key-input" class="cypherbot-key-input"
                     placeholder="Enter your Gemini API key..."
                     value="${this.apiKey || ''}">
              <button class="cypherbot-key-toggle" id="cypherbot-key-toggle" aria-label="Show/Hide key">
                ${Icons.eye('', 16)}
              </button>
            </div>
            <p class="cypherbot-key-hint">Get a free API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a></p>
          </div>

          <div class="cypherbot-settings-actions">
            <button class="btn btn-ghost btn-sm" id="cypherbot-settings-remove">Remove Key</button>
            <button class="btn btn-primary btn-sm" id="cypherbot-settings-save">${Icons.check('', 14)} Save Key</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Bind events
    document.getElementById('cypherbot-settings-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    document.getElementById('cypherbot-key-toggle').addEventListener('click', () => {
      const input = document.getElementById('cypherbot-api-key-input');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    document.getElementById('cypherbot-settings-save').addEventListener('click', () => {
      const key = document.getElementById('cypherbot-api-key-input').value;
      this.saveApiKey(key);
      overlay.remove();
      if (key) {
        this.addMessage('✅ **Gemini AI connected!** I\'m now powered by Google Gemini. Try asking me anything — I\'ll give you much smarter, more natural responses!', 'bot', ['Find artists', 'Suggest a collab', 'Tell me a joke about music']);
      }
    });

    document.getElementById('cypherbot-settings-remove').addEventListener('click', () => {
      this.saveApiKey(null);
      document.getElementById('cypherbot-api-key-input').value = '';
      overlay.remove();
      this.addMessage(`${this._i('settings')} Switched back to **Local Mode**. I'll use built-in pattern matching. You can add an API key anytime from the ${this._i('settings')} settings.`, 'bot', ['Find artists', 'Upcoming events', 'Help']);
    });
  },

  // ── UI Methods ─────────────────────────────────
  init() {
    this.loadApiKey();
    this.renderChatUI();
    this.bindEvents();
    this._updateModeIndicator();
  },

  renderChatUI() {
    // FAB button
    const fab = document.createElement('button');
    fab.className = 'cypherbot-fab';
    fab.id = 'cypherbot-fab';
    fab.setAttribute('aria-label', 'Open CypherBot assistant');
    fab.innerHTML = `
      <span class="cypherbot-fab-icon">${Icons.sparkles('', 24)}</span>
      <span class="cypherbot-fab-close">${Icons.close('', 24)}</span>
    `;
    document.body.appendChild(fab);

    // Chat panel
    const panel = document.createElement('div');
    panel.className = 'cypherbot-panel';
    panel.id = 'cypherbot-panel';
    panel.innerHTML = `
      <div class="cypherbot-header">
        <div class="cypherbot-header-info">
          <div class="cypherbot-avatar">
            ${Icons.sparkles('', 20)}
          </div>
          <div>
            <div class="cypherbot-header-title">CypherBot</div>
            <div class="cypherbot-header-status">
              <span class="cypherbot-status-dot"></span>
              ${this.useAI ? 'Gemini AI · Connected' : 'Local Mode'}
            </div>
          </div>
        </div>
        <div class="cypherbot-header-actions">
          <button class="cypherbot-header-settings ${this.useAI ? 'active' : ''}" id="cypherbot-settings-btn" aria-label="Settings" title="API Settings">
            ${Icons.settings('', 16)}
          </button>
          <button class="cypherbot-header-close" id="cypherbot-close" aria-label="Close chat">
            ${Icons.close('', 18)}
          </button>
        </div>
      </div>

      <div class="cypherbot-messages" id="cypherbot-messages">
        <div class="cypherbot-welcome">
          <div class="cypherbot-welcome-icon">${Icons.sparkles('', 40)}</div>
          <h3>Hey! I'm CypherBot ${Icons.mic('cb-icon', 18)}</h3>
          <p>Your AI guide to India's underground music scene. Ask me about artists, events, or collaborations!</p>
          <div class="cypherbot-welcome-mode">${this.useAI ? `${Icons.sparkles('cb-icon', 12)} Powered by Gemini AI` : `${Icons.settings('cb-icon', 12)} Click the gear icon to connect Gemini AI`}</div>
        </div>
        <div class="cypherbot-suggestions" id="cypherbot-welcome-suggestions">
          <button class="cypherbot-chip" data-query="Find artists">${Icons.mic('cb-icon', 12)} Find Artists</button>
          <button class="cypherbot-chip" data-query="Upcoming events">${Icons.calendar('cb-icon', 12)} Events</button>
          <button class="cypherbot-chip" data-query="Suggest a collab">${Icons.handshake('cb-icon', 12)} Collabs</button>
          <button class="cypherbot-chip" data-query="help">${Icons.info('cb-icon', 12)} Help</button>
        </div>
      </div>

      <div class="cypherbot-input-area">
        <div class="cypherbot-input-wrap">
          <input type="text" class="cypherbot-input" id="cypherbot-input"
                 placeholder="Ask about artists, events, collabs..."
                 autocomplete="off">
          <button class="cypherbot-send" id="cypherbot-send" aria-label="Send message">
            ${Icons.send('', 18)}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  },

  bindEvents() {
    const fab = document.getElementById('cypherbot-fab');
    const closeBtn = document.getElementById('cypherbot-close');
    const settingsBtn = document.getElementById('cypherbot-settings-btn');
    const input = document.getElementById('cypherbot-input');
    const sendBtn = document.getElementById('cypherbot-send');

    fab.addEventListener('click', () => this.toggle());
    closeBtn.addEventListener('click', () => this.close());
    settingsBtn.addEventListener('click', () => this.showSettingsModal());

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => this.sendMessage());

    // Suggestion chips (delegate)
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.cypherbot-chip');
      if (chip) {
        const query = chip.dataset.query;
        if (query) {
          input.value = query;
          this.sendMessage();
        }
      }
    });

    // Chat link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.cypherbot-link');
      if (link) {
        e.preventDefault();
        const route = link.dataset.route;
        if (route) {
          this.close();
          Router.navigate(route);
        }
      }
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const fab = document.getElementById('cypherbot-fab');
    const panel = document.getElementById('cypherbot-panel');
    fab.classList.toggle('open', this.isOpen);
    panel.classList.toggle('open', this.isOpen);
    if (this.isOpen) {
      setTimeout(() => { document.getElementById('cypherbot-input').focus(); }, 300);
    }
  },

  close() {
    this.isOpen = false;
    document.getElementById('cypherbot-fab').classList.remove('open');
    document.getElementById('cypherbot-panel').classList.remove('open');
  },

  async sendMessage() {
    const input = document.getElementById('cypherbot-input');
    const msg = input.value.trim();
    if (!msg || this.isTyping) return;

    this.addMessage(msg, 'user');
    input.value = '';
    this.showTyping();

    if (this.useAI) {
      // Try Gemini API
      const aiResponse = await this.callGeminiAPI(msg);
      this.hideTyping();

      if (aiResponse && aiResponse.error) {
        // Handle specific errors
        switch (aiResponse.error) {
          case 'invalid_key':
            this.saveApiKey(null);
            this.addMessage(`${this._i('close')} **Invalid API key.** The key was removed. Go to ${this._i('settings')} settings to enter a valid Gemini API key.`, 'bot', ['Help', 'Find artists']);
            return;
          case 'rate_limited':
            // Fallback to local NLP with friendly message
            const localResp = this.processMessage(msg);
            this.addMessage(localResp.text + `\n\n_${this._i('alert')} Gemini API rate limited — answered using local mode. Try again in a minute!_`, 'bot', localResp.suggestions);
            return;
          case 'forbidden':
            this.addMessage(`${this._i('lock')} **API key doesn't have access.** Please check that your Gemini API key is valid and has the Generative Language API enabled in ${this._i('settings')} settings.`, 'bot', ['Help', 'Find artists']);
            return;
          case 'network':
            const fallback = this.processMessage(msg);
            this.addMessage(fallback.text, 'bot', fallback.suggestions);
            return;
          default:
            const fb = this.processMessage(msg);
            this.addMessage(fb.text, 'bot', fb.suggestions);
            return;
        }
      }

      if (aiResponse && aiResponse.text) {
        const suggestions = this._generateSuggestions(aiResponse.text);
        this.addMessage(aiResponse.text, 'bot', suggestions);
      } else {
        // Fallback to local NLP silently
        const response = this.processMessage(msg);
        this.addMessage(response.text, 'bot', response.suggestions);
      }
    } else {
      // Local NLP
      setTimeout(() => {
        this.hideTyping();
        const response = this.processMessage(msg);
        this.addMessage(response.text, 'bot', response.suggestions);
      }, 400 + Math.random() * 600);
    }
  },

  addMessage(text, sender, suggestions = []) {
    const container = document.getElementById('cypherbot-messages');
    const welcome = container.querySelector('.cypherbot-welcome');
    const welcomeSuggestions = document.getElementById('cypherbot-welcome-suggestions');
    if (welcome) welcome.style.display = 'none';
    if (welcomeSuggestions) welcomeSuggestions.style.display = 'none';

    const msgEl = document.createElement('div');
    msgEl.className = `cypherbot-msg cypherbot-msg-${sender}`;

    if (sender === 'bot') {
      msgEl.innerHTML = `
        <div class="cypherbot-msg-avatar">${Icons.sparkles('', 14)}</div>
        <div class="cypherbot-msg-content">
          <div class="cypherbot-msg-bubble">${this.formatMessage(text)}</div>
          ${suggestions.length > 0 ? `
            <div class="cypherbot-suggestions">
              ${suggestions.map(s => `<button class="cypherbot-chip" data-query="${s}">${s}</button>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
    } else {
      msgEl.innerHTML = `
        <div class="cypherbot-msg-content">
          <div class="cypherbot-msg-bubble">${this.escapeHtml(text)}</div>
        </div>
      `;
    }

    container.appendChild(msgEl);
    this.scrollToBottom();
    this.messages.push({ text, sender, timestamp: Date.now() });
  },

  showTyping() {
    this.isTyping = true;
    const container = document.getElementById('cypherbot-messages');
    const typing = document.createElement('div');
    typing.className = 'cypherbot-msg cypherbot-msg-bot cypherbot-typing-msg';
    typing.innerHTML = `
      <div class="cypherbot-msg-avatar">${Icons.sparkles('', 14)}</div>
      <div class="cypherbot-msg-content">
        <div class="cypherbot-msg-bubble cypherbot-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(typing);
    this.scrollToBottom();
  },

  hideTyping() {
    this.isTyping = false;
    const typing = document.querySelector('.cypherbot-typing-msg');
    if (typing) typing.remove();
  },

  scrollToBottom() {
    const container = document.getElementById('cypherbot-messages');
    setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
