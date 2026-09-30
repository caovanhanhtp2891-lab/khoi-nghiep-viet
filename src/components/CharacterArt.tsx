import type { Gender } from '../domain/types'

export function CharacterArt({ gender, className = '' }: { gender: Gender; className?: string }) {
  return <span role="img" aria-label={gender === 'female' ? 'Nhân vật nữ' : 'Nhân vật nam'} style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/art/characters.webp)` }} className={`character-art ${gender} ${className}`} />
}
