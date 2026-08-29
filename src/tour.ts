export interface PrototypeTourStep {
  targetId: string;
  eyebrow: string;
  title: string;
  body: string;
}

export const PROTOTYPE_TOUR_STEPS = [
  {
    targetId: 'examples',
    eyebrow: 'Fictional examples',
    title: 'Choose a case to explore',
    body: 'Each example follows a different split, transfer, fee, silence, reply or appeal path. One choice updates both views.',
  },
  {
    targetId: 'dependency-tree-panel',
    eyebrow: 'Case structure',
    title: 'See how the records are related',
    body: 'The tree reconnects each registration, transfer and reply. Select a node to inspect its details and documents.',
  },
  {
    targetId: 'reply-map-panel',
    eyebrow: 'Question evidence',
    title: 'Check one question at a time',
    body: 'Reply Map links each question to a passage or visible gap. Compare it with the illustrative “Before change” view.',
  },
  {
    targetId: 'why-this-exists',
    eyebrow: 'Public sources',
    title: 'Read the record behind the problem',
    body: 'Official guidance and published files document branching. They show the workflow, not how often people face it.',
  },
  {
    targetId: 'use-your-case',
    eyebrow: 'Custom test',
    title: 'Try redacted JSON locally',
    body: 'Paste or choose redacted JSON. Structure is checked and both views are built locally; you still verify the sources.',
  },
] as const satisfies readonly PrototypeTourStep[];
