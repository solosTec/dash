module.exports = {

    transform: {
      '^.+\\.vue$': 'vue-jest',
      '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
      '^.+\\.(js|jsx)?$': 'babel-jest',
      '^.+\\.jsx?$': 'babel-jest'
    },

    transformIgnorePatterns: [
        '/node_modules/'
    ],

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },

    collectCoverage: true,

    collectCoverageFrom: ['**/*.{vue}', '!**/node_modules/**', '!<rootDir>/dist/**',
        '!<rootDir>/src/plugins/**', '!<rootDir>/tests/unit/**'
    ],
    coverageReporters: ['lcov', 'text-summary'],

    testMatch: [
        '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
    ],

    moduleFileExtensions: [
      'js',
      'jsx',
      'json',
      'vue'
    ],

    snapshotSerializers: [
      'jest-serializer-vue'
    ],

    testURL: 'http://localhost/',

    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname'
    ]
};
