module.exports = {
  types: [
    { value: 'feat', name: 'feat:  A new feature' },
    { value: 'fix', name: 'fix:    A bug fix' },
    { value: 'docs', name: 'docs:  Documentation only changes' },
    {
      value: 'cleanup',
      name: 'cleanup:   A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'chore',
      name: "chore:   Other changes that don't modify src or test files",
    },
  ],
  scopes: [
    { name: 'docs', description: 'anything related to docs' },
    { name: 'api', description: 'anything related to api' },
    { name: 'code', description: 'anything related to code' },
    { name: 'linter', description: 'anything Linter specific' },
    {
      name: 'testing',
      description: 'anything testing specific (e.g., jest or cypress)',
    },
    {
      name: 'repo',
      description: 'anything related to managing the repo itself',
    },
    { name: 'misc', description: 'misc stuff' },
  ],
  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE (lowercase) description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #12345, #54321:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['ticketNumber'],
  subjectLimit: 100,
}
