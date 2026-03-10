import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import SidebarSetup from './components/SidebarSetup.jsx';
import PanelInput from './components/PanelInput.jsx';
import PanelOutcomes from './components/PanelOutcomes.jsx';
import PanelResults from './components/PanelResults.jsx';
import BottomBar from './components/BottomBar.jsx';
import WorksheetDetails from './components/WorksheetDetails.jsx';

// ── Mock syllabus data (mirrors server's mock, loaded statically for instant UI) ──
const SYLLABUS_OUTCOMES = {
    NSW: {
        12: {
            'Mathematics Advanced': [
                'MA-C1: differentiate and apply the rules of differentiation to a variety of functions',
                'MA-C2: find the anti-derivative of a function and apply integration techniques',
                'MA-S3: analyse bivariate data using statistical methods and interpret correlation',
                'MA-T3: apply trigonometric functions to model periodic phenomena',
                'MA-F2: graph and interpret exponential and logarithmic functions',
                'MA-M1: apply mathematical reasoning and problem-solving strategies',
            ],
            Chemistry: [
                "CH11-14: conduct investigations, including to solve problems",
                "CH12-13: apply understanding of chemical equilibrium using Le Chatelier's principle",
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
            Biology: [
                'BIO12-1: describes the roles of nucleic acids in the mechanisms of inheritance',
                'BIO12-2: analyses the relationship between the evolution of populations and speciation',
                'BIO12-3: describes the role of biological technologies in the reproduction of organisms',
                'BIO12-4: analyses evidence for the Common Ancestor theory',
                'BIO12-5: evaluates the impact of biotechnology on genetics and heredity',
                'BIO12-6: explains the reproductive strategies and the mechanisms of inheritance',
            ],
        },
        11: {
            'Mathematics Advanced': [
                'MA11-1: apply algebraic techniques to simplify expressions and solve equations',
                'MA11-2: apply concepts and techniques of trigonometry to solve problems',
                'MA11-3: explore and apply the concepts of limits and differentiation',
                'MA11-4: investigate and describe statistical distributions',
                'MA11-5: use functions to model real-world phenomena',
                'MA11-6: demonstrate mathematical reasoning and communication',
            ],
            Chemistry: [
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
            Biology: [
                'BIO11-1: describes structure and function of a eukaryotic cell',
                'BIO11-2: explains the role of DNA as the basis of inheritance',
                'BIO11-3: investigates the relationship between cell structure and function',
                'BIO11-4: explains how the body responds to internal and external changes',
                'BIO11-5: describes the relationships between organisms and their environments',
                'BIO11-6: designs and evaluates investigations in biology',
            ],
        },
    },
};

const SUBJECTS_BY_YEAR = {
    11: ['Mathematics Advanced', 'Chemistry', 'English Advanced', 'Biology'],
    12: ['Mathematics Advanced', 'Chemistry', 'English Advanced', 'Biology'],
};

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

function getOutcomes(state, year, subject) {
    return SYLLABUS_OUTCOMES?.[state]?.[year]?.[subject] ?? [];
}

export default function App() {
    // ── Setup state ─────────────────────────────────────────────
    const [selectedState, setSelectedState] = useState('NSW');
    const [year, setYear] = useState(12);
    const [subject, setSubject] = useState('');

    // ── Input state ──────────────────────────────────────────────
    const [inputTab, setInputTab] = useState('notes');
    const [pastedText, setPastedText] = useState('');

    // ── Outcomes state ───────────────────────────────────────────
    const [chosenOutcomes, setChosenOutcomes] = useState([]);
    const [difficulty, setDifficulty] = useState(1); // 0=foundation,1=standard,2=advanced
    const [options, setOptions] = useState({
        includeWorkedExamples: true,
        includeMCQ: true,
        includeShortAnswer: true,
        includeExtendedResponse: false,
    });

    // ── Results state ────────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null); // { questions, workedExamples, worksheetHtml }
    const [lastGenerated, setLastGenerated] = useState(null);
    const [error, setError] = useState(null);

    // ── View state ───────────────────────────────────────────────
    const [view, setView] = useState('studio'); // 'studio' | 'worksheet'
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    const difficultyLabels = ['Foundation', 'Standard', 'Advanced'];
    const difficultyKeys = ['foundation', 'standard', 'advanced'];

    const availableOutcomes = getOutcomes(selectedState, year, subject);

    function toggleOutcome(outcome) {
        setChosenOutcomes((prev) =>
            prev.includes(outcome) ? prev.filter((o) => o !== outcome) : [...prev, outcome]
        );
    }

    function toggleOption(key) {
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    async function handleGenerate() {
        if (!subject) { setError('Please select a subject first.'); return; }
        if (!chosenOutcomes.length) { setError('Please select at least one syllabus outcome.'); return; }
        setError(null);
        setIsLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    state: selectedState,
                    year: String(year),
                    subject,
                    outcomes: chosenOutcomes,
                    difficulty: difficultyKeys[difficulty],
                    text: pastedText,
                    options,
                }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error');
            }
            const data = await response.json();
            setResults(data);
            setLastGenerated(new Date());
        } catch (err) {
            setError(err.message || 'Failed to generate. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    }

    function handleDownloadPDF() {
        if (!results?.worksheetHtml) return;
        const win = window.open('', '_blank');
        win.document.write(results.worksheetHtml);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 500);
    }

    function handleCopyClipboard() {
        if (!results) return;
        const text = results.questions.map((q, i) => `Q${i + 1}) ${q.question}`).join('\n\n');
        navigator.clipboard.writeText(text).then(() => alert('Questions copied to clipboard!'));
    }

    function openWorksheetDetails() {
        if (!results) return;
        setSelectedQuestionId(results.questions[0]?.id ?? null);
        setView('worksheet');
    }

    // Subject change resets outcomes
    function onSubjectChange(s) {
        setSubject(s);
        setChosenOutcomes([]);
        setResults(null);
        setError(null);
    }

    // Year change resets subject + outcomes
    function onYearChange(y) {
        setYear(Number(y));
        setSubject('');
        setChosenOutcomes([]);
        setResults(null);
    }

    const canGenerate = !!subject && chosenOutcomes.length > 0 && !isLoading;

    // ── Render ───────────────────────────────────────────────────
    if (view === 'worksheet') {
        return (
            <WorksheetDetails
                results={results}
                subject={subject}
                year={year}
                selectedState={selectedState}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={setSelectedQuestionId}
                onBack={() => setView('studio')}
                onDownload={handleDownloadPDF}
            />
        );
    }

    return (
        <div className="app-shell">
            <NavBar
                breadcrumbs={[
                    { label: 'Dashboard' },
                    { label: subject || 'Select Subject…', active: true },
                ]}
            />

            <div className="main-area">
                <SidebarSetup
                    states={STATES}
                    selectedState={selectedState}
                    onStateChange={setSelectedState}
                    year={year}
                    onYearChange={onYearChange}
                    subjects={SUBJECTS_BY_YEAR[year] || []}
                    subject={subject}
                    onSubjectChange={onSubjectChange}
                />

                <div className="panels-grid">
                    <PanelInput
                        tab={inputTab}
                        onTabChange={setInputTab}
                        text={pastedText}
                        onTextChange={setPastedText}
                    />

                    <PanelOutcomes
                        availableOutcomes={availableOutcomes}
                        chosenOutcomes={chosenOutcomes}
                        onToggleOutcome={toggleOutcome}
                        difficulty={difficulty}
                        onDifficultyChange={setDifficulty}
                        difficultyLabels={difficultyLabels}
                        options={options}
                        onToggleOption={toggleOption}
                        subject={subject}
                    />

                    <PanelResults
                        subject={subject}
                        canGenerate={canGenerate}
                        isLoading={isLoading}
                        results={results}
                        error={error}
                        onGenerate={handleGenerate}
                        onOpenDetails={openWorksheetDetails}
                    />
                </div>
            </div>

            <BottomBar
                lastGenerated={lastGenerated}
                hasResults={!!results}
                onDownloadPDF={handleDownloadPDF}
                onCopyClipboard={handleCopyClipboard}
            />
        </div>
    );
}
