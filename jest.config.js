/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest',
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.?(s|t).[tj]s?(x)',
  ],
};
