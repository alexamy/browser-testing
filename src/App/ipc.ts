export type SandboxEvent = { type: 'progress-changed'; inProgress: boolean };

export type RunnerEvent = { type: 'select-test'; testId: string } | { type: 'start-test' };
