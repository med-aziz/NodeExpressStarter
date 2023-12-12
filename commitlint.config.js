module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', ['lower-case', 'upper-case']],
    'type-enum': [2, 'always', ['CHORE', 'FEATURE', 'FIX', 'HOTFIX']],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'], // enforce kebab-case for scopes
    'scope-enum': [2, 'always', ['<scope-1>', '<scope-2>', '<scope-3>']], // specify your allowed scopes
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [0],
    'header-max-length': [2, 'always', 100],
    'subject-pattern': [
      2,
      'always',
      /^(<.*?>)?[^()]*(\(.*?\))?: .{1,}$/,
      'subject with optional scope in angle brackets',
    ],
  },
};
