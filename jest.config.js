const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec|integ))\\.(jsx?|js?|tsx?|ts?)$'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/**/*.test.ts'],
  coverageReporters: ['cobertura', 'lcov', 'text', 'html'],
  reporters: ['default', 'jest-junit'],
  testRegex: TEST_REGEX,
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  setupFiles: ['./test/setup.js'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
