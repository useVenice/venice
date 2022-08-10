import {circularDeepEqual, deepMerge} from './object-utils'
import {Rx, rxjs} from './observable-utils'
import {Storage} from './storage'
import {PatchStateAction, Serializable, SetStateAction} from './type-utils'

// MARK: ObservableState

export class ObservableState<
  T extends Serializable,
> extends rxjs.BehaviorSubject<T> {
  set(action: SetStateAction<T>) {
    if (this.closed) {
      return this
    }

    const newValue = typeof action === 'function' ? action(this.value) : action

    // The only optimization state does - compare equality
    if (circularDeepEqual(this.value, newValue)) {
      return this
    }

    this.next(newValue)

    return this
  }

  patch(action: PatchStateAction<T>) {
    return this.set((prevState) => {
      const newStatePartial =
        typeof action === 'function' ? action(prevState) : action

      return typeof prevState === 'object' && prevState
        ? (deepMerge(prevState as object, newStatePartial as object) as T)
        : (newStatePartial as T)
    })
  }
}

// MARK: PersistedObservableState

export class PersistedObservableState<
  T extends Serializable,
> extends ObservableState<T> {
  constructor(
    private readonly storage: Storage,
    private readonly key: string,
    private readonly defaultValue: T,
  ) {
    super(defaultValue)
  }

  async init() {
    let initialValue = this.defaultValue
    try {
      const resP = this.storage.getItem(this.key)
      const res = resP instanceof Promise ? await resP : resP
      if (res) {
        initialValue = JSON.parse(res)
      }
    } catch (err) {
      console.warn('Unable to load cache', err)
    }

    this.next(initialValue)
    this.pipe(Rx.skip(1)).subscribe((newValue) =>
      this.storage.setItem(this.key, JSON.stringify(newValue)),
    )

    return this
  }

  destroy() {
    this.complete()
  }
}
