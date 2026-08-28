'use client';

import { useState } from 'react';
import { COVERAGE_COPY, type CoverageCode } from '@/src/coverage';
import { summarizeCase, type RTICaseData } from '@/src/case-model';
import { DependencyTree } from './DependencyTree';
import { ReplyMapPanel } from './ReplyMapPanel';

export function CaseWorkspace({ data }: { data: RTICaseData }) {
  const [selectedNodeId, setSelectedNodeId] = useState(data.rootNodeId);
  const [reviews, setReviews] = useState<Record<string, CoverageCode>>({});
  const [liveMessage, setLiveMessage] = useState('');
  const stats = summarizeCase(data);
  const reviewedCount = Object.keys(reviews).length;

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setLiveMessage('RTI registration number copied.');
    } catch {
      setLiveMessage('Copy is unavailable. Select the number and copy it manually.');
    }
  }

  function reviewMapping(mappingId: string, coverage: CoverageCode) {
    setReviews((current) => ({ ...current, [mappingId]: coverage }));
    setLiveMessage(`Your check was kept in this tab as “${COVERAGE_COPY[coverage]}”.`);
  }

  return (
    <>
      <section className="case-summary" aria-labelledby="case-title">
        <div>
          <p className="eyebrow">{data.citizenName}&apos;s {data.fictional ? 'fictional case' : 'redacted local case'} · {data.structureLabel}</p>
          <h2 id="case-title">{data.title}</h2>
          <p className="case-goal">{data.citizenGoal}</p>
        </div>
        <dl className="case-stats">
          <div><dt>Questions</dt><dd>{stats.questions}</dd></div>
          <div><dt>Registrations</dt><dd>{stats.registrations}</dd></div>
          <div><dt>Replies</dt><dd>{stats.replies}</dd></div>
        </dl>
        <div className="case-context"><strong>Why this gets confusing</strong><p>{data.painPoint}</p></div>
        <div className="case-boundary"><strong>{data.source === 'custom' ? 'Local imported case' : 'Fictional demonstration'}</strong><span>{reviewedCount ? `${reviewedCount} result${reviewedCount === 1 ? '' : 's'} checked by you · ` : ''}No automated legal conclusion</span></div>
      </section>
      <div className="workspace-grid" id="workspace">
        <DependencyTree data={data} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} onCopy={copyValue} />
        <ReplyMapPanel
          data={data}
          selectedNodeId={selectedNodeId}
          reviews={reviews}
          onSelectNode={setSelectedNodeId}
          onReview={reviewMapping}
          onResetReviews={() => {
            setReviews({});
            setLiveMessage('Your checks were reset to the proposed results.');
          }}
        />
      </div>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </>
  );
}
