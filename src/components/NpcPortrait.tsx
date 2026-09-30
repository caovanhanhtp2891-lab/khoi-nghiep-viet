import { getNpc } from '../domain/npcCatalog'
export function NpcPortrait({ npcId }: { npcId: string }) {
 const npc = getNpc(npcId)
 if (!npc) return null
 return <span className="npc-portrait" role="img" aria-label={`${npc.name}, ${npc.age} tuổi, ${npc.job}`} style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/npcs-v2/${npcId}.svg)` }} />
}
