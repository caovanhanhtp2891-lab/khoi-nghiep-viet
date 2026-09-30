import type { BusinessState, WorldState } from './types'
import { npcLine, streetNpc } from './npcCatalog'
export function npcChatLine(world: WorldState, business: BusinessState, sequence: number): { name: string; text: string; npcId: string } {
 const npc=streetNpc(world,sequence)
 return { name:`${npc.name} · ${npc.job}`,text:npcLine(npc,world,business),npcId:npc.id }
}
