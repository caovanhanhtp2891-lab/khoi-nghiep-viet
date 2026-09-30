import { useEffect, useRef, useState } from 'react'
import { GAME_MINUTES_PER_TICK, REAL_MS_PER_TICK } from '../domain/types'
import { loadGame, saveGame } from '../services/saveDb'
import { snapshotFromStore, useGameStore } from '../store/gameStore'

export type SaveStatus = 'loading' | 'saved' | 'saving' | 'error' | 'blocked'

export function useGameRuntime(): SaveStatus {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('loading')
  const readyRef = useRef(false)
  const savingRef = useRef(false)
  const accumulatorRef = useRef(0)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    readyRef.current = false
    loadGame()
      .then((snapshot) => {
        if (cancelled) return
        if (snapshot) useGameStore.getState().hydrate(snapshot)
        readyRef.current = true
        lastFrameRef.current = performance.now()
        setSaveStatus('saved')
      })
      .catch(() => {
        if (!cancelled) setSaveStatus('blocked')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!readyRef.current) return
      const now = performance.now()
      if (lastFrameRef.current === 0) lastFrameRef.current = now
      const elapsed = Math.min(now - lastFrameRef.current, 1_000)
      lastFrameRef.current = now
      const state = useGameStore.getState()

      if (state.world.paused || !state.onboarded) {
        accumulatorRef.current = 0
        return
      }

      accumulatorRef.current += elapsed * state.world.speed
      let safety = 0
      while (accumulatorRef.current >= REAL_MS_PER_TICK && safety < 8) {
        useGameStore.getState().advanceTick(GAME_MINUTES_PER_TICK)
        accumulatorRef.current -= REAL_MS_PER_TICK
        safety += 1
      }
    }, 100)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const persist = async () => {
      if (!readyRef.current || savingRef.current) return
      savingRef.current = true
      setSaveStatus('saving')
      try {
        await saveGame(snapshotFromStore(useGameStore.getState()))
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      } finally {
        savingRef.current = false
      }
    }

    const timer = window.setInterval(persist, 5_000)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') void persist()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
      void persist()
    }
  }, [])

  return saveStatus
}
