import { COVERAGE_COPY, type CoverageCode } from './coverage.ts';

export const CASE_SCHEMA_VERSION = '1.0' as const;
export const MAX_CASE_JSON_BYTES = 512 * 1024;

const CASE_LIMITS = {
  questions: 50,
  nodes: 200,
  edges: 250,
  documents: 200,
  mappings: 100,
  text: 8_000,
} as const;

export const CASE_NODE_KINDS = [
  'application',
  'registration',
  'transfer',
  'reply',
  'no_reply',
  'fee_notice',
  'payment',
  'appeal',
  'appeal_order',
  'supplemental_reply',
] as const;

export type CaseNodeKind = (typeof CASE_NODE_KINDS)[number];

export const CASE_EDGE_KINDS = [
  'registered_as',
  'transferred_to',
  'split_to',
  'replied_with',
  'no_reply_observed',
  'fee_requested',
  'fee_paid',
  'appealed_as',
  'ordered',
  'supplemented_by',
] as const;

export type CaseEdgeKind = (typeof CASE_EDGE_KINDS)[number];

export interface CaseQuestion {
  id: string;
  number: number;
  title: string;
  text: string;
}

export interface CaseNode {
  id: string;
  kind: CaseNodeKind;
  title: string;
  summary: string;
  date?: string;
  status?: string;
  office?: string;
  registrationNumber?: string;
  appealNumber?: string;
  questionIds?: string[];
  documentIds?: string[];
}

export interface CaseEdge {
  id: string;
  from: string;
  to: string;
  kind: CaseEdgeKind;
  label: string;
}

export type CaseDocumentKind =
  | 'substantive_reply'
  | 'supplemental_reply'
  | 'transfer_notice'
  | 'appeal_order'
  | 'fee_notice'
  | 'attachment';

export interface CaseDocument {
  id: string;
  title: string;
  kind: CaseDocumentKind;
  fileName: string;
  registrationNumber?: string;
  issuedOn?: string;
  assetPath?: string;
}

export interface ReplyMapping {
  id: string;
  questionId: string;
  nodeId: string;
  documentId?: string;
  registrationNumber?: string;
  coverage: CoverageCode;
  passage?: string;
  location?: string;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  missingDetail?: string;
  temporalQualifier?: string;
}

export interface RTICaseData {
  schemaVersion: typeof CASE_SCHEMA_VERSION;
  caseId: string;
  source: 'synthetic' | 'custom';
  fictional: boolean;
  title: string;
  citizenName: string;
  citizenGoal: string;
  scenario: string;
  painPoint: string;
  filedOn: string;
  authority: string;
  rootNodeId: string;
  structureLabel: string;
  tags: string[];
  questions: CaseQuestion[];
  nodes: CaseNode[];
  edges: CaseEdge[];
  documents: CaseDocument[];
  mappings: ReplyMapping[];
}

export interface CaseTreeItem {
  node: CaseNode;
  incomingEdge?: CaseEdge;
  children: CaseTreeItem[];
}

export interface CaseValidationResult {
  ok: boolean;
  errors: string[];
  data?: RTICaseData;
}

export const NODE_KIND_COPY: Record<CaseNodeKind, string> = {
  application: 'Original application',
  registration: 'RTI registration',
  transfer: 'Authority transfer',
  reply: 'Reply received',
  no_reply: 'No reply recorded',
  fee_notice: 'Additional-fee notice',
  payment: 'Fee paid',
  appeal: 'First appeal',
  appeal_order: 'Appeal order',
  supplemental_reply: 'Supplemental reply',
};

export const EDGE_KIND_COPY: Record<CaseEdgeKind, string> = {
  registered_as: 'registered as',
  transferred_to: 'transferred to',
  split_to: 'forwarded to',
  replied_with: 'replied with',
  no_reply_observed: 'no reply observed',
  fee_requested: 'fee requested',
  fee_paid: 'fee paid',
  appealed_as: 'appealed as',
  ordered: 'order received',
  supplemented_by: 'followed by',
};

function unique(values: string[]) {
  return new Set(values).size === values.length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isReasonableText(value: unknown) {
  return typeof value !== 'string' || value.length <= CASE_LIMITS.text;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(hasText);
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateTopLevelShape(value: unknown, errors: string[]): value is RTICaseData {
  if (!isRecord(value)) {
    errors.push('The imported JSON must be one object.');
    return false;
  }

  const requiredText = [
    'caseId', 'title', 'citizenName', 'citizenGoal', 'scenario', 'painPoint',
    'filedOn', 'authority', 'rootNodeId', 'structureLabel',
  ];
  for (const key of requiredText) {
    if (!hasText(value[key])) errors.push(`${key} must be a non-empty string.`);
  }
  if (value.schemaVersion !== CASE_SCHEMA_VERSION) errors.push(`schemaVersion must be "${CASE_SCHEMA_VERSION}".`);
  if (value.source !== 'synthetic' && value.source !== 'custom') errors.push('source must be "synthetic" or "custom".');
  if (typeof value.fictional !== 'boolean') errors.push('fictional must be true or false.');
  if (hasText(value.filedOn) && !isIsoDate(value.filedOn)) errors.push('filedOn must use YYYY-MM-DD.');
  if (!isStringArray(value.tags)) errors.push('tags must be an array of non-empty strings.');
  for (const key of ['questions', 'nodes', 'edges', 'documents', 'mappings']) {
    if (!Array.isArray(value[key])) errors.push(`${key} must be an array.`);
  }

  if (Array.isArray(value.questions) && value.questions.length > CASE_LIMITS.questions) errors.push(`questions cannot exceed ${CASE_LIMITS.questions} items.`);
  if (Array.isArray(value.nodes) && value.nodes.length > CASE_LIMITS.nodes) errors.push(`nodes cannot exceed ${CASE_LIMITS.nodes} items.`);
  if (Array.isArray(value.edges) && value.edges.length > CASE_LIMITS.edges) errors.push(`edges cannot exceed ${CASE_LIMITS.edges} items.`);
  if (Array.isArray(value.documents) && value.documents.length > CASE_LIMITS.documents) errors.push(`documents cannot exceed ${CASE_LIMITS.documents} items.`);
  if (Array.isArray(value.mappings) && value.mappings.length > CASE_LIMITS.mappings) errors.push(`mappings cannot exceed ${CASE_LIMITS.mappings} items.`);
  for (const [key, field] of Object.entries(value)) {
    if (!isReasonableText(field)) errors.push(`${key} is too long.`);
  }
  return errors.length === 0;
}

export function validateCaseData(value: unknown): CaseValidationResult {
  const errors: string[] = [];
  if (!validateTopLevelShape(value, errors)) return { ok: false, errors };

  const data = value as RTICaseData;
  const questionIds: string[] = [];
  const questionNumbers: number[] = [];
  const nodeIds: string[] = [];
  const edgeIds: string[] = [];
  const documentIds: string[] = [];
  const mappingIds: string[] = [];

  data.questions.forEach((question, index) => {
    if (!isRecord(question)) {
      errors.push(`questions[${index}] must be an object.`);
      return;
    }
    if (!hasText(question.id)) errors.push(`questions[${index}].id is required.`);
    else questionIds.push(question.id);
    if (!Number.isInteger(question.number) || Number(question.number) < 1) errors.push(`questions[${index}].number must be a positive integer.`);
    else questionNumbers.push(Number(question.number));
    if (!hasText(question.title)) errors.push(`questions[${index}].title is required.`);
    if (!hasText(question.text)) errors.push(`questions[${index}].text is required.`);
  });

  data.nodes.forEach((node, index) => {
    if (!isRecord(node)) {
      errors.push(`nodes[${index}] must be an object.`);
      return;
    }
    if (!hasText(node.id)) errors.push(`nodes[${index}].id is required.`);
    else nodeIds.push(node.id);
    if (!CASE_NODE_KINDS.includes(node.kind as CaseNodeKind)) errors.push(`nodes[${index}].kind is not supported.`);
    if (!hasText(node.title)) errors.push(`nodes[${index}].title is required.`);
    if (!hasText(node.summary)) errors.push(`nodes[${index}].summary is required.`);
    if (node.date !== undefined && (!hasText(node.date) || !isIsoDate(node.date))) errors.push(`nodes[${index}].date must use YYYY-MM-DD.`);
    if (node.questionIds !== undefined && !isStringArray(node.questionIds)) errors.push(`nodes[${index}].questionIds must be a string array.`);
    if (node.documentIds !== undefined && !isStringArray(node.documentIds)) errors.push(`nodes[${index}].documentIds must be a string array.`);
  });

  data.edges.forEach((edge, index) => {
    if (!isRecord(edge)) {
      errors.push(`edges[${index}] must be an object.`);
      return;
    }
    if (!hasText(edge.id)) errors.push(`edges[${index}].id is required.`);
    else edgeIds.push(edge.id);
    if (!hasText(edge.from)) errors.push(`edges[${index}].from is required.`);
    if (!hasText(edge.to)) errors.push(`edges[${index}].to is required.`);
    if (hasText(edge.from) && edge.from === edge.to) errors.push(`edges[${index}] cannot connect a node to itself.`);
    if (!CASE_EDGE_KINDS.includes(edge.kind as CaseEdgeKind)) errors.push(`edges[${index}].kind is not supported.`);
    if (!hasText(edge.label)) errors.push(`edges[${index}].label is required.`);
  });

  data.documents.forEach((document, index) => {
    if (!isRecord(document)) {
      errors.push(`documents[${index}] must be an object.`);
      return;
    }
    if (!hasText(document.id)) errors.push(`documents[${index}].id is required.`);
    else documentIds.push(document.id);
    if (!hasText(document.title)) errors.push(`documents[${index}].title is required.`);
    if (!hasText(document.fileName)) errors.push(`documents[${index}].fileName is required.`);
    if (document.issuedOn !== undefined && (!hasText(document.issuedOn) || !isIsoDate(document.issuedOn))) errors.push(`documents[${index}].issuedOn must use YYYY-MM-DD.`);
    if (!['substantive_reply', 'supplemental_reply', 'transfer_notice', 'appeal_order', 'fee_notice', 'attachment'].includes(String(document.kind))) {
      errors.push(`documents[${index}].kind is not supported.`);
    }
    if (document.assetPath !== undefined) {
      if (!hasText(document.assetPath) || !document.assetPath.startsWith('/replies/')) errors.push(`documents[${index}].assetPath must be an allowlisted /replies/ path.`);
      if (data.source === 'custom') errors.push(`documents[${index}].assetPath is not allowed in custom cases.`);
    }
  });

  data.mappings.forEach((mapping, index) => {
    if (!isRecord(mapping)) {
      errors.push(`mappings[${index}] must be an object.`);
      return;
    }
    if (!hasText(mapping.id)) errors.push(`mappings[${index}].id is required.`);
    else mappingIds.push(mapping.id);
    if (!hasText(mapping.questionId)) errors.push(`mappings[${index}].questionId is required.`);
    if (!hasText(mapping.nodeId)) errors.push(`mappings[${index}].nodeId is required.`);
    if (!Object.hasOwn(COVERAGE_COPY, String(mapping.coverage))) errors.push(`mappings[${index}].coverage is not supported.`);
    if (!['high', 'medium', 'low'].includes(String(mapping.confidence))) errors.push(`mappings[${index}].confidence is not supported.`);
    if (!hasText(mapping.explanation)) errors.push(`mappings[${index}].explanation is required.`);
  });

  for (const [label, ids] of [
    ['question', questionIds], ['node', nodeIds], ['edge', edgeIds], ['document', documentIds], ['mapping', mappingIds],
  ] as const) {
    if (!unique(ids)) errors.push(`${label} IDs must be unique.`);
  }
  if (!unique(questionNumbers.map(String))) errors.push('Question numbers must be unique.');

  const questionSet = new Set(questionIds);
  const nodeSet = new Set(nodeIds);
  const documentSet = new Set(documentIds);
  const documentById = new Map(data.documents.map((document) => [document.id, document]));
  if (!nodeSet.has(data.rootNodeId)) errors.push('rootNodeId must reference an existing node.');
  else if (data.nodes.find((node) => node.id === data.rootNodeId)?.kind !== 'application') errors.push('The root node must be an application.');

  const incoming = new Map<string, number>();
  const children = new Map<string, string[]>();
  for (const edge of data.edges) {
    if (!nodeSet.has(edge.from)) errors.push(`Edge ${edge.id} references missing from-node ${edge.from}.`);
    if (!nodeSet.has(edge.to)) errors.push(`Edge ${edge.id} references missing to-node ${edge.to}.`);
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    children.set(edge.from, [...(children.get(edge.from) ?? []), edge.to]);
  }
  for (const nodeId of nodeIds) {
    const count = incoming.get(nodeId) ?? 0;
    if (nodeId === data.rootNodeId && count !== 0) errors.push('The root node cannot have a parent edge.');
    if (nodeId !== data.rootNodeId && count !== 1) errors.push(`Node ${nodeId} must have exactly one parent edge.`);
  }

  const visited = new Set<string>();
  const active = new Set<string>();
  let cycleFound = false;
  const visit = (nodeId: string) => {
    if (active.has(nodeId)) {
      cycleFound = true;
      return;
    }
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    active.add(nodeId);
    for (const childId of children.get(nodeId) ?? []) visit(childId);
    active.delete(nodeId);
  };
  visit(data.rootNodeId);
  if (cycleFound) errors.push('The case graph contains a cycle; it must be a dependency tree.');
  if (visited.size !== nodeIds.length) errors.push('Every node must be connected to the root node.');

  for (const node of data.nodes) {
    for (const questionId of node.questionIds ?? []) {
      if (!questionSet.has(questionId)) errors.push(`Node ${node.id} references missing question ${questionId}.`);
    }
    for (const documentId of node.documentIds ?? []) {
      if (!documentSet.has(documentId)) errors.push(`Node ${node.id} references missing document ${documentId}.`);
    }
  }

  for (const mapping of data.mappings) {
    if (!questionSet.has(mapping.questionId)) errors.push(`Mapping ${mapping.id} references missing question ${mapping.questionId}.`);
    if (!nodeSet.has(mapping.nodeId)) errors.push(`Mapping ${mapping.id} references missing node ${mapping.nodeId}.`);
    if (mapping.documentId && !documentSet.has(mapping.documentId)) errors.push(`Mapping ${mapping.id} references missing document ${mapping.documentId}.`);
    if (mapping.coverage === 'answer_located' || mapping.coverage === 'partially_addressed') {
      if (!hasText(mapping.documentId) || !hasText(mapping.passage) || !hasText(mapping.location)) {
        errors.push(`Mapping ${mapping.id} needs a documentId, exact passage, and location for a positive result.`);
      }
      const evidenceDocument = mapping.documentId ? documentById.get(mapping.documentId) : undefined;
      if (evidenceDocument && ['transfer_notice', 'appeal_order', 'fee_notice'].includes(evidenceDocument.kind)) {
        errors.push(`Mapping ${mapping.id} cannot use a procedural document as answer evidence.`);
      }
    }
  }

  const mappingCount = new Map<string, number>();
  for (const mapping of data.mappings) mappingCount.set(mapping.questionId, (mappingCount.get(mapping.questionId) ?? 0) + 1);
  for (const questionId of questionIds) {
    const count = mappingCount.get(questionId) ?? 0;
    if (count !== 1) errors.push(`Question ${questionId} needs exactly one Reply Map result; found ${count}.`);
  }

  return errors.length ? { ok: false, errors } : { ok: true, errors: [], data };
}

export function parseCaseJson(input: string): CaseValidationResult {
  if (!input.trim()) return { ok: false, errors: ['Paste JSON or choose a .json file first.'] };
  if (new TextEncoder().encode(input).length > MAX_CASE_JSON_BYTES) {
    return { ok: false, errors: ['This JSON is larger than 512 KB. Reduce the case or remove embedded content.'] };
  }
  try {
    return validateCaseData(JSON.parse(input));
  } catch (error) {
    return {
      ok: false,
      errors: [`The file is not valid JSON: ${error instanceof Error ? error.message : 'Unknown parse error'}`],
    };
  }
}

export function buildCaseTree(data: RTICaseData): CaseTreeItem {
  const nodeById = new Map(data.nodes.map((node) => [node.id, node]));
  const edgesByFrom = new Map<string, CaseEdge[]>();
  for (const edge of data.edges) edgesByFrom.set(edge.from, [...(edgesByFrom.get(edge.from) ?? []), edge]);

  const build = (nodeId: string, incomingEdge?: CaseEdge): CaseTreeItem => ({
    node: nodeById.get(nodeId)!,
    incomingEdge,
    children: (edgesByFrom.get(nodeId) ?? []).map((edge) => build(edge.to, edge)),
  });
  return build(data.rootNodeId);
}

export function summarizeCase(data: RTICaseData) {
  const counts = Object.fromEntries(Object.keys(COVERAGE_COPY).map((code) => [code, 0])) as Record<CoverageCode, number>;
  for (const mapping of data.mappings) counts[mapping.coverage] += 1;
  return {
    registrations: new Set(data.nodes.flatMap((node) => node.registrationNumber ? [node.registrationNumber] : [])).size,
    replies: data.nodes.filter((node) => node.kind === 'reply' || node.kind === 'supplemental_reply').length,
    questions: data.questions.length,
    mappings: data.mappings.length,
    coverage: counts,
  };
}
