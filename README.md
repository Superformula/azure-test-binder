# Azure Test Binder

An Azure Devops pipeline task to associate test method names to work items.

![Build Status](https://github.com/jamesdunnam-sf/azure-test-binder/workflows/build/badge.svg?branch=master)

---

Contents:

- [TypeScript][typescript] [4.0][typescript-4-0]
- [ESLint][eslint]
- [Jest][jest]
- [Prettier][prettier]
- Reproducible environments with [Volta][volta]
  - [install][volta-getting-started] Volta
- .editorconfig for consistent file format
- [Dependabot] updates
- [KodiakHQ] automerges

## Available Scripts

- `build` - compile TS
- `build:watch` - interactive watch mode to automatically transpile source files
- `checkcommit` - validate commit message
- `clean` - remove coverage data, Jest cache and transpiled files,
- `clean-deps` - remove `node_modules`
- `clean-generated` - remove coverage and build directories and files
- `clean-logs` - remove log files
- `commit` - start commit
- `format` - format files
- `lint` - lint source files and tests,
- `nuke` - clean everything
- `sort-pj` - sort `package.json`
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests
- `manual-run` - invoke the work item association api locally

## Building

To build the project with yarn:

```bash
yarn install
yarn build
```

### Building the Azure Devops Task

To build the Azure Devops task with yarn:

```bash
yarn build:ci
yarn build-az-task
```

The Task build will output a `.vsix` file that can be uploaded to Azure Devops

## Running

### Manual run

To invoke the task locally, you will need to:

1. Copy the [sample.env](sample.env) and rename it `.env`
2. Populate the values _blank_ values in your new `.env` file.
   - `AZURE_PERSONAL_ACCESS_TOKEN` is a valid Personal Access Token ([PAT]).
   - `ORG_URL` is the URL for your organization: e.g. `https://dev.azure.com/cool-co`
   - `PROJECT` is your project name. e.g. `cool-code` from the URL `https://dev.azure.com/cool-co/cool-code` (_not_ the full URL)
   - `FAIL_ON_STDERR` means any `console.warn`/`console.error` will cause the task to fail. True by default.
3. Lastly, you need a valid build id to execute against. The build id is an integer value that
   can be found with the [predefined variable] `$(Build.BuildId)`.
4. Run `yarn build:ci`
5. Execute the task: `yarn manual-run SOME_BUILD_ID`

## Testing

To run tests with yarn:

```bash
yarn test
```

[typescript]: https://www.typescriptlang.org/
[typescript-4-0]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[dependabot]: https://dependabot.com/
[kodiakhq]: https://kodiakhq.com/
[pat]: https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat
[predefined variable]: https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml
