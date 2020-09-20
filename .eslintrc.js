module.exports = {
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "@vue/typescript"
  ],
  rules: {
    "no-console": "off"
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    allowImportExportEverywhere: true
  }
};
