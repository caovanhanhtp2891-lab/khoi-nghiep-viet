import { beforeEach, expect, it } from 'vitest'
import { DIALOGUE_BANK, DIALOGUE_SCENES, chatTheme, dialogueExchange } from './dialogue'
import { chatReply, npcConversation } from './chat'
import { getNpc, NPC_CATALOG } from './npcCatalog'
import { npcSheetSvg } from './npcArt'
import { dailyOrders } from './neighborhood'
import { migrateSnapshot } from './migrateSave'
import { snapshotFromStore, useGameStore } from '../store/gameStore'
const state=()=>useGameStore.getState()
beforeEach(()=>{state().resetGame();state().startJourney('Lan','green','female')})
it('contains 1,000 unique Vietnamese lines in fifty coherent opening/reply scenes',()=>{
 expect(DIALOGUE_SCENES).toHaveLength(50);expect(DIALOGUE_BANK).toHaveLength(1000)
 expect(new Set(DIALOGUE_BANK.map(l=>l.id)).size).toBe(1000)
 expect(new Set(DIALOGUE_BANK.map(l=>l.text)).size).toBe(1000)
 for(const scene of DIALOGUE_SCENES) {
  const lines=DIALOGUE_BANK.filter(l=>l.sceneId===scene.id)
  expect(lines.filter(l=>l.side==='question')).toHaveLength(10)
  expect(lines.filter(l=>l.side==='reply')).toHaveLength(10)
 }
 expect(DIALOGUE_BANK.every(l=>l.text.length>20 && l.text.length<=240)).toBe(true)
})
it('distinguishes buying stock from rain and I-statements from night',()=>{
 expect(chatTheme('Tôi muốn mua hàng cho quầy')).toBe('business')
 expect(chatTheme('Hôm nay trời mưa')).toBe('rain')
 expect(chatTheme('Tôi hỏi về lợi nhuận')).toBe('business')
 expect(chatTheme('Khu phố lên đèn')).toBe('night')
 expect(chatTheme('Trường học có gì mới?')).toBe('school')
})
it('selects contextual conversations reproducibly and varies without consuming economic RNG',()=>{
 const npc=getNpc('npc-101')!,world={...state().world,weather:'rain' as const},seed=world.rngSeed
 const conversations=Array.from({length:50},(_,i)=>dialogueExchange(npc,world,i))
 expect(new Set(conversations.map(c=>c.reply)).size).toBe(50)
 expect(conversations.every(c=>DIALOGUE_SCENES.find(s=>s.id===c.sceneId)?.theme==='rain')).toBe(true)
 expect(conversations[3]).toEqual(dialogueExchange(npc,world,3));expect(world.rngSeed).toBe(seed)
 const reply=chatReply(world,state().business,1,'Giá quầy bao nhiêu?',getNpc('npc-043'))
 expect(reply.text).toContain('22.000đ');expect(reply.npcId).toBe('npc-043')
})
it('ambient NPC exchanges are paired and observation never adds acquaintances or XP',()=>{
 const exchange=npcConversation(state().world,2)
 expect(exchange[0]!.npcId).not.toBe(exchange[1]!.npcId)
 expect(exchange[1]!.text).toContain(getNpc(exchange[0]!.npcId)!.name)
 const xp=state().player.xp,seed=state().world.rngSeed
 for(let i=0;i<6;i++)state().advanceTick(5)
 expect(state().chat.length).toBeGreaterThanOrEqual(2)
 expect(state().neighborhood.relationships).toEqual({});expect(state().player.xp).toBe(xp)
 expect(state().world.rngSeed).not.toBe(seed)
})
it('direct chats and greetings share the same daily bond/XP limit and preserve new IDs on reload',()=>{
 state().sendChat('Chào bạn!','npc-101');state().sendChat('Khu phố có gì mới?','npc-101');state().talkToNpc('npc-101','work')
 expect(state().neighborhood.relationships['npc-101']).toEqual({bond:3,greetedDay:1,meetings:1})
 expect(state().player.xp).toBe(3)
 const saved=migrateSnapshot(JSON.parse(JSON.stringify(snapshotFromStore(state()))))
 state().hydrate(saved);state().sendChat('Chào nhé','npc-101');expect(state().player.xp).toBe(3)
 useGameStore.setState({world:{...state().world,day:2}});state().sendChat('Chào ngày mới','npc-101')
 expect(state().neighborhood.relationships['npc-101']?.bond).toBe(6)
 expect(state().neighborhood.relationships['npc-101']?.meetings).toBe(2)
})
it('rejects unknown recipients, caps text/history and never pays for chat',()=>{
 const money=state().player.money;state().sendChat('hi','npc-missing');expect(state().chat).toEqual([])
 for(let i=0;i<30;i++)state().sendChat('a'.repeat(200),'npc-104')
 expect(state().chat).toHaveLength(40);expect(state().chat.filter(m=>m.fromPlayer).every(m=>m.text.length===160)).toBe(true)
 expect(new Set(state().chat.map(m=>m.id)).size).toBe(40)
 expect(state().player.money).toBe(money);expect(state().player.xp).toBe(3)
})
it('keeps historical order offers stable after appending residents and distinct profession art',()=>{
 const original=NPC_CATALOG.filter(n=>n.variant<100 && n.age>=18 && ['school','office','trade','health','transport','service'].includes(n.group))
 for(const day of [1,9,30,200,501]) expect(dailyOrders(day).map(o=>o.npcId)).toEqual([0,1,2].map(i=>original[(day*3+i)%original.length]!.id))
 useGameStore.setState({world:{...state().world,day:200}});state().buyFirstBooth();state().acceptOrder(dailyOrders(200)[0]!.id)
 const old={...snapshotFromStore(state()),version:5};Reflect.deleteProperty(old,'competition')
 expect(migrateSnapshot(old).neighborhood.activeOrder).toEqual(state().neighborhood.activeOrder)
 expect(getNpc('npc-043')?.accessory).toBe('calculator')
 expect(getNpc('npc-101')?.outfit).toBe('police');expect(getNpc('npc-103')?.outfit).toBe('militia')
 expect(npcSheetSvg(getNpc('npc-101')!)).not.toBe(npcSheetSvg(getNpc('npc-103')!))
})
