/**
 * Express backend server for Claude API integration.
 *
 * Run: CLAUDE_API_KEY=sk-... node server/index.js
 * Proxied by Vite in dev mode (see vite.config.js).
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

app.use(cors());
app.use(express.json());

/**
 * POST /api/generate-results
 * Body: { answers, name, email, company, result: { code, scores, percentages, archetype } }
 */
app.post('/api/generate-results', async (req, res) => {
  const { result, name } = req.body;

  if (!result || !result.code) {
    return res.status(400).json({ error: 'Missing result data' });
  }

  const { code, scores, percentages, archetype } = result;

  // If no API key, return null so frontend uses fallback
  if (!CLAUDE_API_KEY) {
    return res.json({ details: null });
  }

  const prompt = buildPrompt(code, scores, percentages, archetype, name || '');

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Claude API error (${response.status}):`, errText);
      return res.json({ details: null });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json({ details: parsed });
    }

    console.error('Failed to parse Claude response as JSON');
    return res.json({ details: null });
  } catch (err) {
    console.error('Claude API request failed:', err.message);
    return res.json({ details: null });
  }
});

function buildPrompt(code, scores, percentages, archetype, userName) {
  const greeting = userName ? `for ${userName}'s organization` : 'for this organization';

  return `You are an expert business operations consultant analyzing an organization's Operational Archetype quiz results. Generate a comprehensive, personalized archetype report ${greeting}.

## Quiz Results
- **Archetype Code:** ${code}
- **Archetype Name:** ${archetype.name}
- **Spirit Animal:** ${archetype.animal}
- **Tagline:** "${archetype.tagline}"

## Dimension Scores (0-9 scale, higher = more mature)
- **Execution** (Manual 0 <-> 9 Automated): ${scores.execution}/9 (${percentages.execution}%)
- **Data** (Fragmented 0 <-> 9 Centralized): ${scores.data}/9 (${percentages.data}%)
- **Connection** (Siloed 0 <-> 9 Integrated): ${scores.connection}/9 (${percentages.connection}%)
- **Control** (Reactive 0 <-> 9 Proactive): ${scores.control}/9 (${percentages.control}%)

## Code Meaning
- 1st letter: M = Manual execution, A = Automated execution
- 2nd letter: C = Centralized data, F = Fragmented data
- 3rd letter: S = Siloed teams, I = Integrated teams
- 4th letter: P = Proactive control, R = Reactive control

## Your Task
Generate a detailed archetype report as a JSON object. Be specific, insightful, and actionable. Write as if speaking directly to the business leader. Use concrete examples relevant to their archetype.

Return ONLY a valid JSON object with this exact structure:
{
    "execution_style": "2-3 sentence description of how this organization executes work based on their M/A score",
    "data_approach": "2-3 sentence description of their data management based on C/F score",
    "connection_pattern": "2-3 sentence description of how teams connect based on S/I score",
    "control_posture": "2-3 sentence description of their control approach based on P/R score",
    "cultural_dna": "2-3 sentence description synthesizing all dimensions into a cultural portrait",
    "superpowers": [
        "Specific operational strength 1",
        "Specific operational strength 2",
        "Specific operational strength 3",
        "Specific operational strength 4"
    ],
    "superpower_emojis": ["emoji1", "emoji2", "emoji3", "emoji4"],
    "kryptonite": [
        "Specific operational weakness 1",
        "Specific operational weakness 2",
        "Specific operational weakness 3",
        "Specific operational weakness 4"
    ],
    "kryptonite_emojis": ["emoji1", "emoji2", "emoji3", "emoji4"],
    "ideal_starting_points": [
        "Specific actionable first step",
        "Specific actionable second step",
        "Specific actionable third step"
    ],
    "famous_last_words": "A funny, relatable one-liner this archetype would say (in quotes)",
    "real_world_example": "A 2-3 sentence fictional but realistic example of a company with this archetype - include industry, size, and the core operational challenge they face",
    "why_animal": "2-3 sentence explanation of why this spirit animal (${archetype.animal}) perfectly represents this archetype - use the animal's real traits as metaphors for the operational style"
}

Be creative, specific, and insightful. The superpowers should feel genuinely positive. The kryptonite should feel honest but not harsh. The starting points should be immediately actionable. The famous last words should make someone laugh because it's so true.`;
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
