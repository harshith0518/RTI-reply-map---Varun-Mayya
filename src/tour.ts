export interface PrototypeTourStep {
  targetId: string;
  eyebrow: string;
  title: string;
  body: string;
}

export const PROTOTYPE_TOUR_STEPS = [
  {
    targetId: 'prototype-overview',
    eyebrow: 'The proposal',
    title: 'Start with the working solution',
    body: 'This prototype combines public workflow evidence, five fictional case structures, a dependency tree, a Reply Map and local custom testing. It is not a government portal.',
  },
  {
    targetId: 'why-this-exists',
    eyebrow: 'Problem evidence',
    title: 'See why a map is needed',
    body: 'Published records show that one RTI can branch into registrations, transfers and replies. They prove the structure exists; they do not measure how common it is.',
  },
  {
    targetId: 'examples',
    eyebrow: 'Five examples',
    title: 'Choose a different case shape',
    body: 'Each fictional example demonstrates a different split, fee, silence, reply or appeal path. Selecting one updates both views below.',
  },
  {
    targetId: 'dependency-tree-panel',
    eyebrow: 'Case structure',
    title: 'Follow the dependency tree',
    body: 'The tree reconnects every event in the prepared case JSON. Select a node to inspect its registration, questions and documents; this is not a live official tracker.',
  },
  {
    targetId: 'reply-map-panel',
    eyebrow: 'Question evidence',
    title: 'Check each original question',
    body: 'Reply Map links every question to a passage or a visible gap. “After change” shows the proposal; “Before change” shows an illustrative unlinked view. Its labels are not official decisions.',
  },
  {
    targetId: 'use-your-case',
    eyebrow: 'Custom test',
    title: 'Try redacted JSON locally',
    body: 'Paste JSON or choose a file. The site validates it and builds both views in this browser with no runtime AI/API. Source accuracy still needs a human check.',
  },
] as const satisfies readonly PrototypeTourStep[];

