export function setContainsAll<T>(set: Set<T>, items: Iterable<T>) {
  for (const item of items) {
    if (!set.has(item)) {
      return false
    }
  }
  return true
}

export function setDelta<T>(a: Set<T>, b: Set<T>) {
  return {
    added: [...b].filter((x) => !a.has(x)),
    removed: [...a].filter((x) => !b.has(x)),
  }
}
