// Browser port of engine/src/radar/match.py. engine/tests/test_match_js.py keeps the two in step.
function match(creator, brands, limit) {
  const niches = new Set(creator.niches), uses = new Set(creator.uses || []);
  const out = [];
  for (const b of brands) {
    const shared = b.tags.filter(t => niches.has(t)).sort();
    if (!b.evidence.length || !shared.length || creator.followers < b.min_followers) continue;
    const platforms = b.pays_via.filter(p => uses.has(p)).sort();
    const reasons = shared.map(n => `niche: ${n}`)
      .concat(platforms.map(p => `pays via ${p}, which you already use`));
    // Niche fit is the share of the brand's focus the creator covers, so a specialist beats a broad retailer.
    const score = 2 * shared.length / b.tags.length + 2 * platforms.length + 0.5 * Math.min(b.evidence.length, 3);
    out.push({ name: b.name, score, reasons, shared, platforms, evidence: b.evidence });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Brands hand-picked for a creator (named in a reply link) go first, even without a niche match.
function pin(matches, brands, names) {
  const picked = [];
  for (const name of names) {
    const b = matches.find(m => m.name === name) || brands.find(b => b.name === name && b.evidence.length);
    if (b && !picked.some(p => p.name === name))
      picked.push({ shared: [], platforms: [], reasons: [], ...b, picked: true });
  }
  return picked.concat(matches.filter(m => !names.includes(m.name)));
}

if (typeof module !== "undefined") module.exports = { match, pin };
