import { shallowTestCaseResultFactory } from '../../test/ado-fakes'
import { extractWorkItemId, toWorkItemUpdate, toWorkItemUpdates } from './utils'



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


  describe('toWorkItemUpdate tests', function () {
    it.each`
    testRefId
    ${0}
    ${1}
    ${1000}
    ${-1}
    ${-1000}
  `('should create WorkItemUpdate objects for: $testRefId', function ({ testRefId }) {
      const expectedUrl = `vstfs:///TestManagement/TcmTest/tcm.${testRefId}`
      const workItemUpdate = toWorkItemUpdate(testRefId)
      expect(workItemUpdate).toBeDefined()
      expect(workItemUpdate.value.url).toStrictEqual(expectedUrl)
    })
  })

  describe('toWorkItemUpdates tests', function () {
    it('should return empty for empty array', function () {
      const workItemUpdates = toWorkItemUpdates([])
      expect(workItemUpdates).toStrictEqual([])
    })

    it('should return non-empty for non-empty array', function () {
      const testRef = shallowTestCaseResultFactory.build()
      const expectedUrl = `vstfs:///TestManagement/TcmTest/tcm.${testRef.refId}`
      const workItemUpdates = toWorkItemUpdates([testRef])
      expect(workItemUpdates.length).toStrictEqual(1)
      expect(workItemUpdates[0].value.url).toStrictEqual(expectedUrl)
    })
  })
})
