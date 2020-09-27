import { extractWorkItemId } from './utils'

describe('extractWorkItemId tests', function () {
  describe.each`
    text
    ${'12345'}
    ${'#12345'}
    ${'test.test.#12345 tests / should assert true 1'}
    ${'test.test.A test / Single test for TESTABLE REQUIREMENT #12345'}
    ${'test.test.A test / Testable Requirement #12345 - Test Acceptance Criteria'}
    ${'test.test.Requirement #12345 / should assert true 2'}
    ${'test.test.12345 tests / should assert true 1'}
    ${'test.test.A test / Single test for TESTABLE REQUIREMENT 12345'}
    ${'test.test.A test / Testable Requirement 12345 - Test Acceptance Criteria'}
    ${'test.test.Requirement -12345 / should assert true 2'}
  `('extract work item id from: $text', ({ text }) => {
    it('should return a work item', () => {
      const id = extractWorkItemId(text)
      expect(id).toStrictEqual('12345')
    })
  })

  describe.each`
    text
    ${'1'}
    ${'#1234'}
    ${''}
    ${'null'}
  `('extract work item id from invalid: $text', ({ text }) => {
    it('should return undefined', () => {
      const id = extractWorkItemId(text)
      expect(id).toBeUndefined()
    })
  })
})
