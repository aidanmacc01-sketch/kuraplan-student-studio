# Kuraplan Student Studio

AI-powered study worksheet generator for Australian HSC students.

Built with **React + Vite** on the front-end and **Node.js + Express** on the back-end.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Run locally
```bash
npm run dev
```

This starts:
- **Front-end** → http://localhost:3000
- **API server** → http://localhost:4000

---

## How to Use

1. **Choose Syllabus** – Select your State, Year Level (11/12), and Subject in the sidebar.
2. **Add Content** – Paste your notes, textbook excerpts, or teacher worksheets into Panel 1.
3. **Target Outcomes** – Select the syllabus dot-points you want to be tested on in Panel 2. Adjust difficulty and question types.
4. **Generate** – Click **Generate study questions** in Panel 3. Results appear in collapsible sections.
5. **Worksheet Editor** – Open the full worksheet canvas to preview, edit, and export questions.
6. **Download PDF** – Print or save your worksheet as a PDF.

---

## Project Structure

```
kuraplan-student-studio/
├── server/          # Express API (port 4000)
│   ├── index.js     # POST /api/generate – mock AI generation
│   └── package.json
├── client/          # React + Vite app (port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── SidebarSetup.jsx
│   │   │   ├── PanelInput.jsx
│   │   │   ├── PanelOutcomes.jsx
│   │   │   ├── PanelResults.jsx
│   │   │   ├── WorksheetDetails.jsx
│   │   │   └── BottomBar.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── package.json     # Root – runs both with `npm run dev`
```

---

## AI Integration

The `POST /api/generate` endpoint in `server/index.js` currently returns **deterministic mock data**. Look for the comments marked:

```
// AI INTEGRATION POINT
```

Replace the `generateMockResponse()` function body with a call to your preferred LLM API (OpenAI, Gemini, etc.) and return the same shape: `{ questions, workedExamples, worksheetHtml }`.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Front-end | React 18, Vite, Vanilla CSS |
| Back-end | Node.js, Express 4 |
| Dev runner | concurrently |
| Fonts | Public Sans, Material Symbols |

---

*Aligned to Australian Curriculum standards. Built as an MVP — real AI integration ready.*
