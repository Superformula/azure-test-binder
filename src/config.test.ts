import { URL } from 'url'

import { token, orgUrl } from './config'

describe('configuration test', function () {
  it('should have the PAT in the environment', function () {
    expect(token).toBeTruthy()
  })

  it('should have the ORG in the environment', function () {
    expect(isValidUrl(orgUrl)).toBeTruthy()
  })
})

const isValidUrl = (url) => {
  try {
    new URL(url)
  } catch (_) {
    return false
  }

  return true
}
