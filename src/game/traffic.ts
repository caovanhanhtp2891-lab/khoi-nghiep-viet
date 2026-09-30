import type Phaser from 'phaser'

export const VEHICLE_KINDS = ['motorbike','bicycle','taxi','bus','delivery','cargo'] as const
export type VehicleKind = typeof VEHICLE_KINDS[number]
/** Decorative street traffic; never changes demand, money or economic RNG. */
export function drawVehicle(g:Phaser.GameObjects.Graphics,kind:VehicleKind) {
 const wide=kind==='bus'?330:kind==='delivery'?230:kind==='taxi'?210:145
 const wheels=kind==='bus'?112:kind==='delivery'?80:kind==='taxi'?72:52
 g.fillStyle(0x353a3b).fillCircle(-wheels,22,22).fillCircle(wheels,22,22)
 g.fillStyle(0xb7c0b7).fillCircle(-wheels,22,11).fillCircle(wheels,22,11)
 if(kind==='bicycle') {
  g.lineStyle(5,0x4f846a).strokeTriangle(-52,20,-16,-25,15,20).strokeTriangle(-16,-25,15,20,49,-20)
  g.lineBetween(49,-20,52,20).lineBetween(-16,-25,-20,-44).lineBetween(49,-20,45,-49).lineBetween(45,-49,30,-49)
 } else if(kind==='motorbike' || kind==='cargo') {
  g.fillStyle(kind==='cargo'?0x609278:0xb7503d).fillRoundedRect(-67,-22,140,25,10)
  g.lineStyle(7,0x51443b).lineBetween(55,10,35,-62).lineBetween(35,-62,13,-62)
  if(kind==='cargo') {
   g.fillStyle(0xa77842).fillRect(-104,-58,65,52)
   g.lineStyle(3,0xecd19a).strokeRect(-100,-54,57,44).lineBetween(-71,-54,-71,-10)
   g.fillStyle(0x679051).fillEllipse(-80,-66,27,20).fillEllipse(-56,-62,29,24)
  }
 } else {
  const color=kind==='bus'?0xbf5541:kind==='taxi'?0x518b68:0xcdab6c
  g.fillStyle(color).fillRoundedRect(-wide/2,-76,wide,95,14)
  g.fillStyle(0xb7d5d2)
  if(kind==='bus') for(let x=-140;x<145;x+=53) g.fillRoundedRect(x,-64,43,36,4)
  else {g.fillRoundedRect(-wide/2+13,-62,68,32,6);g.fillRoundedRect(-wide/2+91,-62,55,32,4)}
  g.fillStyle(0xffedb4).fillRect(-wide/2+10,-19,wide-20,6)
  g.fillStyle(0xeee1bf).fillRect(wide/2-12,-9,10,15)
  if(kind==='taxi') g.fillStyle(0xffe5a5).fillRoundedRect(-20,-89,43,14,4)
  if(kind==='delivery') {g.fillStyle(0xf7edcc).fillRect(20,-56,66,38);g.fillStyle(0xab7644).fillRect(33,-49,39,24);g.lineStyle(3,0xefdbad).lineBetween(52,-49,52,-25)}
  if(kind==='bus') for(const x of [-66,-12,42,96]) {g.fillStyle(0xe7bc95).fillCircle(x,-44,6);g.fillStyle(0x637b66).fillRoundedRect(x-7,-39,14,9,3)}
 }
 return {wide,rider:kind==='motorbike'||kind==='bicycle'||kind==='cargo',duration:kind==='bicycle'?14000:kind==='bus'?12000:9000}
}
