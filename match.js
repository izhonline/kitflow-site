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
    const score = shared.length + 2 * platforms.length + 0.5 * b.evidence.length;
    out.push({ name: b.name, score, reasons, shared, platforms, evidence: b.evidence });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

if (typeof module !== "undefined") module.exports = { match };
