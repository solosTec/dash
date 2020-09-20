module.exports = {
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.(js|jsx)?$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },

  transformIgnorePatterns: ["/node_modules/"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },

  collectCoverage: false,

  collectCoverageFrom: [
    "**/*.{js|jsx|ts|tsx|vue}",
    "!**/node_modules/**",
    "!<rootDir>/dist/**",
    "!<rootDir>/dist-no-auth/**",
    "!<rootDir>/src/plugins/**",
    "!<rootDir>/src/constants/**",
    "!<rootDir>/tests/unit/**",
    "!<rootDir>/coverage/**"
  ],

  coverageReporters: ["lcov", "text-summary"],

  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],

  moduleFileExtensions: ["js", "jsx", "json", "vue", "ts", "tsx"],

  snapshotSerializers: ["jest-serializer-vue"],

  testURL: "http://localhost/",

  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],

  globals: {
    "ts-jest": {
      babelConfig: true
    }
  }
};
