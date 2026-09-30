import Phaser from 'phaser'
import type { GameSnapshot, Gender } from '../domain/types'
import { formatMoney } from '../domain/format'
import { NPC_CATALOG, streetNpc, npcLine, type NpcProfile } from '../domain/npcCatalog'
import { snapshotFromStore, useGameStore } from '../store/gameStore'
import { gameEvents } from './events'

const W = 1024
const H = 1536
const FONT = 'Arial, "Segoe UI", sans-serif'
type Actor = { root: Phaser.GameObjects.Container; sprite: Phaser.GameObjects.Sprite; gender: Gender; name: string; npcId?: string }

export class MainScene extends Phaser.Scene {
  private player?: Actor
  private booth?: Phaser.GameObjects.Container
  private boothText?: Phaser.GameObjects.Text
  private lighting?: Phaser.GameObjects.Rectangle
  private rain?: Phaser.GameObjects.Container
  private snapshot = snapshotFromStore(useGameStore.getState())
  private unsubscribe: Array<() => void> = []
  private people: Actor[] = []
  private bubbles: Phaser.GameObjects.Container[] = []
  private moveTween?: Phaser.Tweens.Tween
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private keyboardMoving = false
  private count = 0

  constructor() { super('main-scene') }
  preload(): void {
    const base = import.meta.env.BASE_URL
    this.load.image('street', `${base}assets/art/vietnam-street.webp`)
    this.load.image('characters', `${base}assets/art/characters.webp`)
    for (const npc of NPC_CATALOG) this.load.svg(npc.id, `${base}assets/npcs-v2/${npc.id}.svg`, { width: 480, height: 200 })
  }
  create(): void {
    this.snapshot = snapshotFromStore(useGameStore.getState())
    if (!this.textures.exists('characters') || !this.textures.exists('street')) {
      this.add.text(20, 60, 'Không tải được hình ảnh.\nHãy tải lại trang khi có mạng.', { fontFamily: FONT, fontSize: '18px', color: '#563f32' })
      return
    }
    const texture = this.textures.get('characters')
    const source = texture.getSourceImage() as HTMLImageElement
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const x = Math.round(col * source.width / 4)
        texture.add(`${row}-${col}`, 0, x, row * source.height / 2, Math.round((col + 1) * source.width / 4) - x, source.height / 2)
      }
      const key = row === 0 ? 'male-walk' : 'female-walk'
      if (!this.anims.exists(key)) this.anims.create({ key, frames: [0, 1, 2, 3].map((col) => ({ key: 'characters', frame: `${row}-${col}` })), frameRate: 7, repeat: -1 })
    }
    for (const npc of NPC_CATALOG) {
      if (!this.textures.exists(npc.id)) continue
      for (let col = 0; col < 4; col++) this.textures.get(npc.id).add(String(col), 0, col * 120, 0, 120, 200)
      const key = `${npc.id}-walk`
      if (!this.anims.exists(key)) this.anims.create({ key, frames: [0,1,2,3].map(col => ({ key: npc.id, frame: String(col) })), frameRate: 6, repeat: -1 })
    }
    this.add.image(W / 2, H / 2, 'street').setDisplaySize(W, H)
    this.sign(190, 555, 'TẠP HÓA CÔ LAN', '#fff4cf')
    this.sign(560, 575, 'BẾP NHÀ · ĂN SÁNG', '#6f4132')
    this.sign(880, 555, 'CÀ PHÊ ĐẦU NGÕ', '#5b3b27')
    this.createBooth()
    this.player = this.actor(this.snapshot.player.gender, this.snapshot.player.name, this.snapshot.player.position.x * W, this.snapshot.player.position.y * H)
    const name = this.add.text(0, -230, 'BẠN', { fontFamily: FONT, fontSize: '21px', fontStyle: 'bold', color: '#fff9e9', backgroundColor: '#366956', padding: { x: 13, y: 6 } }).setOrigin(0.5)
    this.player.root.add(name)
    this.player.sprite.setInteractive({ useHandCursor: true }).on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => { event.stopPropagation(); this.speak(this.player!, 'Một ngày mới, cố gắng lên nào!') })
    this.lighting = this.add.rectangle(W / 2, H / 2, W, H, 0x142339, 0).setDepth(80)
    this.rain = this.add.container(0, 0).setDepth(81)
    for (let i = 0; i < 45; i++) {
      const drop = this.add.rectangle(Math.random() * W, Math.random() * H, 3, 27, 0xd9edff, 0.65).setRotation(-0.2)
      this.rain.add(drop)
      this.tweens.add({ targets: drop, y: H + 40, x: '-=120', duration: 1500 + Math.random() * 1000, repeat: -1, onRepeat: () => { drop.y = -40; drop.x = Math.random() * W } })
    }
    this.time.addEvent({ delay: 2600, loop: true, callback: () => this.spawnPerson() })
    this.time.addEvent({ delay: 7500, loop: true, callback: () => this.motorbike() })
    for (let i = 0; i < 5; i++) this.spawnPerson(true)
    this.motorbike()
    this.input.on('pointerdown', this.walkHere, this)
    this.cursors = this.input.keyboard?.createCursorKeys()
    this.unsubscribe.push(
      gameEvents.on('simulation:update', (snapshot) => this.applySnapshot(snapshot)),
      gameEvents.on('sale', ({ count, revenue }) => this.sale(count, revenue)),
      gameEvents.on('player:focus', () => { if (this.player) this.speak(this.player, 'Mình ở đây! Chạm vỉa hè để đi nhé.') }),
      gameEvents.on('reset', () => { this.moveTween?.stop(); this.applySnapshot(snapshotFromStore(useGameStore.getState())); this.player?.root.setPosition(this.snapshot.player.position.x * W, this.snapshot.player.position.y * H) }),
    )
    this.scale.on('resize', this.fit, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { this.unsubscribe.forEach((fn) => fn()); this.scale.off('resize', this.fit, this); this.input.off('pointerdown', this.walkHere, this) })
    this.fit()
    this.applySnapshot(this.snapshot)
  }
  private fit(): void {
    const zoom = Math.max(this.scale.width / W, this.scale.height / H)
    this.cameras.main.setZoom(zoom).centerOn(W / 2, H / 2)
  }
  private sign(x: number, y: number, text: string, color: string): void {
    this.add.text(x, y, text, { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color, align: 'center', stroke: '#fff2d6', strokeThickness: color === '#fff4cf' ? 0 : 1 }).setOrigin(0.5)
  }
  private actor(gender: Gender, name: string, x: number, y: number): Actor {
    const root = this.add.container(x, y).setDepth(10 + y / H)
    const shadow = this.add.ellipse(0, 0, 66, 16, 0x53412c, 0.16)
    const sprite = this.add.sprite(0, 0, 'characters', gender === 'female' ? '1-0' : '0-0').setOrigin(0.5, 0.94).setDisplaySize(110, 220)
    root.add([shadow, sprite])
    return { root, sprite, gender, name }
  }
  private createBooth(): void {
    const root = this.add.container(350, 1030).setDepth(12)
    const g = this.add.graphics()
    g.fillStyle(0x594537).fillRoundedRect(-112, -80, 224, 112, 10)
    g.fillStyle(0xfff4d5).fillRoundedRect(-106, -76, 212, 95, 6)
    g.lineStyle(4, 0x78523b).strokeRoundedRect(-106, -76, 212, 95, 6)
    g.fillStyle(0xb8533b).fillRoundedRect(-108, -57, 216, 34, 3)
    g.fillStyle(0xf5c76b).fillRect(-121, -108, 242, 30)
    for (let i = 0; i < 6; i++) { g.fillStyle(i % 2 ? 0xb8533b : 0xffedbb).fillRect(-121 + i * 40, -112, 40, 29) }
    g.fillStyle(0x3c3935).fillCircle(-82, 37, 17).fillCircle(82, 37, 17)
    g.fillStyle(0x8a9e55).fillEllipse(-52, -4, 50, 17).fillEllipse(52, -4, 50, 17)
    g.fillStyle(0xf5dc9f).fillEllipse(-52, -10, 38, 16).fillEllipse(52, -10, 38, 16)
    const title = this.add.text(0, -52, 'XÔI SÁNG 18', { fontFamily: FONT, fontSize: '25px', fontStyle: 'bold', color: '#fff6de' }).setOrigin(0.5, 0)
    this.boothText = this.add.text(0, 6, 'MỞ QUẦY · 480K', { fontFamily: FONT, fontSize: '19px', fontStyle: 'bold', color: '#754935' }).setOrigin(0.5)
    root.add([g, title, this.boothText]).setSize(260, 180).setInteractive({ useHandCursor: true })
    root.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => { event.stopPropagation(); gameEvents.emit('business:selected', undefined) })
    this.booth = root
  }
  private walkHere(pointer: Phaser.Input.Pointer): void {
    if (!this.player || !this.snapshot.onboarded || pointer.worldY < H * 0.60 || pointer.worldY > H * 0.82) return
    this.movePlayer(pointer.worldX, pointer.worldY)
  }
  private movePlayer(x: number, y: number): void {
    if (!this.player) return
    const player = this.player
    x = Phaser.Math.Clamp(x, W * 0.08, W * 0.92)
    y = Phaser.Math.Clamp(y, H * 0.64, H * 0.79)
    // Cart is a small obstacle; take an unobstructed route behind it.
    if (Math.abs(x - 350) < 135 && Math.abs(y - 1030) < 60) y = 1140
    this.moveTween?.stop()
    player.sprite.setFlipX(x < player.root.x).play(`${player.gender}-walk`, true)
    const crossesCart = Math.min(player.root.x, x) < 480 && Math.max(player.root.x, x) > 215 && Math.min(player.root.y, y) < 1090 && Math.max(player.root.y, y) > 970
    const points = crossesCart ? [{ x: player.root.x, y: 1140 }, { x, y: 1140 }, { x, y }] : [{ x, y }]
    const step = () => {
      const point = points.shift()
      if (!point) { player.sprite.stop().setFrame(player.gender === 'female' ? '1-0' : '0-0'); useGameStore.getState().movePlayer(x / W, y / H); return }
      this.moveTween = this.tweens.add({ targets: player.root, x: point.x, y: point.y, duration: Math.max(100, Phaser.Math.Distance.Between(player.root.x, player.root.y, point.x, point.y) * 5), onUpdate: () => player.root.setDepth(13 + player.root.y / H), onComplete: step })
    }
    step()
  }
  update(_time: number, delta: number): void {
    if (!this.player || !this.cursors || !this.snapshot.onboarded) return
    if (document.activeElement instanceof HTMLInputElement || document.querySelector('.panel-backdrop')) return
    const { left, right, up, down } = this.cursors
    const dx = Number(right.isDown) - Number(left.isDown)
    const dy = Number(down.isDown) - Number(up.isDown)
    if (dx || dy) {
      this.moveTween?.stop()
      this.player.sprite.play(`${this.player.gender}-walk`, true).setFlipX(dx < 0)
      const x = Phaser.Math.Clamp(this.player.root.x + dx * Math.min(delta, 40) * 0.2, W * 0.08, W * 0.92)
      const y = Phaser.Math.Clamp(this.player.root.y + dy * Math.min(delta, 40) * 0.2, H * 0.64, H * 0.79)
      this.player.root.setPosition(x, y)
      this.keyboardMoving = true
    } else if (this.keyboardMoving) {
      this.keyboardMoving = false
      this.player.sprite.stop().setFrame(this.player.gender === 'female' ? '1-0' : '0-0')
      useGameStore.getState().movePlayer(this.player.root.x / W, this.player.root.y / H)
    }
  }
  private npcActor(npc: NpcProfile, x: number, y: number): Actor {
    const root = this.add.container(x, y).setDepth(13 + y / H)
    const shadow = this.add.ellipse(0, 0, 66, 16, 0x53412c, 0.16)
    const sprite = this.add.sprite(0, 0, npc.id, '0').setOrigin(0.5, 0.94).setDisplaySize(130, 217)
    root.add([shadow, sprite])
    if (npc.age < 13) root.setScale(0.68)
    else if (npc.age < 18) root.setScale(0.82)
    else root.setScale(0.86 + (npc.variant % 3) * 0.04)
    return { root, sprite, gender: npc.gender, name: npc.name, npcId: npc.id }
  }
  private spawnPerson(initial = false): void {
    if (this.people.length >= 10) return
    const id = ++this.count
    let npc = streetNpc(this.snapshot.world, id)
    for (let offset = 1; this.people.some(p => p.npcId === npc.id) && offset < 100; offset++) npc = streetNpc(this.snapshot.world, id + offset)
    if (!this.textures.exists(npc.id)) return
    const line = npcLine(npc, this.snapshot.world, this.snapshot.business)
    const fromLeft = id % 2 === 0
    const y = H * (0.665 + (id % 5) * 0.025)
    const person = this.npcActor(npc, initial ? 120 + (id % 5) * 170 : fromLeft ? -80 : W + 80, y)
    person.sprite.setFlipX(!fromLeft).play(`${npc.id}-walk`)
    this.people.push(person)
    person.sprite.setInteractive({ useHandCursor: true }).on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation()
      this.speak(person, `${npc.name}: ${npcLine(npc, this.snapshot.world, this.snapshot.business)}`)
      gameEvents.emit('npc:selected', npc.id)
    })
    const duration = npc.age >= 65 ? 30000 : npc.age < 18 ? 18000 : 22000
    this.tweens.add({ targets: person.root, x: fromLeft ? W + 100 : -100, duration: initial ? duration * 0.65 : duration, onComplete: () => { this.people = this.people.filter(p => p !== person); person.root.destroy() } })
    if (id % 3 === 0 || initial) this.time.delayedCall(300 + id * 130, () => { if (person.root.active) this.speak(person, line) })
  }
  private speak(actor: Actor, text: string): void {
    if (!actor.root.active) return
    if (this.bubbles.length >= 3) this.bubbles.shift()?.destroy()
    const bubble = this.add.container(0, -255)
    const label = this.add.text(0, 0, text, { fontFamily: FONT, fontSize: '23px', color: '#5b4130', fontStyle: 'bold', wordWrap: { width: 270 }, align: 'center', padding: { x: 15, y: 10 } }).setOrigin(0.5)
    const view = this.cameras.main.worldView
    bubble.x = Phaser.Math.Clamp(actor.root.x, view.left + label.width / 2 + 12, view.right - label.width / 2 - 12) - actor.root.x
    const bg = this.add.graphics().fillStyle(0xfffcf1).lineStyle(3, 0xcdbd97)
    bg.fillRoundedRect(-label.width / 2, -label.height / 2, label.width, label.height, 15).strokeRoundedRect(-label.width / 2, -label.height / 2, label.width, label.height, 15)
    bg.fillTriangle(-9, label.height / 2 - 1, 9, label.height / 2 - 1, 0, label.height / 2 + 14)
    bubble.add([bg, label]); actor.root.add(bubble); this.bubbles.push(bubble)
    this.time.delayedCall(3400, () => { this.bubbles = this.bubbles.filter((b) => b !== bubble); if (bubble.active) bubble.destroy() })
  }
  private sale(count: number, revenue: number): void {
    if (!this.booth) return
    const text = this.add.text(this.booth.x, this.booth.y - 155, `+${formatMoney(revenue, true)} · ${count} phần`, { fontFamily: FONT, fontSize: '25px', fontStyle: 'bold', color: '#fffbed', backgroundColor: '#416f53', padding: { x: 12, y: 8 } }).setOrigin(0.5).setDepth(70)
    this.tweens.add({ targets: text, y: text.y - 55, alpha: 0, duration: 1000, onComplete: () => text.destroy() })
  }
  private motorbike(): void {
    const root = this.add.container(-130, 1380).setDepth(30)
    const g = this.add.graphics().fillStyle(0x383637)
    g.fillCircle(-52, 20, 25).fillCircle(52, 20, 25)
    g.fillStyle(0xb7503d).fillRoundedRect(-67, -22, 140, 25, 10)
    g.lineStyle(7, 0x51443b).lineBetween(55, 10, 35, -62).lineBetween(35, -62, 13, -62)
    const riderNpc = NPC_CATALOG[70 + (this.count % 4)]!
    if (!this.textures.exists(riderNpc.id)) { root.destroy(); return }
    const rider = this.add.sprite(0, -16, riderNpc.id, '0').setOrigin(0.5, 0.9).setDisplaySize(80, 134)
    root.add([g, rider])
    this.tweens.add({ targets: root, x: W + 150, duration: 9000, onComplete: () => root.destroy() })
  }
  private applySnapshot(snapshot: GameSnapshot): void {
    this.snapshot = snapshot
    if (this.player && this.player.gender !== snapshot.player.gender) {
      this.player.gender = snapshot.player.gender
      this.player.sprite.stop().setFrame(snapshot.player.gender === 'female' ? '1-0' : '0-0')
    }
    this.boothText?.setText(!snapshot.business.owned ? 'MỞ QUẦY · 480K' : snapshot.business.open ? `ĐANG BÁN · ${snapshot.business.inventory} PHẦN` : `ĐÃ ĐÓNG · ${snapshot.business.inventory} PHẦN`)
    const hour = snapshot.world.minuteOfDay / 60
    const dark = hour < 5.5 || hour >= 19 ? 0.43 : hour < 7 ? 0.12 : 0
    this.lighting?.setAlpha(dark + (snapshot.world.weather === 'rain' ? 0.12 : 0))
    this.rain?.setVisible(snapshot.world.weather === 'rain')
  }
}
