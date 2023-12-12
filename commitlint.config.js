module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'case-sensitive'],
    'type-enum': [2, 'always', ['CHORE', 'FEATURE', 'FIX', 'HOTFIX']],
  },
};
