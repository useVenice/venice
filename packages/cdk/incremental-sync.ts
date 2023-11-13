// NEXT: add institution, etc.

export interface VeniceSourceState {
  streams?: string[] | null
}

export function shouldSync(state: VeniceSourceState, stream: string) {
  return !state.streams || state.streams.includes(stream) ? true : undefined
}
