// Transform second argument of `it` from async function to async generator,
// yielding line number for each statement.
export default function generatorTransformPlugin() {
  return {
    name: 'test body duplicator',
    visitor: {
      CallExpression: generatorTransform,
    },
  };
}

function generatorTransform(path) {}
