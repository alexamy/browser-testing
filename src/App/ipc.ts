export type SandboxEvent = { type: 'progress-changed'; inProgress: boolean };

export type RunnerEvent = { type: 'select'; testId: string } | { type: 'start' };
