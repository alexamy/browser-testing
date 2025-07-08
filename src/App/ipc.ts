import type { singleTestMachine } from '@framework/react';
import type { StateValueFrom } from 'xstate';

export type SandboxEvent = {
  type: 'update';
  state: StateValueFrom<typeof singleTestMachine>;
  currentLine?: number;
  isDone: boolean;
  inProgress: boolean;
};

export type RunnerEvent =
  | { type: 'select'; testId: string }
  | { type: 'start' }
  | { type: 'step' }
  | { type: 'restart' };
