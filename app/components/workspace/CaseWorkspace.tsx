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
  const checkedCount = Object.keys(decisions).length;
  const satisfiedCount = Object.values(decisions).filter((choice) => choice === 'satisfied').length;
  const actionMappings = data.mappings.filter((mapping) => decisions[mapping.id] === 'needs_action');
  const uncheckedCount = data.mappings.length - checkedCount;

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
      <section className="outcome-summary" aria-labelledby="outcome-title">
        <div className="outcome-heading">
          <div>
            <p className="eyebrow">Your call</p>
            <h2 id="outcome-title">Neatly packed. No detective board required.</h2>
          </div>
          <p>{checkedCount} of {data.mappings.length} checked · {satisfiedCount} answered · {actionMappings.length} need a next step · {uncheckedCount} not checked</p>
        </div>
        <div className="outcome-next-step">
          <div>
            <h3>{actionMappings.length ? `${actionMappings.length} next step${actionMappings.length === 1 ? '' : 's'} ready` : checkedCount === data.mappings.length ? 'Your review is complete' : 'Check each original question'}</h3>
            <p>{actionMappings.length ? 'The relevant branch and preparation note sit inside each question above.' : 'Your choices stay in this browser tab and are not sent anywhere.'}</p>
          </div>
          {actionMappings.length > 0 ? (
            <ul>
              {actionMappings.map((mapping) => {
                const question = data.questions.find((item) => item.id === mapping.questionId);
                const node = data.nodes.find((item) => item.id === mapping.nodeId);
                return (
                  <li key={mapping.id}>
                    <span>Q{question?.number ?? '?'}</span>
                    <div><strong>{question?.title ?? 'Question'}</strong><small>{node?.registrationNumber ?? mapping.registrationNumber ?? 'Verify branch registration'}</small></div>
                    <em>Next step ready</em>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </section>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </>
  );
}
