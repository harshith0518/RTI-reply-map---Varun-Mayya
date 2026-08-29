export interface PrototypeTourStep {
  targetId: string;
  eyebrow: string;
  title: string;
  body: string;
}

export const PROTOTYPE_TOUR_STEPS = [
  {
    targetId: 'examples',
    eyebrow: 'Fictional citizen cases',
    title: 'Start with a citizen, not a file number',
    body: 'Five fictional cases cover split replies, transfers, fees, silence and appeals. Choosing one updates the dependency tree and Reply Map together.',
  },
  {
    targetId: 'dependency-tree-panel',
    eyebrow: 'Connected case trail',
    title: 'See where one request travelled',
    body: 'The tree reconnects the application, branch registrations, transfers and replies. A node exposes its office, date, linked questions and documents without tab-hopping.',
  },
  {
    targetId: 'reply-map-panel',
    eyebrow: 'Question-by-question review',
    title: 'Put every answer beside its question',
    body: 'Compare separate records with the proposed Reply Map: each original question links to its branch, passage and page. The citizen decides Yes or No; No reveals the relevant preparation note and official handoff links.',
  },
  {
    targetId: 'why-this-exists',
    eyebrow: 'Public workflow evidence',
    title: 'Check the public record behind the problem',
    body: 'Six caveated public records show that multiple registrations, transfers, replies and branch-specific appeals can occur. Each has an in-page preview, downloadable image and official source.',
  },
  {
    targetId: 'use-your-case',
    eyebrow: 'Local custom case',
    title: 'Test the same flow with redacted JSON',
    body: 'A reviewer can copy the optional prompt or use sample JSON, validate it, then load the same tree and Reply Map. Data stays in this tab; source facts still need human verification.',
  },
] as const satisfies readonly PrototypeTourStep[];
