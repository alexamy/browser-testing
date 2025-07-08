import type { singleTestMachine, SingleTestMachineContext } from '@framework/react';
import type { StateValueFrom } from 'xstate';

export type SandboxEvent = {
  type: 'update';
  context: SingleTestMachineContext;
  value: StateValueFrom<typeof singleTestMachine>;
  inProgress: boolean;
};

export type RunnerEvent =
  | { type: 'select'; testId: string }
  | { type: 'start' }
  | { type: 'step' }
  | { type: 'restart' };
