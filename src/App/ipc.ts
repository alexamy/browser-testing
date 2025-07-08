import type { singleTestMachine } from '@framework/machine';
import type { StateValueFrom } from 'xstate';

export type SandboxEvent = {
  type: 'update';
  state: StateValueFrom<typeof singleTestMachine>;
  currentTest: string;
  currentLine?: number;
  isDone: boolean;
  inProgress: boolean;
  logs: string[];
};

export type RunnerEvent =
  | { type: 'select'; testId: string }
  | { type: 'start' }
  | { type: 'step' }
  | { type: 'restart' };
