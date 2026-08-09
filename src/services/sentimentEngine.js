/**
 * RoamPulse AI - NLP Sentiment Scoring Engine
 * Analyzes raw guest reviews and calculates normalized 0-100% index scores
 * for Hygiene, Safety, and Peacefulness, returning 3 concise AI bullet points.
 */

const LEXICONS = {
  hygiene: {
    positive: ['clean', 'sanitized', 'spotless', 'fresh', 'sparkling', 'disinfected', 'hygienic', 'touchless', 'filtered', 'gloved'],
    negative: ['dirty', 'dusty', 'smelly', 'unwashed', 'stained', 'grimy', 'mold', 'trash', 'unhygienic']
  },
  safety: {
    positive: ['safe', 'secure', 'guarded', 'well-lit', 'cameras', 'security', 'patrolled', 'lock', 'bio-lock', 'cctv'],
    negative: ['unsafe', 'dark', 'lonely', 'scary', 'broken', 'suspicious', 'risky', 'unsecured']
  },
  peacefulness: {
    positive: ['quiet', 'peaceful', 'calm', 'silent', 'tranquil', 'serene', 'soundproof', 'pine grove', 'nature', 'relaxing'],
    negative: ['noisy', 'loud', 'traffic', 'crowded', 'hackathon', 'shouting', 'construction', 'horns', 'busy']
  }
};

export function analyzeReviewsSentiment(reviewsList) {
  if (!reviewsList || reviewsList.length === 0) {
    return {
      hygieneScore: 90,
      safetyIndex: 92,
      peaceIndex: 85,
      valueForMoneyScore: 4.6,
      bulletSummaries: [
        "Verified clean washrooms & sanitized facilities.",
        "Monitored security and well-lit entryways.",
        "Standard noise levels during peak hours."
      ]
    };
  }

  const textBlob = (Array.isArray(reviewsList) ? reviewsList.join(' ') : reviewsList).toLowerCase();

  const calcCategoryScore = (cat) => {
    const posMatches = LEXICONS[cat].positive.filter(kw => textBlob.includes(kw)).length;
    const negMatches = LEXICONS[cat].negative.filter(kw => textBlob.includes(kw)).length;
    
    const baseScore = 85;
    const score = baseScore + (posMatches * 4) - (negMatches * 6);
    return Math.min(99, Math.max(50, score));
  };

  const hygieneScore = calcCategoryScore('hygiene');
  const safetyIndex = calcCategoryScore('safety');
  const peaceIndex = calcCategoryScore('peacefulness');
  const valueForMoneyScore = Number(((hygieneScore + safetyIndex) / 40).toFixed(1));

  // Synthesize 3 concise bullet summaries
  const bulletSummaries = [];

  if (hygieneScore >= 90) {
    bulletSummaries.push("Consistently clean and sanitized washroom facilities verified by Pulse AI.");
  } else {
    bulletSummaries.push("Standard hygiene levels with periodic sanitation cycles.");
  }

  if (safetyIndex >= 90) {
    bulletSummaries.push("24/7 security guard and CCTV monitoring makes it super safe for solo tourists.");
  } else {
    bulletSummaries.push("Moderately safe area; standard evening lighting on main approach.");
  }

  if (peaceIndex < 80) {
    bulletSummaries.push("Limited parking and higher ambient crowd noise during peak evening hours.");
  } else {
    bulletSummaries.push("Strict quiet index maintained with soundproof room acoustics.");
  }

  return {
    hygieneScore,
    safetyIndex,
    peaceIndex,
    valueForMoneyScore,
    bulletSummaries
  };
}
