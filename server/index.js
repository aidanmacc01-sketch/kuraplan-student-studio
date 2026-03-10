/**
 * Kuraplan Student Studio – Express API Server
 * Port: 4000
 *
 * ─────────────────────────────────────────────────────────────────
 *  AI INTEGRATION POINT
 *  The POST /api/generate handler currently returns deterministic
 *  mock data. To connect a real AI model (e.g. OpenAI, Gemini,
 *  Kuraplan's own LLM service), replace the `generateMockResponse`
 *  call with your API call and transform the response into the same
 *  shape: { questions, workedExamples, worksheetHtml }.
 * ─────────────────────────────────────────────────────────────────
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── Mock syllabus data (same set exposed to client for reference) ─
const MOCK_SYLLABUS = {
  'NSW': {
    '12': {
      'Mathematics Advanced': [
        'MA-C1: differentiate and apply the rules of differentiation to a variety of functions',
        'MA-C2: find the anti-derivative of a function and apply integration techniques',
        'MA-S3: analyse bivariate data using statistical methods and interpret correlation',
        'MA-T3: apply trigonometric functions to model periodic phenomena',
        'MA-F2: graph and interpret exponential and logarithmic functions',
        'MA-M1: apply mathematical reasoning and problem-solving strategies',
      ],
      'Chemistry': [
        'CH11-14: conduct investigations, including to solve problems',
        'CH12-13: apply understanding of chemical equilibrium using Le Chatelier\'s principle',
        'CH12-14: analyse the properties and reactions of organic compounds',
        'CH12-15: evaluate the role of chemistry in addressing sustainability challenges',
        'CH11-11: demonstrate skills in working scientifically',
        'CH12-12: explore and explain the structure and properties of matter',
      ],
      'English Advanced': [
        'EN12-1: engage with texts and respond with understanding, insight and creativity',
        'EN12-2: compose texts with an understanding of language, form and structure',
        'EN12-3: analyse and evaluate the ways language, structure and form shape meaning',
        'EN12-4: select, synthesise and use evidence from texts to support arguments',
        'EN12-5: reflect on own processes of responding and composing',
        'EN12-6: critically evaluate the role of texts in portraying social perspectives',
      ],
    },
    '11': {
      'Mathematics Advanced': [
        'MA11-1: apply algebraic techniques to simplify expressions and solve equations',
        'MA11-2: apply concepts and techniques of trigonometry to solve problems',
        'MA11-3: explore and apply the concepts of limits and differentiation',
        'MA11-4: investigate and describe statistical distributions',
        'MA11-5: use functions to model real-world phenomena',
        'MA11-6: demonstrate mathematical reasoning and communication',
      ],
      'Chemistry': [
        'CH11-1: describe the properties of elements and compounds',
        'CH11-2: apply concepts of atomic structure and bonding',
        'CH11-3: investigate chemical reactions and write equations',
        'CH11-4: analyse solutions and calculate concentrations',
        'CH11-5: design and conduct safe scientific investigations',
        'CH11-6: interpret and communicate scientific data',
      ],
      'English Advanced': [
        'EN11-1: engage with diverse texts to understand their significance',
        'EN11-2: compose texts for varied purposes and audiences',
        'EN11-3: analyse how language features and structures create meaning',
        'EN11-4: develop skills in critical and analytical reading',
        'EN11-5: explore the relationship between texts and their contexts',
        'EN11-6: reflect on own composing and responding processes',
      ],
    },
  },
};

// ── Helper: generate a deterministic mock AI response ────────────
/**
 * AI INTEGRATION POINT
 * Replace this entire function body with a call to your LLM API.
 * The function receives the validated request body and must return
 * an object of the shape: { questions, workedExamples, worksheetHtml }
 *
 * @param {object} params
 * @param {string} params.state
 * @param {string} params.year
 * @param {string} params.subject
 * @param {string[]} params.outcomes
 * @param {string}  params.difficulty  – "foundation" | "standard" | "advanced"
 * @param {string}  params.text        – optional student-pasted content
 * @param {object}  params.options     – { includeWorkedExamples, includeMCQ, includeShortAnswer, includeExtendedResponse }
 */
function generateMockResponse({ state, year, subject, outcomes, difficulty, text, options }) {
  const difficultyLabel = {
    foundation: 'Foundation',
    standard: 'Standard',
    advanced: 'Advanced (Extension)',
  }[difficulty] || 'Standard';

  const questions = [];
  const workedExamples = [];

  // Build questions from chosen outcomes
  outcomes.forEach((outcome, i) => {
    const outcomeCode = outcome.split(':')[0].trim();
    const outcomeDesc = outcome.includes(':') ? outcome.split(':').slice(1).join(':').trim() : outcome;

    if (options.includeMCQ) {
      questions.push({
        id: `mcq-${i + 1}`,
        type: 'MCQ',
        outcomeCode,
        difficulty: difficultyLabel,
        question: `[${difficultyLabel} MCQ] Based on ${outcomeCode}: which of the following best describes "${outcomeDesc}"?`,
        options: [
          'A. The first plausible answer relating to this outcome',
          'B. A distractor that sounds similar but is incorrect',
          'C. Another plausible distractor',
          'D. The correct answer according to the syllabus outcome',
        ],
        answer: 'D',
        marks: 1,
      });
    }

    if (options.includeShortAnswer) {
      questions.push({
        id: `short-${i + 1}`,
        type: 'Short Answer',
        outcomeCode,
        difficulty: difficultyLabel,
        question: `[${difficultyLabel} Short Answer] Explain, in your own words, how you would "${outcomeDesc}". Provide one real-world example.`,
        answer: `A model answer would reference key concepts from ${outcomeCode} and connect them to the student's pasted context${text ? `: "${text.slice(0, 60)}…"` : '.'} A high-scoring response demonstrates depth and accuracy.`,
        marks: 4,
      });
    }

    if (options.includeExtendedResponse && i < 2) {
      questions.push({
        id: `ext-${i + 1}`,
        type: 'Extended Response',
        outcomeCode,
        difficulty: difficultyLabel,
        question: `[${difficultyLabel} Extended Response] Critically evaluate the significance of "${outcomeDesc}" in the context of Year ${year} ${subject}. Support your answer with evidence and analysis.`,
        answer: `Extended model answer: Students should demonstrate understanding of ${outcomeCode}, integrate relevant knowledge from ${subject}, and structure their response with an introduction, body paragraphs, and a conclusion. Award marks for depth, accuracy, and analytical skill.`,
        marks: 8,
      });
    }

    if (options.includeWorkedExamples) {
      workedExamples.push({
        id: `we-${i + 1}`,
        outcomeCode,
        title: `Worked Example – ${outcomeCode}`,
        steps: [
          `Step 1 – Understand the outcome: "${outcomeDesc}"`,
          `Step 2 – Identify the key concept or technique required.`,
          `Step 3 – Apply the method/process systematically.`,
          `Step 4 – Check your answer and state your conclusion.`,
        ],
        tip: `Remember: for ${difficulty} difficulty, examiners look for precision in language and clear logical steps.`,
      });
    }
  });

  // Build minimal worksheet HTML
  const questionsHtml = questions.map((q) => `
    <div class="question">
      <p><strong>[${q.type} – ${q.marks} mark${q.marks > 1 ? 's' : ''}]</strong> ${q.question}</p>
      ${q.options ? `<ul>${q.options.map((o) => `<li>${o}</li>`).join('')}</ul>` : ''}
      <div class="answer-space" style="border:1px dashed #ccc;min-height:60px;margin:8px 0;padding:8px;color:#999;">Answer space</div>
    </div>`).join('');

  const worksheetHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Kuraplan Worksheet – ${subject} Year ${year} (${state})</title>
  <style>
    body { font-family: Georgia, serif; max-width: 780px; margin: 40px auto; color: #1a1a1a; line-height: 1.6; }
    h1 { font-size: 1.4rem; border-bottom: 2px solid #00a878; padding-bottom: 8px; }
    .meta { color: #555; font-size: 0.9rem; margin-bottom: 24px; }
    .question { margin-bottom: 24px; padding: 12px; background: #f9f9fb; border-left: 4px solid #00a878; border-radius: 4px; }
    ul { margin: 8px 0 8px 20px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Kuraplan Study Worksheet</h1>
  <div class="meta">
    <strong>Subject:</strong> ${subject} &nbsp;|&nbsp;
    <strong>Year:</strong> ${year} &nbsp;|&nbsp;
    <strong>State:</strong> ${state} &nbsp;|&nbsp;
    <strong>Difficulty:</strong> ${difficultyLabel}
  </div>
  ${questionsHtml || '<p>No questions generated – please select question types and outcomes.</p>'}
</body>
</html>`;

  return { questions, workedExamples, worksheetHtml };
}

// ── Routes ────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Expose mocked syllabus data to the client
app.get('/api/syllabus', (req, res) => res.json(MOCK_SYLLABUS));

/**
 * POST /api/generate
 * Body: { state, year, subject, outcomes[], difficulty, text, options }
 * Returns: { questions, workedExamples, worksheetHtml }
 */
app.post('/api/generate', (req, res) => {
  const {
    state = 'NSW',
    year = '12',
    subject = 'Mathematics Advanced',
    outcomes = [],
    difficulty = 'standard',
    text = '',
    options = {},
  } = req.body;

  if (!outcomes.length) {
    return res.status(400).json({ error: 'Please select at least one syllabus outcome.' });
  }

  // Simulate a brief processing delay (remove in production)
  setTimeout(() => {
    try {
      const result = generateMockResponse({ state, year, subject, outcomes, difficulty, text, options });
      res.json(result);
    } catch (err) {
      console.error('[/api/generate] Error:', err);
      res.status(500).json({ error: 'Failed to generate worksheet content.' });
    }
  }, 900); // 900 ms simulated latency
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎓 Kuraplan API server running at http://localhost:${PORT}`);
  console.log('   POST /api/generate  – generate worksheet content');
  console.log('   GET  /api/syllabus  – retrieve mock syllabus data\n');
});
