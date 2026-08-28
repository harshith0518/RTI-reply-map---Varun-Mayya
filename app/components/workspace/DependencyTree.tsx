'use client';

import type { CSSProperties } from 'react';
import { buildCaseTree, NODE_KIND_COPY, type CaseTreeItem, type RTICaseData } from '@/src/case-model';

function TreeBranch({
  item,
  selectedNodeId,
  onSelectNode,
  onRegisterNode,
}: {
  item: CaseTreeItem;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onRegisterNode: (nodeId: string, element: HTMLButtonElement | null) => void;
}) {
  const { node } = item;
  const edgeLabelId = item.incomingEdge ? `tree-edge-${item.incomingEdge.id}` : undefined;

  return (
    <li className="graph-branch">
      <div className={`graph-node-shell ${item.incomingEdge ? 'has-edge' : ''}`}>
        {item.incomingEdge ? (
          <span id={edgeLabelId} className={`edge-label edge-${item.incomingEdge.kind}`}>{item.incomingEdge.label}</span>
        ) : null}
        <button
          ref={(element) => onRegisterNode(node.id, element)}
          type="button"
          className={`graph-node node-${node.kind} ${selectedNodeId === node.id ? 'selected' : ''}`}
          aria-pressed={selectedNodeId === node.id}
          aria-describedby={edgeLabelId}
          aria-controls="node-inspector"
          onClick={() => onSelectNode(node.id)}
        >
          <span className="node-kind"><span className="node-kind-dot" aria-hidden="true" />{NODE_KIND_COPY[node.kind]}</span>
          <strong>{node.title}</strong>
          {node.registrationNumber ? <code>{node.registrationNumber}</code> : null}
          <span className="node-meta">
            {node.status ? <small>{node.status}</small> : null}
            {node.date ? <time dateTime={node.date}>{node.date}</time> : null}
          </span>
        </button>
      </div>
      {item.children.length ? (
        <ol
          className={`graph-children ${item.children.length > 3 ? 'graph-children-stacked' : ''}`}
          data-child-count={item.children.length}
          style={{ '--child-count': item.children.length } as CSSProperties}
        >
          {item.children.map((child) => (
            <TreeBranch
              item={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onRegisterNode={onRegisterNode}
              key={child.node.id}
            />
          ))}
        </ol>
      ) : null}
    </li>
  );
}

export function DependencyTree({
  data,
  selectedNodeId,
  onSelectNode,
  onRegisterNode,
  onCopy,
}: {
  data: RTICaseData;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onRegisterNode: (nodeId: string, element: HTMLButtonElement | null) => void;
  onCopy: (value: string) => void;
}) {
  const tree = buildCaseTree(data);
  const selectedNode = data.nodes.find((node) => node.id === selectedNodeId) ?? data.nodes[0];
  const questions = (selectedNode.questionIds ?? [])
    .map((questionId) => data.questions.find((question) => question.id === questionId))
    .filter((question) => question !== undefined);
  const documents = (selectedNode.documentIds ?? [])
    .map((documentId) => data.documents.find((document) => document.id === documentId))
    .filter((document) => document !== undefined);

  return (
    <section className="workspace-panel tree-panel" id="dependency-tree-panel" aria-labelledby="tree-title">
      <header className="panel-header">
        <div><p className="panel-kicker">1 · Case structure</p><h2 id="tree-title">Dependency tree</h2></div>
        <span className="structure-chip">{data.structureLabel}</span>
      </header>
      <p className="panel-intro">Select an event to see its registration, questions, and documents.</p>
      <div className="graph-stage">
        <ol className="case-graph" aria-label={`Dependency tree for ${data.title}`}>
          <TreeBranch item={tree} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} onRegisterNode={onRegisterNode} />
        </ol>
      </div>
      <aside className="node-inspector" id="node-inspector" aria-live="polite">
        <div className="inspector-heading"><span>{NODE_KIND_COPY[selectedNode.kind]}</span><strong>{selectedNode.title}</strong></div>
        <p>{selectedNode.summary}</p>
        <dl>
          {selectedNode.office ? <div><dt>Office</dt><dd>{selectedNode.office}</dd></div> : null}
          {selectedNode.date ? <div><dt>Date</dt><dd>{selectedNode.date}</dd></div> : null}
          {selectedNode.registrationNumber ? (
            <div className="inspector-registration"><dt>RTI registration</dt><dd><code>{selectedNode.registrationNumber}</code><button type="button" aria-label={`Copy RTI registration number ${selectedNode.registrationNumber}`} onClick={() => onCopy(selectedNode.registrationNumber!)}>Copy</button></dd></div>
          ) : null}
        </dl>
        {questions.length ? <p className="inspector-links"><strong>Questions:</strong> {questions.map((question) => `Q${question.number} ${question.title}`).join(' · ')}</p> : null}
        {documents.length ? <p className="inspector-links"><strong>Documents:</strong> {documents.map((document) => document.fileName).join(' · ')}</p> : null}
      </aside>
    </section>
  );
}
