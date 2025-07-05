//#region types
export interface TestOptions {
  dummy?: void;
}

export type TestUserMethod = (opts?: TestOptions) => Promise<void>;
export type TestGenerator = AsyncGenerator<number, void, unknown>;
export type TestMethod = (opts?: TestOptions) => TestGenerator;

export interface TestInstance {
  description: string;
  method: TestMethod;
  lines: string[];
  id: string;
}

export interface MakeTestSuiteOptions {
  mountId: string;
}

export interface RunTestOptions {
  log(...args: unknown[]): void;
  setGenerator(test: TestGenerator): void;
}

//#region tests
export const tests: TestInstance[] = [];

function convertTestWithVitestPlugin(
  test: TestUserMethod,
  lines: string[],
  id: string = ''
): TestMethod {
  if (test.constructor.name !== 'AsyncGeneratorFunction') {
    throw new Error(
      'Found malformed test body. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  if (lines.length === 0) {
    throw new Error(
      'Found empty test body source. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  if (!id) {
    throw new Error(
      'Found empty id. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  return test as unknown as TestMethod;
}

export function it(
  description: string,
  test: TestUserMethod,
  lines: string[] = [],
  id: string = ''
) {
  const testGenerator = convertTestWithVitestPlugin(test, lines, id);
  const instance = { id, description, lines, method: testGenerator };
  tests.push(instance);
}
