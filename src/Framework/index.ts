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

interface TestGeneratedMeta {
  id: string;
  lines: string[];
}

export interface MakeTestSuiteOptions {
  mountId: string;
}

export interface RunTestOptions {
  log(...args: unknown[]): void;
  setGenerator(test: TestGenerator): void;
}

//#region tests
function convertTestWithVitestPlugin(test: TestUserMethod, meta: TestGeneratedMeta | undefined) {
  if (!meta) {
    throw new Error(
      'No meta provided. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  if (!meta.id) {
    throw new Error(
      'Found empty id. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  if (meta.lines.length === 0) {
    throw new Error(
      'Found empty test body source. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  if (test.constructor.name !== 'AsyncGeneratorFunction') {
    throw new Error(
      'Found malformed test body. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  return {
    method: test as unknown as TestMethod,
    meta,
  };
}

export const tests: TestInstance[] = [];

export function it(description: string, test: TestUserMethod, generatedMeta?: TestGeneratedMeta) {
  const { method, meta } = convertTestWithVitestPlugin(test, generatedMeta);
  const instance = { description, method, id: meta.id, lines: meta.lines };
  tests.push(instance);
}
