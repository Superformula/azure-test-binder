import { shallowTestCaseResultFactory, testMethodInfoFactory } from '../../test/ado-fakes'
import { extractWorkItemId, toTestMethodInfo, toWorkItemTestDto, toWorkItemUpdate, toWorkItemUpdates } from './utils'

describe('extractWorkItemId tests', function () {
  const baseResult = '12345';

  describe.each`
    text | result
    ${'#1'} | ${'1'}
    ${'#12'} | ${'12'}
    ${'#123'} | ${'123'}
    ${'#1234'} | ${'1234'}
    ${'12345'} | ${baseResult}
    ${'#12345'}  | ${baseResult}
    ${'#12345678910'} | ${'12345678910'}
    ${'test.test.#12345 tests / should assert true 1'}  | ${baseResult}
    ${'test.test.A test / Single test for TESTABLE REQUIREMENT #12345'}  | ${baseResult}
    ${'test.test.A test / Testable Requirement #12345 - Test Acceptance Criteria'}  | ${baseResult}
    ${'test.test.Requirement #12345 / should assert true 2'}  | ${baseResult}
    ${'test.test.12345 tests / should assert true 1'}  | ${baseResult}
    ${'test.test.A test / Single test for TESTABLE REQUIREMENT 12345'}  | ${baseResult}
    ${'test.test.A test / Testable Requirement 12345 - Test Acceptance Criteria'}  | ${baseResult}
    ${'test.test.Requirement -12345 / should assert true 2'}  | ${baseResult}
  `('extract work item id from: $text', ({ text, result }) => {
    it('should return a work item', () => {
      const id = extractWorkItemId(text)
      expect(id).toStrictEqual(result)
    })
  })

  describe.each`
    text
    ${'1'}
    ${'1123'}
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
      expect(workItemUpdate[0].value.url).toStrictEqual(expectedUrl)
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
      const [workItemUpdates] = toWorkItemUpdates([testRef])
      expect(workItemUpdates[0].value.url).toStrictEqual(expectedUrl)
    })
  })

  describe('toTestMethod tests', function () {
    it('should convert', function () {
      const testCaseResult = shallowTestCaseResultFactory.build()
      const { refId, id, name } = toTestMethodInfo(testCaseResult)
      expect(refId).toStrictEqual(testCaseResult.refId)
      expect(name).toStrictEqual(testCaseResult.automatedTestName)
      expect(id).toStrictEqual(testCaseResult.id)
    })
  })

  describe('toWorkItemTestAssociationDto test', function () {
    it('should construct a work item test association dto', function () {
      const testMethod = testMethodInfoFactory.build()
      const id = 12345
      const { testId, testName, testRefId, workItemId } = toWorkItemTestDto(id, testMethod)
      expect(testId).toStrictEqual(testMethod.id)
      expect(testName).toStrictEqual(testMethod.name)
      expect(testRefId).toStrictEqual(testMethod.refId)
      expect(workItemId).toStrictEqual(id)
    })
  })
})
