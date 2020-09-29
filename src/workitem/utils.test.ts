import { shallowTestCaseResultFactory, testMethodInfoFactory } from '../../test/ado-fakes'
import { extractWorkItemId, toTestMethodInfo, toWorkItemTestDto, toWorkItemUpdate, toWorkItemUpdates } from './utils'
import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'

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

  describe('toTestMethod tests', function() {
    it('should convert', function() {
      const testCaseResult = shallowTestCaseResultFactory.build()
      const {refId, id, name} = toTestMethodInfo(testCaseResult)
      expect(refId).toStrictEqual(testCaseResult.refId)
      expect(name).toStrictEqual(testCaseResult.automatedTestName)
      expect(id).toStrictEqual(testCaseResult.id)
    })
  })

  describe('toWorkItemTestAssociationDto test', function() {
    it('should construct a work item test association dto', function() {
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
