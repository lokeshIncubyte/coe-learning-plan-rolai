/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(e2e-spec|spec)\\.ts$',
  setupFiles: ['<rootDir>/../test/jest.setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': [require.resolve('ts-jest'), {}],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
