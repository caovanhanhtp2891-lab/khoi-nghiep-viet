import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { NPC_CATALOG } from '../src/domain/npcCatalog.ts'
import { npcSheetSvg } from '../src/domain/npcArt.ts'
const root = new URL('../public/assets/npcs-v2/', import.meta.url)
await mkdir(root, { recursive: true })
for (const npc of NPC_CATALOG) {
 const path=new URL(`${npc.id}.svg`, root)
 const content=npcSheetSvg(npc)
 if (process.argv.includes('--check')) {
  if (await readFile(path,'utf8') !== content) throw new Error(`Outdated NPC asset: ${npc.id}. Run pnpm assets:npcs.`)
 } else await writeFile(path,content,'utf8')
}
console.log(`${process.argv.includes('--check') ? 'Validated' : 'Generated'} ${NPC_CATALOG.length} NPC sprite sheets (4 frames each).`)
