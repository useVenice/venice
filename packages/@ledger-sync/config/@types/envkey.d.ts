declare module 'envkey/loader' {
  export interface EnvkeyOptions {
    /** where to find the dotEnv file that contains your ENVKEY */
    dotEnvFile?: string
    /** whitelist of permitted vars (useful for client-side config) - defaults to permitting all if omitted */
    permitted?: string[]
  }

  export function load(options: EnvkeyOptions): void
  export function fetch(options?: EnvkeyOptions): Record<string, string>
}
