module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',         // if you use "@/…" imports
    },
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
  