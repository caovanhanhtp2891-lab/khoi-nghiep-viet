import type { GameSnapshot } from '../domain/types'

export interface SaleVisualEvent {
  count: number
  revenue: number
}

type GameEventMap = {
  'simulation:update': GameSnapshot
  'business:selected': undefined
  'player:focus': undefined
  sale: SaleVisualEvent
  reset: undefined
}

type EventName = keyof GameEventMap
type Handler<T> = (detail: T) => void

class TypedGameEvents {
  private target = new EventTarget()

  emit<K extends EventName>(name: K, detail: GameEventMap[K]): void {
    this.target.dispatchEvent(new CustomEvent(name, { detail }))
  }

  on<K extends EventName>(name: K, handler: Handler<GameEventMap[K]>): () => void {
    const listener = (event: Event) => handler((event as CustomEvent<GameEventMap[K]>).detail)
    this.target.addEventListener(name, listener)
    return () => this.target.removeEventListener(name, listener)
  }
}

export const gameEvents = new TypedGameEvents()
