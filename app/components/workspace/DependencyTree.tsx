'use client';

import { buildCaseTree, NODE_KIND_COPY, type CaseTreeItem, type RTICaseData } from '@/src/case-model';

function TreeBranch({
  item,
  selectedNodeId,
  onSelectNode,
}: {
  item: CaseTreeItem;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}) {
  const { node } = item;
  return (
    <li className="graph-branch">
      {item.incomingEdge ? <span className={`edge-label edge-${item.incomingEdge.kind}`}>{item.incomingEdge.label}</span> : null}
      <button
        type="button"
        className={`graph-node node-${node.kind} ${selectedNodeId === node.id ? 'selected' : ''}`}
        aria-pressed={selectedNodeId === node.id}
        onClick={() => onSelectNode(node.id)}
      >
        <span className="node-kind">{NODE_KIND_COPY[node.kind]}</span>
        <strong>{node.title}</strong>
        {node.registrationNumber ? <code>{node.registrationNumber}</code> : null}
        <small>{node.status ?? node.date}</small>
      </button>
      {item.children.length ? (
        <ol className="graph-children" data-child-count={item.children.length}>
          {item.children.map((child) => (
            <TreeBranch
              item={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
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
  onCopy,
}: {
  data: RTICaseData;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
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
    <section className="workspace-panel tree-panel" aria-labelledby="tree-title">
      <header className="panel-header">
        <div><p className="panel-kicker">1 · Case structure</p><h2 id="tree-title">Dependency tree</h2></div>
        <span className="structure-chip">{data.structureLabel}</span>
      </header>
      <p className="panel-intro">Select a node to see which registration, question, and document it carries.</p>
      <div className="graph-stage">
        <ol className="case-graph" aria-label={`Dependency tree for ${data.title}`}>
          <TreeBranch item={tree} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} />
        </ol>
      </div>
      <aside className="node-inspector" aria-live="polite">
        <div className="inspector-heading"><span>{NODE_KIND_COPY[selectedNode.kind]}</span><strong>{selectedNode.title}</strong></div>
        <p>{selectedNode.summary}</p>
        <dl>
          {selectedNode.office ? <div><dt>Office</dt><dd>{selectedNode.office}</dd></div> : null}
          {selectedNode.date ? <div><dt>Date</dt><dd>{selectedNode.date}</dd></div> : null}
          {selectedNode.registrationNumber ? (
            <div className="inspector-registration"><dt>RTI registration</dt><dd><code>{selectedNode.registrationNumber}</code><button type="button" onClick={() => onCopy(selectedNode.registrationNumber!)}>Copy</button></dd></div>
          ) : null}
        </dl>
        {questions.length ? <p className="inspector-links"><strong>Questions here:</strong> {questions.map((question) => `Q${question.number} ${question.title}`).join(' · ')}</p> : null}
        {documents.length ? <p className="inspector-links"><strong>Documents here:</strong> {documents.map((document) => document.fileName).join(' · ')}</p> : null}
      </aside>
    </section>
  );
}
