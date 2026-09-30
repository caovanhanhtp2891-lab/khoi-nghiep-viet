import { useEffect, useRef } from 'react'
import type { Game } from 'phaser'

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

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
    }

    void bootGame()

    return () => {
      cancelled = true
      game?.destroy(true)
    }
  }, [])

  return <div ref={containerRef} className="game-canvas" aria-label="Khu phố kinh doanh 2D" />
}
