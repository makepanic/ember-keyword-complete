module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
    'no-console': 0,
    'no-multi-spaces': 2,
    'one-var': ['error', 'never'],
    'indent': ['error', 2, { "SwitchCase": 1 }]
  }
};
