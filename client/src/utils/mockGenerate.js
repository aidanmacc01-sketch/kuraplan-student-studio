/**
 * mockGenerate.js – Client-side deterministic worksheet generation.
 *
 * ─────────────────────────────────────────────────────────────────
 *  AI INTEGRATION POINT
 *  Replace the body of `generateStudySet()` with a fetch() call to
 *  your real API endpoint (e.g. Kuraplan's LLM service) and return
 *  the same shape: { questions, workedExamples, worksheetHtml }
 * ─────────────────────────────────────────────────────────────────
 *
 * This runs entirely in the browser – no Express server required.
 * That makes it deployable as a static site (GitHub Pages, etc.)
 */

export function generateStudySet({ state, year, subject, outcomes, difficulty, text, options }) {
    const difficultyLabel = {
        foundation: 'Foundation',
        standard: 'Standard',
        advanced: 'Advanced (Extension)',
    }[difficulty] || 'Standard';

    const questions = [];
    const workedExamples = [];

    // Simulate a small delay so the loading state is visible
    // (remove in production when a real API call provides natural latency)

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
                answer: `Extended model answer: demonstrate understanding of ${outcomeCode}, integrate relevant knowledge from ${subject}, and structure with introduction, body, and conclusion. Award marks for depth, accuracy, and analytical skill.`,
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

    // Build printable worksheet HTML
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
    h1 { font-size: 1.4rem; border-bottom: 2px solid #ec5b13; padding-bottom: 8px; }
    .meta { color: #555; font-size: 0.9rem; margin-bottom: 24px; }
    .question { margin-bottom: 24px; padding: 12px; background: #f9f9fb; border-left: 4px solid #ec5b13; border-radius: 4px; }
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
