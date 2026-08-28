'use client';

import { useEffect, useMemo, useState } from 'react';
import { applyHumanReview, isCoverageCode, mapCase, type CoverageCode, type HumanReview } from '@/src/domain';
import { mayaFixture } from '@/src/fixtures';
import {
  createReviewedSummaryHtml,
  DEMO_CASE_DATE,
  getReviewDraft,
  REVIEW_STORAGE_KEY,
} from '@/src/demo';
import { PrototypeDisclosure, StepProgress } from './components/shared';
import { BranchesScreen, QuestionsScreen, WelcomeScreen } from './components/screens/OverviewScreens';
import { EvidenceScreen, ReplyMapScreen } from './components/screens/MappingScreens';
import { ReviewScreen, SummaryScreen } from './components/screens/ReviewScreens';

const DEFAULT_QUESTION_ID = 'maya-q3';

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState(DEFAULT_QUESTION_ID);
  const [reviews, setReviews] = useState<Record<string, HumanReview>>({});
  const [draftLabel, setDraftLabel] = useState<CoverageCode>('partially_addressed');
  const [draftNote, setDraftNote] = useState('');
  const [storageNotice, setStorageNotice] = useState('Your choice stays in this browser. Nothing is sent anywhere.');
  const [liveMessage, setLiveMessage] = useState('');

  const proposals = useMemo(() => mapCase(mayaFixture, DEMO_CASE_DATE), []);
  const proposalByQuestion = useMemo(
    () => Object.fromEntries(proposals.map((proposal) => [proposal.questionId, proposal])),
    [proposals],
  );
  const effectiveMappings = useMemo(
    () => proposals.map((proposal) => applyHumanReview(proposal, reviews[proposal.questionId])),
    [proposals, reviews],
  );
  const selectedQuestion = mayaFixture.questions.find((question) => question.id === selectedQuestionId)!;
  const selectedProposal = proposalByQuestion[selectedQuestionId];
  const selectedEvidence = mayaFixture.evidence.find((passage) => selectedProposal.evidenceIds.includes(passage.id));
  const selectedDocument = mayaFixture.documents.find((document) => document.id === selectedEvidence?.documentId);

  useEffect(() => {
    const readStepFromHash = () => {
      const match = window.location.hash.match(/^#step-(\d)$/);
      const hashStep = Number(match?.[1] ?? 1);
      setStep(hashStep >= 1 && hashStep <= 7 ? hashStep : 1);
    };

    readStepFromHash();
    window.addEventListener('hashchange', readStepFromHash);
    return () => window.removeEventListener('hashchange', readStepFromHash);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(REVIEW_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as Record<string, Partial<HumanReview>>;
        const safe: Record<string, HumanReview> = {};
        for (const question of mayaFixture.questions) {
          const review = parsed[question.id];
          if (
            review?.questionId === question.id
            && isCoverageCode(review.selectedLabel)
            && typeof review.note === 'string'
            && typeof review.reviewedAt === 'string'
          ) {
            safe[question.id] = review as HumanReview;
          }
        }

        setReviews(safe);
        const draft = getReviewDraft(DEFAULT_QUESTION_ID, safe, proposalByQuestion);
        setDraftLabel(draft.label);
        setDraftNote(draft.note);
      } catch {
        setStorageNotice('Browser saving is unavailable. You can still complete the demo in this tab.');
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [proposalByQuestion]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [step]);

  function navigate(nextStep: number) {
    window.location.assign(`#step-${nextStep}`);
    setStep(nextStep);
  }

  function selectQuestion(questionId: string) {
    const draft = getReviewDraft(questionId, reviews, proposalByQuestion);
    setSelectedQuestionId(questionId);
    setDraftLabel(draft.label);
    setDraftNote(draft.note);
  }

  function openEvidence(questionId: string) {
    selectQuestion(questionId);
    navigate(5);
  }

  function saveReview() {
    const review: HumanReview = {
      questionId: selectedQuestionId,
      selectedLabel: draftLabel,
      note: draftNote.trim(),
      reviewedAt: new Date().toISOString(),
    };
    const nextReviews = { ...reviews, [selectedQuestionId]: review };
    setReviews(nextReviews);

    try {
      window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));
      setStorageNotice('Saved in this browser. Nothing was sent anywhere.');
    } catch {
      setStorageNotice('Kept for this tab. Browser saving is unavailable.');
    }

    setLiveMessage(`Saved. The summary now uses ${draftLabel.replaceAll('_', ' ')} for Question ${selectedQuestion.number}.`);
    navigate(7);
  }

  function resetDemo() {
    try {
      window.localStorage.removeItem(REVIEW_STORAGE_KEY);
    } catch {
      // The in-memory reset still works if browser storage is unavailable.
    }

    const defaultDraft = getReviewDraft(DEFAULT_QUESTION_ID, {}, proposalByQuestion);
    setReviews({});
    setSelectedQuestionId(DEFAULT_QUESTION_ID);
    setDraftLabel(defaultDraft.label);
    setDraftNote(defaultDraft.note);
    setStorageNotice('Your choice stays in this browser. Nothing is sent anywhere.');
    setLiveMessage('The sample case was reset to its original suggested results.');
    navigate(1);
  }

  async function copyRegistrationNumber(registrationId: string) {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(registrationId);
      setLiveMessage('RTI registration number copied.');
    } catch {
      setLiveMessage('Copy is unavailable. Select the RTI registration number and copy it manually.');
    }
  }

  function downloadSummary() {
    const html = createReviewedSummaryHtml(mayaFixture, effectiveMappings);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DEMO-maya-reviewed-reply-map.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setLiveMessage('The reviewed sample summary was downloaded.');
  }

  return (
    <main id="main-content" className={`site-shell ${step === 1 ? 'welcome-shell' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate(1)} aria-label="RTI Reply Map home">
          <span className="brand-mark" aria-hidden="true">▤</span>
          <span><strong>RTI Reply Map</strong><small>Question → reply → evidence</small></span>
        </button>
        <span className="demo-pill"><strong>Sample demo</strong><small>Not a government website</small></span>
      </header>
      {step > 1 ? <StepProgress step={step} onNavigate={navigate} /> : null}
      <div className="page-area">
        {step === 1 ? <WelcomeScreen fixture={mayaFixture} effectiveMappings={effectiveMappings} onNavigate={navigate} /> : null}
        {step === 2 ? <QuestionsScreen fixture={mayaFixture} onNavigate={navigate} /> : null}
        {step === 3 ? <BranchesScreen fixture={mayaFixture} onNavigate={navigate} /> : null}
        {step === 4 ? (
          <ReplyMapScreen
            fixture={mayaFixture}
            effectiveMappings={effectiveMappings}
            onOpenEvidence={openEvidence}
            onSelectQuestion={selectQuestion}
            onNavigate={navigate}
          />
        ) : null}
        {step === 5 ? (
          <EvidenceScreen
            fixture={mayaFixture}
            selectedQuestion={selectedQuestion}
            selectedProposal={selectedProposal}
            selectedEvidence={selectedEvidence}
            selectedDocument={selectedDocument}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={selectQuestion}
            onCopyRegistration={copyRegistrationNumber}
            onNavigate={navigate}
          />
        ) : null}
        {step === 6 ? (
          <ReviewScreen
            selectedQuestion={selectedQuestion}
            selectedProposal={selectedProposal}
            draftLabel={draftLabel}
            draftNote={draftNote}
            storageNotice={storageNotice}
            onDraftLabel={setDraftLabel}
            onDraftNote={setDraftNote}
            onSave={saveReview}
            onNavigate={navigate}
          />
        ) : null}
        {step === 7 ? (
          <SummaryScreen
            fixture={mayaFixture}
            effectiveMappings={effectiveMappings}
            onOpenEvidence={openEvidence}
            onDownload={downloadSummary}
            onReset={resetDemo}
            onNavigate={navigate}
          />
        ) : null}
      </div>
      <footer className="site-footer"><PrototypeDisclosure /><p>Built as an independent prototype for safer, clearer RTI reply understanding.</p></footer>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </main>
  );
}
