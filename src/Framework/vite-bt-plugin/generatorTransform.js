// Transform second argument of `it` from async function to async generator,
// yielding line number for each statement.
export const generatorTransformPlugin = {
  name: 'test body duplicator',
  visitor: {
    CallExpression: generatorTransform,
  },
};

function generatorTransform(path) {}
