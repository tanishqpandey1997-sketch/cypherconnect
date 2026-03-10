// ============================================
// CypherConnect — AI Matchmaker Utility
// ============================================

const Matchmaker = {
  /**
   * Calculate match score between two artists
   * Returns { score, reasons[] }
   */
  calculateMatch(artist, candidate) {
    let score = 0;
    const reasons = [];

    // +3 for shared genre
    const sharedGenres = artist.genres.filter(g => candidate.genres.includes(g));
    if (sharedGenres.length > 0) {
      score += 3 * sharedGenres.length;
      reasons.push(`Shared genre: ${sharedGenres.join(', ')}`);
    }

    // +2 for same city
    if (artist.city === candidate.city) {
      score += 2;
      reasons.push(`Same city: ${artist.city}`);
    }

    // +2 for complementary skills
    const complementary = this.findComplementarySkills(artist.skills, candidate.skills);
    if (complementary.length > 0) {
      score += 2;
      reasons.push(`Complementary skills: ${complementary.join(' ↔ ')}`);
    }

    // +1 for both available
    if (artist.availability && candidate.availability) {
      score += 1;
      reasons.push('Both open for collaboration');
    }

    // +1 for both featured
    if (artist.featured && candidate.featured) {
      score += 1;
      reasons.push('Both featured artists');
    }

    // +1 for nearby city
    const nearbyPairs = [
      ['Delhi', 'Mumbai'], ['Mumbai', 'Pune'], ['Delhi', 'Lucknow'],
      ['Bengaluru', 'Pune'], ['Mumbai', 'Bengaluru']
    ];
    if (artist.city !== candidate.city) {
      const isNearby = nearbyPairs.some(pair =>
        (pair.includes(artist.city) && pair.includes(candidate.city))
      );
      if (isNearby) {
        score += 1;
        reasons.push(`Nearby cities: ${artist.city} ↔ ${candidate.city}`);
      }
    }

    return { score, reasons };
  },

  findComplementarySkills(skills1, skills2) {
    const pairs = [
      ['Lyricist', 'Producer'],
      ['Vocalist', 'Producer'],
      ['Vocalist', 'Beat Maker'],
      ['Lyricist', 'Vocalist'],
      ['Songwriter', 'Producer'],
      ['Guitarist', 'Vocalist'],
      ['Songwriter', 'Beat Maker'],
      ['Composer', 'Lyricist'],
      ['Vocalist', 'Mixing Engineer']
    ];
    
    const found = [];
    for (const [a, b] of pairs) {
      if ((skills1.includes(a) && skills2.includes(b)) ||
          (skills1.includes(b) && skills2.includes(a))) {
        found.push(`${a} ↔ ${b}`);
      }
    }
    return found;
  },

  /**
   * Get top N matches for an artist
   */
  getMatches(artist, allArtists, topN = 5) {
    const matches = allArtists
      .filter(a => a.id !== artist.id)
      .map(candidate => ({
        artist: candidate,
        ...this.calculateMatch(artist, candidate)
      }))
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return matches;
  },

  /**
   * Get event suggestions for an artist based on genre and city
   */
  getEventSuggestions(artist, allEvents, topN = 3) {
    return allEvents
      .filter(event => {
        const genreMatch = artist.genres.some(g => 
          g.toLowerCase() === event.genre.toLowerCase() ||
          (g === 'Singer-Songwriter' && event.genre === 'Singer-Songwriter')
        );
        const cityMatch = event.city === artist.city;
        return genreMatch || cityMatch;
      })
      .sort((a, b) => {
        const aGenre = artist.genres.some(g => g.toLowerCase() === a.genre.toLowerCase()) ? 2 : 0;
        const bGenre = artist.genres.some(g => g.toLowerCase() === b.genre.toLowerCase()) ? 2 : 0;
        const aCity = a.city === artist.city ? 1 : 0;
        const bCity = b.city === artist.city ? 1 : 0;
        return (bGenre + bCity) - (aGenre + aCity);
      })
      .slice(0, topN);
  }
};
