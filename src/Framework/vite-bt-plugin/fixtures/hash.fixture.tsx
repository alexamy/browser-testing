// @ts-nocheck

it('description', () => {
  const x = 1;
});

// doesn't depend on spaces newlines etc
// prettier-ignore
it('description', () => { const x  =  1; });

describe('group', () => {
  // doesn't depend on indentation
  it('description', () => {
    const x = 1;
  });
});

// depends on async or not
it('description', async () => {
  const x = 1;
});

// depends on description
it('description 2', () => {
  const x = 1;
});

// depends on test body
it('description', () => {
  const y = 2;
});
