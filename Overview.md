This extension provides a build tasks for linking test execution runs with work items defined in their name.

In the following example all test executions would be linked to work item #12345

```ts
describe('#12345 A group of tests', function () {
  it('does the thing', async function () {
    expect(true).toBeTruthy()
  })
})

//.... other tests

describe('Another group of tests', function () {
  it('#12345 still does the thing', async function () {
    expect(false).toBeFalsy()
  })
})
```
