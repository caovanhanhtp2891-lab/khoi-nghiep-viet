import type { NpcProfile } from './npcCatalog'

// Repository-native SVG illustration; no external fonts or reused player art.
const edge = '#554437'
function accessory(n: NpcProfile): string {
 const x = n.gender === 'female' ? 85 : 87
 const base = `stroke="${edge}" stroke-width="1.8" stroke-linejoin="round"`
 switch(n.accessory) {
 case 'calculator': return `<g ${base}><rect x="${x-14}" y="111" width="27" height="36" rx="4" fill="#455769"/><rect x="${x-10}" y="115" width="19" height="8" fill="#c5dbc0"/><path d="M${x-8} 129h3m4 0h3m-10 6h3m4 0h3m-10 6h3m4 0h3" stroke="#f8e9bd" stroke-width="3"/></g>`
 case 'radio': return `<g ${base}><rect x="${x-9}" y="111" width="20" height="30" rx="4" fill="#384842"/><path d="M${x-5} 112v-15m1 25h11m-11 5h11" stroke="#becab5" stroke-width="2"/><circle cx="${x+4}" cy="135" r="2" fill="#d8b454"/></g>`
 case 'book': return `<g ${base}><rect x="${x-8}" y="111" width="22" height="30" rx="2" fill="${n.accent}"/><path d="M${x-3} 117h12m-12 6h12" stroke="#fff1d8"/></g>`
 case 'bag': return `<g ${base}><path d="M${x-9} 115v-10q11-15 21 0v10" fill="none"/><rect x="${x-13}" y="115" width="29" height="29" rx="6" fill="${n.accent}"/><path d="M${x-8} 124h19" stroke="#e7cf99"/></g>`
 case 'basket': return `<g ${base}><path d="M${x-13} 119q13-31 26 0" fill="none"/><path d="M${x-17} 119h34l-5 24h-24z" fill="#c08d4d"/><path d="M${x-14} 128h28m-25 7h23" stroke="#f0c887"/></g>`
 case 'tools': return `<g ${base}><rect x="${x-15}" y="122" width="32" height="23" rx="3" fill="${n.accent}"/><path d="M${x-5} 122v-6h12v6" fill="none"/><path d="M${x+4} 107l-6 22" stroke="#ccd3cd" stroke-width="5"/><path d="M${x-1} 103l11 3" stroke="#ccd3cd" stroke-width="7"/></g>`
 case 'medical': return `<g ${base}><rect x="${x-14}" y="118" width="30" height="26" rx="4" fill="#f4f1e4"/><path d="M${x-4} 118v-5h10v5" fill="none"/><path d="M${x+1} 124v15m-7-7h14" stroke="#b85442" stroke-width="4"/></g>`
 case 'laptop': return `<g ${base}><rect x="${x-15}" y="117" width="31" height="25" rx="3" fill="#657079"/><rect x="${x-11}" y="121" width="23" height="14" rx="1" fill="#adc8c2"/><path d="M${x-11} 138h23" stroke="#d8ddd5"/></g>`
 case 'parcel': return `<g ${base}><path d="M${x-16} 116h34v27h-34z" fill="#c39257"/><path d="M${x+1} 116v27" stroke="#ecd49a" stroke-width="7"/><rect x="${x-11}" y="125" width="8" height="7" fill="#f6e9cd" stroke="none"/></g>`
 case 'produce': return `<g ${base}><path d="M${x-17} 126h34l-4 20h-26z" fill="#b78950"/><circle cx="${x-8}" cy="123" r="7" fill="#bc573b"/><circle cx="${x+7}" cy="122" r="8" fill="#e9b54d"/><path d="M${x-3} 126l-4-18m5 18l10-19" stroke="#68874c" stroke-width="7"/></g>`
 case 'flowers': return `<g ${base}><path d="M${x-8} 139l3-29m8 29l-5-34" stroke="#62814d" stroke-width="3"/><path d="M${x-16} 122l15 27 15-27z" fill="#d4c191"/><circle cx="${x-6}" cy="109" r="9" fill="#d28087"/><circle cx="${x+6}" cy="105" r="9" fill="#e5b74f"/><circle cx="${x-6}" cy="109" r="3" fill="#f3d891"/></g>`
 case 'camera': return `<g ${base}><path d="M${x-7} 118l-3-27" fill="none"/><rect x="${x-16}" y="118" width="32" height="22" rx="4" fill="#45494c"/><circle cx="${x}" cy="129" r="7" fill="#9fc0c1"/><rect x="${x-9}" y="113" width="12" height="6" fill="#45494c"/></g>`
 }
}
function hat(n: NpcProfile): string {
 switch(n.hat) {
 case 'peaked': return `<path d="M31 37l5-20h48l5 20z" fill="${n.color}" stroke="${edge}" stroke-width="2"/><path d="M28 37h64l-9 8H38z" fill="#34453d"/><path d="M34 33h51" stroke="#d9bb66" stroke-width="4"/><circle cx="60" cy="26" r="5" fill="#be533b"/><path d="M60 22l1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3z" fill="#f4d580"/>`
 case 'conical': return `<path d="M22 54L60 15l38 39q-38 14-76 0z" fill="#e4c885" stroke="${edge}" stroke-width="2"/><path d="M32 52l28-30 28 30m-53 4h50" fill="none" stroke="#ba9a60" stroke-width="1.5"/>`
 case 'helmet': return `<path d="M32 47q-1-34 28-34t28 34z" fill="${n.color}" stroke="${edge}" stroke-width="2"/><path d="M38 43h46" stroke="#f4d78c" stroke-width="5"/><path d="M85 50l-5 20" stroke="${edge}" stroke-width="3"/>`
 case 'hardhat': return `<path d="M31 45q0-31 29-31t29 31z" fill="#e8b643" stroke="${edge}" stroke-width="2"/><path d="M26 45h68M59 15v28" stroke="#c48f25" stroke-width="6"/>`
 case 'chef': return `<path d="M37 37v-12q-15-16 0-23 13-7 23 3 12-11 23-3 15 7 0 23v12z" fill="#fff6e8" stroke="${edge}" stroke-width="2"/><path d="M37 32h46" stroke="#c5baaa" stroke-width="2"/>`
 case 'cap': return `<path d="M32 40q1-26 27-26t29 26z" fill="${n.accent}" stroke="${edge}" stroke-width="2"/><path d="M58 39h36q5 9-31 5" fill="${n.color}" stroke="${edge}" stroke-width="2"/>`
 default: return ''
 }
}
function frame(n: NpcProfile, step: number): string {
 const child = n.age < 13
 const headY = child ? 52 : 48
 const body = n.outfit === 'coat' || n.outfit === 'uniform' ? '#f5f0dc' : n.color
 const trouser = n.outfit === 'suit' ? '#3c4650' : n.accent
 const skirt = n.gender === 'female' && ['aodai','baba','uniform'].includes(n.outfit)
 const stride = [0, 7, 0, -7][step]!
 const lift = step % 2 ? -2 : 0
 const faceWidth = 26 + (n.variant % 3) * 2
 const hair = n.gender === 'female'
  ? n.hairStyle === 0 ? `<path d="M31 37q-7 24 0 56l13-4V40zM76 40v49l13 4q7-41-2-56z" fill="${n.hair}"/>`
    : n.hairStyle === 1 ? `<ellipse cx="88" cy="32" rx="11" ry="13" fill="${n.hair}"/>`
    : n.hairStyle === 2 ? `<path d="M83 46q30 6 10 40l-8-6 2-13-12-6z" fill="${n.hair}"/>`
    : n.hairStyle === 3 ? `<path d="M32 33q-20 25 4 49l8-7V38zM78 38v38l9 6q20-33-6-49z" fill="${n.hair}"/>`
    : `<ellipse cx="60" cy="30" rx="27" ry="21" fill="${n.hair}"/>`
  : n.hairStyle === 1 ? `<path d="M33 33l12-21 13 9 10-10 19 23z" fill="${n.hair}"/>` : ''
 const glasses = n.glasses ? `<g fill="none" stroke="${edge}" stroke-width="1.8"><rect x="39" y="45" width="16" height="12" rx="4"/><rect x="65" y="45" width="16" height="12" rx="4"/><path d="M55 48h10m-30 0h4m42 0h4"/></g>` : ''
 const wrinkles = n.age >= 60 ? `<path d="M37 56l-3 3m49-3l3 3m-47 4l2 3m40-3l-2 3" fill="none" stroke="#b18261" stroke-width="1.2"/>` : ''
 const moustache = n.gender === 'male' && n.age >= 40 && n.variant % 3 === 0 ? `<path d="M48 65q6-9 12-2 6-7 12 2-10 7-12 1-4 5-12-1" fill="${n.hair}"/>` : ''
 const clothes = ['police','militia','firefighter'].includes(n.outfit) ? `<path d="M45 81l15 9 15-9M60 90v44" fill="none" stroke="#e0ce8e" stroke-width="2"/><path d="M39 85h13m17 0h13" stroke="#bd4c38" stroke-width="5"/><rect x="42" y="98" width="12" height="10" rx="1" fill="#d3bd75"/><path d="M39 129h41" stroke="#34433b" stroke-width="6"/>${n.outfit==='firefighter'?'<path d="M37 114h46" stroke="#efdc79" stroke-width="6"/>':''}`
 : n.outfit === 'apron' ? `<path d="M46 84h28l8 52H38z" fill="${n.accent}" stroke="${edge}" stroke-width="1.5"/><path d="M48 111h24v17H48z" fill="#e2cbb0"/>`
 : n.outfit === 'suit' ? `<path d="M47 81l13 20 13-20M59 93l-5 25 6 8 6-8-5-25" fill="${n.accent}" stroke="${edge}" stroke-width="1.5"/>`
 : n.outfit === 'uniform' ? `<path d="M50 81l10 9 10-9" fill="none" stroke="${n.accent}" stroke-width="3"/>${child || n.age < 18 ? '<path d="M48 83l12 13 12-13-8 16 5 9-9-6-9 6 5-10z" fill="#b9503b"/>' : '<rect x="42" y="99" width="12" height="9" rx="1" fill="#c3d1c8"/>'}`
 : n.outfit === 'coat' ? `<path d="M49 79l-6 18 17-7 17 7-6-18M60 91v40" fill="none" stroke="#a99f8e" stroke-width="2"/><path d="M41 108h12v17H41z" fill="${n.accent}"/>`
 : n.outfit === 'aodai' ? `<path d="M51 79l10 8 11-8M64 86v45" fill="none" stroke="#e8c998" stroke-width="2"/><path d="M39 131l-5 33 20-7 6-26 5 26 21 7-6-33z" fill="${body}" stroke="${edge}" stroke-width="1.5"/>`
 : `<path d="M60 82v49" stroke="#e3cdb0" stroke-width="1.5"/><circle cx="63" cy="98" r="1.7" fill="${edge}"/><circle cx="63" cy="109" r="1.7" fill="${edge}"/>`
 return `<g transform="translate(0 ${lift})" stroke-linejoin="round" stroke-linecap="round">
 ${hair}
 <path d="M49 131L${43-stride} 173M71 131L${78+stride} 173" fill="none" stroke="${trouser}" stroke-width="13"/>
 <ellipse cx="${43-stride}" cy="178" rx="13" ry="5" fill="#4a4038"/><ellipse cx="${78+stride}" cy="178" rx="13" ry="5" fill="#4a4038"/>
 ${skirt ? `<path d="M39 122h42l8 32H31z" fill="${trouser}" stroke="${edge}" stroke-width="2"/>` : ''}
 <path d="M40 84q-12 12-13 ${36+stride}l10 1 7-25m33-12q12 12 14 ${36-stride}l-10 1-6-25" fill="${body}" stroke="${edge}" stroke-width="2"/>
 <ellipse cx="30" cy="${125+stride}" rx="6" ry="8" fill="${n.skin}"/><ellipse cx="88" cy="${125-stride}" rx="6" ry="8" fill="${n.skin}"/>
 <path d="M44 78q16-10 32 0l8 57H36z" fill="${body}" stroke="${edge}" stroke-width="2"/>
 ${clothes}
 <path d="M52 68v14q8 7 16 0V68" fill="${n.skin}" stroke="${edge}" stroke-width="1.5"/>
 <ellipse cx="34" cy="${headY+4}" rx="5" ry="7" fill="${n.skin}"/><ellipse cx="86" cy="${headY+4}" rx="5" ry="7" fill="${n.skin}"/>
 <ellipse cx="60" cy="${headY}" rx="${faceWidth}" ry="29" fill="${n.skin}" stroke="${edge}" stroke-width="1.8"/>
 <path d="M33 41q-5-29 27-29t27 29q-15-2-23-13-9 14-31 13z" fill="${n.hair}"/>
 <path d="M43 42l10-1m14 0l10 1" stroke="${edge}" stroke-width="1.8"/>
 <ellipse cx="48" cy="51" rx="2.5" ry="3.5" fill="#322c26"/><ellipse cx="72" cy="51" rx="2.5" ry="3.5" fill="#322c26"/>
 <circle cx="47" cy="50" r="0.8" fill="white"/><circle cx="71" cy="50" r="0.8" fill="white"/>
 <ellipse cx="40" cy="61" rx="5" ry="2.6" fill="#d18a73" opacity=".4"/><ellipse cx="80" cy="61" rx="5" ry="2.6" fill="#d18a73" opacity=".4"/>
 <path d="M60 53l-2 7h4M53 67q7 6 14 0" fill="none" stroke="#96674e" stroke-width="1.6"/>
 ${wrinkles}${moustache}${glasses}${hat(n)}${accessory(n)}
 </g>`
}
export function npcSheetSvg(npc: NpcProfile): string {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" viewBox="0 0 480 200"><title>${npc.name} · ${npc.age} tuổi · ${npc.job}</title>${[0,1,2,3].map((step) => `<g transform="translate(${step*120} 8)">${frame(npc,step)}</g>`).join('')}</svg>`
}
