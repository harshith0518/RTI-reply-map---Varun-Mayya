'use client';

import { useRef, useState } from 'react';
import { summarizeCase, type RTICaseData } from '@/src/case-model';
import type { SatisfactionChoice } from '@/src/question-actions';
import { DependencyTree } from './DependencyTree';
import { ReplyMapPanel } from './ReplyMapPanel';

function formatFiledOn(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function CaseWorkspace({
  data,
  decisions,
  onDecision,
  onResetDecisions,
}: {
  data: RTICaseData;
  decisions: Record<string, SatisfactionChoice>;
  onDecision: (mappingId: string, choice: SatisfactionChoice) => void;
  onResetDecisions: () => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(data.rootNodeId);
  const [liveMessage, setLiveMessage] = useState('');
  const nodeElements = useRef(new Map<string, HTMLButtonElement>());
  const stats = summarizeCase(data);

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setLiveMessage('RTI registration number copied.');
    } catch {
      setLiveMessage('Copy is unavailable. Select the number and copy it manually.');
    }
  }

  function decideQuestion(mappingId: string, choice: SatisfactionChoice) {
    onDecision(mappingId, choice);
    setLiveMessage(choice === 'satisfied'
      ? 'Marked answered in this tab.'
      : 'A next-step helper is now open below this question.');
  }

  function registerNode(nodeId: string, element: HTMLButtonElement | null) {
    if (element) nodeElements.current.set(nodeId, element);
    else nodeElements.current.delete(nodeId);
  }

  function revealNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    window.requestAnimationFrame(() => {
      const element = nodeElements.current.get(nodeId);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      element?.focus({ preventScroll: true });
    });
  }

  return (
    <>
      <section className="case-summary" aria-labelledby="case-title">
        <div>
          <p className="eyebrow">{data.citizenName}&apos;s {data.fictional ? 'fictional case' : 'redacted local case'} · {data.structureLabel}</p>
          <h2 id="case-title" tabIndex={-1}>{data.title}</h2>
          <p className="case-filing-line">
            Filed <time dateTime={data.filedOn}>{formatFiledOn(data.filedOn)}</time> with {data.authority}
          </p>
        </div>
        <dl className="case-stats">
          <div><dt>Questions</dt><dd>{stats.questions}</dd></div>
          <div><dt>Registrations</dt><dd>{stats.registrations}</dd></div>
          <div><dt>Replies</dt><dd>{stats.replies}</dd></div>
        </dl>
        <div className="case-story-grid" aria-label={`${data.citizenName}'s case story`}>
          <article className="case-story case-story-primary">
            <p className="case-story-label">Why {data.citizenName} filed</p>
            <h3>{data.citizenGoal}</h3>
            <p><strong>What happened next:</strong> {data.scenario}</p>
          </article>
          <article className="case-story case-story-problem">
            <p className="case-story-label">Where the trail gets messy</p>
            <p>{data.painPoint}</p>
            <small>The dependency tree below puts this history back in order.</small>
          </article>
        </div>
        <div className="original-questions">
          <div><strong>What {data.citizenName} asked in the RTI application</strong><span>These are the original questions. The Reply Map checks each one below.</span></div>
          <ol>
            {data.questions.map((question) => (
              <li key={question.id}><span>Q{question.number}</span><div><strong>{question.title}</strong><p>{question.text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>
      <div className="workspace-grid" id="workspace">
        <DependencyTree data={data} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} onRegisterNode={registerNode} onCopy={copyValue} />
        <ReplyMapPanel
          data={data}
          selectedNodeId={selectedNodeId}
          decisions={decisions}
          onSelectNode={setSelectedNodeId}
          onRevealNode={revealNode}
          onDecision={decideQuestion}
          onResetDecisions={() => {
            onResetDecisions();
            setLiveMessage('Your answer checks were cleared from this tab.');
          }}
          onLiveMessage={setLiveMessage}
        />
      </div>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </>
  );
}
