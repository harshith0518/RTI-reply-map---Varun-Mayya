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
    eyebrow: 'Question and next step',
    title: 'Decide whether the reply helped you',
    body: 'Read the source, choose yes or no, and open a branch-specific next step beside anything still missing.',
  },
  {
    targetId: 'why-this-exists',
    eyebrow: 'Public sources',
    title: 'Preview the records behind the problem',
    body: 'Open any record in the page, download its image or follow the official source. Every example keeps its caveat.',
  },
  {
    targetId: 'use-your-case',
    eyebrow: 'Custom test',
    title: 'Prompt, JSON, check, load',
    body: 'Copy the optional prompt, then paste or upload redacted JSON. The site checks structure and builds both views locally.',
  },
] as const satisfies readonly PrototypeTourStep[];
