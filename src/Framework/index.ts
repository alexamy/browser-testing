//#region types
export interface TestOptions {
  dummy?: void;
}

export type TestUserMethod = (opts?: TestOptions) => Promise<void>;
export type TestGenerator = AsyncGenerator<number, void, unknown>;
export type TestMethod = (opts?: TestOptions) => TestGenerator;

export interface TestInstance {
  description: string;
  id: string;
  lines: string[];
  generator: TestMethod;
}

interface TestGeneratedMeta {
  id: string;
  lines: string[];
  generator: TestMethod;
}

export interface MakeTestSuiteOptions {
  mountId: string;
}

export interface RunTestOptions {
  log(...args: unknown[]): void;
  setGenerator(test: TestGenerator): void;
}

//#region tests
function validateGeneratedMeta(meta: TestGeneratedMeta | undefined) {
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

  if (meta.generator.constructor.name !== 'AsyncGeneratorFunction') {
    throw new Error(
      'Found malformed test body. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  return meta;
}

export const tests: TestInstance[] = [];

export function it(description: string, test: TestUserMethod, generatedMeta?: TestGeneratedMeta) {
  const meta = validateGeneratedMeta(generatedMeta);
  const instance = { ...meta, description };
  tests.push(instance);
}
