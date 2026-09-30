import type { BusinessState, WorldState } from './types'
import { npcLine, streetNpc } from './npcCatalog'
import { chatTheme, chatSceneIds, dialogueExchange } from './dialogue'
export function npcChatLine(world: WorldState, business: BusinessState, sequence: number): { name: string; text: string; npcId: string } {
 const npc=streetNpc(world,sequence)
 return { name:`${npc.name} · ${npc.job}`,text:npcLine(npc,world,business,'greet',sequence),npcId:npc.id }
}
export function chatReply(world:WorldState,business:BusinessState,sequence:number,input:string,npc=streetNpc(world,sequence)) {
 const theme=chatTheme(input)
 const exchange=dialogueExchange(npc,world,sequence,theme,chatSceneIds(input))
 const text=theme==='business' && /giá|gia/i.test(input) ? `Quầy ${business.name} bán ${business.productName.toLocaleLowerCase('vi')} giá ${business.price.toLocaleString('vi-VN')}đ. ${exchange.reply}` : exchange.reply
 return {name:`${npc.name} · ${npc.job}`,npcId:npc.id,text}
}
/** A paired public exchange never marks either resident as met by the player. */
export function npcConversation(world:WorldState,sequence:number) {
 const first=streetNpc(world,sequence),second=streetNpc(world,sequence+1)
 const exchange=dialogueExchange(first,world,sequence)
 return [
  {npcId:first.id,name:`${first.name} · ${first.job}`,text:exchange.question},
  {npcId:second.id,name:`${second.name} · ${second.job}`,text:`${first.name} ơi, ${exchange.reply}`},
 ]
}
