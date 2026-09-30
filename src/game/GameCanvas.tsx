import { useEffect, useRef } from 'react'
import type { Game } from 'phaser'

export function GameCanvas({ inputBlocked = false }: { inputBlocked?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Game | undefined>(undefined)
  const blockedRef = useRef(inputBlocked)

  useEffect(() => {
    blockedRef.current = inputBlocked
    if (gameRef.current) gameRef.current.input.enabled = !inputBlocked
  }, [inputBlocked])

  useEffect(() => {
    let cancelled = false
    let game: Game | undefined

    const bootGame = async () => {
      const [{ default: Phaser }, { MainScene }] = await Promise.all([
        import('phaser'),
        import('./MainScene'),
      ])

      if (cancelled || !containerRef.current) return

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        backgroundColor: '#a9d7a0',
        transparent: false,
        scene: [MainScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        render: {
          antialias: true,
          pixelArt: false,
          roundPixels: true,
        },
        input: {
          activePointers: 3,
        },
      })
      gameRef.current = game
      game.input.enabled = !blockedRef.current
    }

    void bootGame()

    return () => {
      cancelled = true
      game?.destroy(true)
      gameRef.current = undefined
    }
  }, [])

  return <div ref={containerRef} className="game-canvas" aria-label="Khu phố kinh doanh 2D" />
}
