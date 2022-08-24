export declare type ESLintConfig =
  import('@typescript-eslint/experimental-utils/dist/index').TSESLint.Linter.Config & {
    extends?: string | string[]
    plugins?: string[]
    overrides?: Array<{files?: string | string[]} & ESLintConfig>
  }
