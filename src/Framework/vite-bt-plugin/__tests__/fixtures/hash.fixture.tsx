// @ts-nocheck

// id #1
it('description', () => {
  const x = 1;
});

// id #1 - persist for the same call
it('description', () => {
  const x = 1;
});

// id #1 - doesn't depend on spaces newlines etc
// prettier-ignore
it('description', () => { const x  =  1; });

describe('group', () => {
  // id #1 - doesn't depend on indentation
  it('description', () => {
    const x = 1;
  });
});

// id #2 - depends on description
it('description 2', () => {
  const x = 1;
});

// id #3 - depends on test body
it('description', () => {
  const y = 2;
});

// id #4 - depends on async or not
it('description', async () => {
  const x = 1;
});

// id #4 - is the same as previous, but different for async
it('description', async () => {
  const x = 1;
});
