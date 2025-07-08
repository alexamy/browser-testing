import { cleanup } from '@testing-library/react';
import type { TestGenerator, TestInstance } from '.';
import { assign, fromPromise, setup } from 'xstate';

export interface SingleTestMachineInput {
  instance: TestInstance;
}

export interface SingleTestMachineContext {
  instance: TestInstance;
  generator: TestGenerator;
  currentLine?: number;
  isDone: boolean;
}

export type SingleTestMachineEvent = { type: 'start' } | { type: 'step' } | { type: 'restart' };

export const singleTestMachine = setup({
  types: {
    context: {} as SingleTestMachineContext,
    input: {} as SingleTestMachineInput,
    events: {} as SingleTestMachineEvent,
  },
  actions: {
    cleanup: () => cleanup(),
    reset: assign(({ context }) => ({
      generator: context.instance.generator(),
      currentLine: undefined,
      isDone: false,
    })),
  },
  actors: {
    'run step': fromPromise<
      { currentLine?: number; isDone: boolean },
      { generator: TestGenerator }
    >(async ({ input }) => {
      const { value, done } = await input.generator.next();
      const hasLine = value !== undefined && Number.isFinite(value);
      const result = {
        currentLine: hasLine ? value : undefined,
        isDone: Boolean(done),
      };
      return result;
    }),
  },
}).createMachine({
  id: 'single test machine',
  initial: 'ready',
  context: ({ input }) => ({
    instance: input.instance,
    generator: input.instance.generator(),
    currentLine: undefined,
    isDone: false,
  }),
  on: {
    restart: {
      target: '.ready',
      actions: ['cleanup', 'reset'],
    },
  },
  states: {
    ready: {
      on: {
        start: {
          target: 'running',
          actions: ['cleanup'],
        },
        step: {
          target: 'stepping',
        },
      },
    },
    stepping: {
      invoke: {
        src: 'run step',
        input: ({ context }) => ({ generator: context.generator }),
        // TODO: add on error
        onDone: [
          {
            actions: assign(({ event }) => event.output),
            guard: ({ context }) => context.isDone,
            target: 'done',
          },
          {
            actions: assign(({ event }) => event.output),
            target: 'ready',
          },
        ],
      },
    },
    running: {
      invoke: {
        src: 'run step',
        input: ({ context }) => ({ generator: context.generator }),
        onDone: [
          {
            actions: assign(({ event }) => event.output),
            guard: ({ context }) => context.isDone,
            target: 'done',
          },
          {
            reenter: true,
            actions: assign(({ event }) => event.output),
            target: 'running',
          },
        ],
      },
    },
    done: {},
  },
});
