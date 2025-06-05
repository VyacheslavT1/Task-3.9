module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^shared/(.*)$": "<rootDir>/src/shared/$1",
    "^app/(.*)$": "<rootDir>/src/app/$1",
    "^features/(.*)$": "<rootDir>/src/features/$1",
    "^widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^.+\\.(css|scss)$": "identity-obj-proxy",
    "\\.svg$": "jest-transform-stub",
  },

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
