import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { GameNotice } from '../domain/types'
import { useGameStore } from '../store/gameStore'

export function NoticeToast({ notice }: { notice: GameNotice }) {
  const dismiss = useGameStore((state) => state.dismissNotice)
  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(notice.id), 1000)
    return () => window.clearTimeout(timer)
  }, [notice.id, dismiss])
  return <article className={`notice ${notice.tone}`}><span /><p>{notice.message}</p><button onClick={() => dismiss(notice.id)} aria-label="Ẩn thông báo"><X size={13} /></button></article>
}
