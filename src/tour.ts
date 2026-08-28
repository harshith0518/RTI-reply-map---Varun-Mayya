export interface PrototypeTourStep {
  targetId: string;
  eyebrow: string;
  title: string;
  body: string;
}

export const PROTOTYPE_TOUR_STEPS = [
  {
    targetId: 'prototype-overview',
    eyebrow: 'Start here',
    title: 'Try the proposal as a reviewer',
    body: 'Choose a fictional case, read its tree and Reply Map, then check the public records below. This is an independent prototype, not a government portal.',
  },
  {
    targetId: 'examples',
    eyebrow: 'Fictional examples',
    title: 'Choose a case to explore',
    body: 'Each example follows a different split, transfer, fee, silence, reply or appeal path. Selecting one updates both views below.',
  },
  {
    targetId: 'dependency-tree-panel',
    eyebrow: 'Case structure',
    title: 'See how the records are related',
    body: 'The tree reconnects every event in the prepared case JSON. Select a node to inspect its registration, questions and documents; this is not a live official tracker.',
  },
  {
    targetId: 'reply-map-panel',
    eyebrow: 'Question evidence',
    title: 'Check one question at a time',
    body: 'Reply Map links every question to a passage or a visible gap. “After change” shows the proposal; “Before change” shows an illustrative unlinked view. Its labels are not official decisions.',
  },
  {
    targetId: 'why-this-exists',
    eyebrow: 'Public sources',
    title: 'Read the record behind the problem',
    body: 'Official guidance and published RTI files document registrations, transfers and separate replies. They show the workflow, not how common the problem is or how citizens experience it.',
  },
  {
    targetId: 'use-your-case',
    eyebrow: 'Custom test',
    title: 'Try redacted JSON locally',
    body: 'Paste JSON or choose a file. The site validates it and builds both views in this browser with no runtime AI/API. Source accuracy still needs a human check.',
  },
] as const satisfies readonly PrototypeTourStep[];
