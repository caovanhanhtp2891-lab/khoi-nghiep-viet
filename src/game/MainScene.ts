import Phaser from 'phaser'
import { formatMoney } from '../domain/format'
import type { GameSnapshot, Weather } from '../domain/types'
import { snapshotFromStore, useGameStore } from '../store/gameStore'
import { gameEvents } from './events'

const COLORS = {
  cream: 0xf7f1df,
  grass: 0xa9d7a0,
  grassDark: 0x7fba78,
  road: 0x60706d,
  roadLine: 0xf7d46c,
  sidewalk: 0xd9d1bd,
  orange: 0xef6a45,
  yellow: 0xf5b942,
  green: 0x0d6655,
  navy: 0x173b42,
  blue: 0x4f8fc0,
  white: 0xffffff,
  brown: 0x8b5b3e,
}

export class MainScene extends Phaser.Scene {
  private worldLayer?: Phaser.GameObjects.Container
  private npcLayer?: Phaser.GameObjects.Container
  private rainLayer?: Phaser.GameObjects.Container
  private nightOverlay?: Phaser.GameObjects.Graphics
  private booth?: Phaser.GameObjects.Container
  private boothStatus?: Phaser.GameObjects.Text
  private player?: Phaser.GameObjects.Container
  private unsubscribe: Array<() => void> = []
  private rainDrops: Phaser.GameObjects.Rectangle[] = []
  private lastSnapshot = snapshotFromStore(useGameStore.getState())
  private npcSequence = 0
  private activeNpcCount = 0

  constructor() {
    super('main-scene')
  }
  preload(): void {
    for (let index = 1; index <= 12; index += 1) {
      const suffix = index.toString().padStart(2, '0')
      this.load.image(`user-npc-${suffix}`, `assets/npcs/user-npc-${suffix}.png`)
    }
  }


  create(): void {
    this.worldLayer = this.add.container(0, 0).setDepth(0)
    this.npcLayer = this.add.container(0, 0).setDepth(8)
    this.rainLayer = this.add.container(0, 0).setDepth(30)
    this.nightOverlay = this.add.graphics().setDepth(25)

    this.drawWorld()
    this.createRain()
    this.applySnapshot(this.lastSnapshot)

    this.unsubscribe.push(
      gameEvents.on('simulation:update', (snapshot) => {
        this.lastSnapshot = snapshot
        this.applySnapshot(snapshot)
      }),
      gameEvents.on('sale', ({ count, revenue }) => this.showSale(count, revenue)),
      gameEvents.on('reset', () => {
        this.lastSnapshot = snapshotFromStore(useGameStore.getState())
        this.applySnapshot(this.lastSnapshot)
      }),
    )

    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => this.spawnPasserby(),
    })
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => this.animateRain(),
    })

    this.scale.on('resize', this.handleResize, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanUp())
  }

  private cleanUp(): void {
    this.unsubscribe.forEach((dispose) => dispose())
    this.unsubscribe = []
    this.scale.off('resize', this.handleResize, this)
  }

  private handleResize(): void {
    this.drawWorld()
    this.createRain()
    this.applySnapshot(this.lastSnapshot)
  }

  private drawWorld(): void {
    const width = this.scale.width
    const height = this.scale.height
    this.worldLayer?.removeAll(true)
    this.npcLayer?.removeAll(true)
    this.activeNpcCount = 0

    const graphics = this.add.graphics()
    this.worldLayer?.add(graphics)

    graphics.fillStyle(COLORS.cream).fillRect(0, 0, width, height)
    graphics.fillStyle(COLORS.grass).fillRect(0, 0, width, height)

    const roadY = height * 0.52
    const roadHeight = Math.max(96, height * 0.22)
    const roadX = width * 0.58
    const roadWidth = Math.max(88, width * 0.16)

    graphics.fillStyle(COLORS.sidewalk)
    graphics.fillRect(0, roadY - 18, width, roadHeight + 36)
    graphics.fillRect(roadX - 16, 0, roadWidth + 32, height)
    graphics.fillStyle(COLORS.road)
    graphics.fillRect(0, roadY, width, roadHeight)
    graphics.fillRect(roadX, 0, roadWidth, height)

    graphics.lineStyle(3, COLORS.roadLine, 0.8)
    for (let x = 12; x < width; x += 48) {
      graphics.lineBetween(x, roadY + roadHeight / 2, Math.min(x + 24, width), roadY + roadHeight / 2)
    }
    for (let y = 12; y < height; y += 48) {
      graphics.lineBetween(roadX + roadWidth / 2, y, roadX + roadWidth / 2, Math.min(y + 24, height))
    }

    this.addBuilding(width * 0.08, height * 0.1, 150, 94, COLORS.yellow, 'TRƯỜNG HỌC', '🏫')
    this.addBuilding(width * 0.73, height * 0.11, 148, 90, COLORS.orange, 'CHỢ SỚM', '🧺')
    this.addBuilding(width * 0.07, height * 0.79, 118, 72, COLORS.blue, 'KHU TRỌ', '🏠')
    this.addBuilding(width * 0.76, height * 0.78, 130, 74, COLORS.green, 'TẠP HÓA', '🏪')

    this.addTree(width * 0.28, height * 0.18)
    this.addTree(width * 0.88, height * 0.43)
    this.addTree(width * 0.2, height * 0.88)
    this.addTree(width * 0.72, height * 0.89)

    this.booth = this.createBooth(width * 0.38, roadY - 40)
    this.worldLayer?.add(this.booth)
    this.player = this.createPerson(this.getAvatarColor(this.lastSnapshot.player.avatarStyle), 1.1)
    this.player.setPosition(width * 0.49, roadY - 10)
    this.worldLayer?.add(this.player)
  }

  private addBuilding(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    label: string,
    emoji: string,
  ): void {
    const maxWidth = Math.min(width, this.scale.width * 0.28)
    const building = this.add.graphics()
    building.fillStyle(0x000000, 0.12).fillRoundedRect(x + 6, y + 8, maxWidth, height, 12)
    building.fillStyle(color).fillRoundedRect(x, y, maxWidth, height, 12)
    building.fillStyle(COLORS.white, 0.88).fillRoundedRect(x + 10, y + 34, maxWidth - 20, height - 44, 7)
    building.fillStyle(COLORS.navy, 0.72).fillRect(x + maxWidth * 0.42, y + height - 34, 26, 34)

    const title = this.add
      .text(x + maxWidth / 2, y + 18, `${emoji} ${label}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${Math.max(10, Math.min(13, this.scale.width / 42))}px`,
        fontStyle: 'bold',
        color: '#173b42',
      })
      .setOrigin(0.5)
    this.worldLayer?.add([building, title])
  }

  private addTree(x: number, y: number): void {
    const tree = this.add.graphics()
    tree.fillStyle(COLORS.brown).fillRoundedRect(x - 4, y + 13, 8, 22, 3)
    tree.fillStyle(COLORS.green).fillCircle(x, y, 18)
    tree.fillStyle(COLORS.grassDark).fillCircle(x - 9, y + 5, 11)
    this.worldLayer?.add(tree)
  }

  private createBooth(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setDepth(10)
    const graphics = this.add.graphics()
    graphics.fillStyle(0x000000, 0.18).fillEllipse(4, 42, 116, 24)
    graphics.fillStyle(COLORS.brown).fillRoundedRect(-47, -16, 94, 58, 8)
    graphics.fillStyle(COLORS.white).fillRoundedRect(-43, -12, 86, 47, 5)
    graphics.fillStyle(COLORS.orange).fillTriangle(-55, -20, 55, -20, 43, -48)
    graphics.fillStyle(COLORS.yellow).fillTriangle(-55, -20, 0, -20, -12, -48)
    graphics.fillStyle(COLORS.navy).fillRoundedRect(-34, -9, 68, 23, 6)
    graphics.fillStyle(COLORS.road).fillCircle(-38, 42, 10)
    graphics.fillCircle(38, 42, 10)

    const label = this.add
      .text(0, 2, 'XÔI SÁNG 18', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#fff8e8',
      })
      .setOrigin(0.5)

    this.boothStatus = this.add
      .text(0, -63, 'CHƯA SỞ HỮU', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#173b42',
        padding: { x: 7, y: 4 },
      })
      .setOrigin(0.5)

    container.add([graphics, label, this.boothStatus])
    container.setSize(120, 110).setInteractive({ useHandCursor: true })
    container.on('pointerdown', () => gameEvents.emit('business:selected', undefined))
    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.05, duration: 120 }))
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1, duration: 120 }))
    return container
  }

  private createPerson(color: number, scale = 1): Phaser.GameObjects.Container {
    const person = this.add.container(0, 0).setScale(scale)
    const shadow = this.add.ellipse(0, 17, 22, 8, 0x000000, 0.18)
    const body = this.add.rectangle(0, 2, 18, 26, color).setStrokeStyle(2, COLORS.white, 0.45)
    const head = this.add.circle(0, -17, 9, 0xf2bd91).setStrokeStyle(2, 0x6c4330, 0.35)
    const legLeft = this.add.rectangle(-5, 18, 5, 13, COLORS.navy)
    const legRight = this.add.rectangle(5, 18, 5, 13, COLORS.navy)
    person.add([shadow, legLeft, legRight, body, head])
    return person
  }
  private createNpc(index: number, scale = 1): Phaser.GameObjects.Container {
    const person = this.add.container(0, 0).setScale(scale)
    const shadow = this.add.ellipse(0, 19, 30, 9, 0x000000, 0.16)
    const suffix = index.toString().padStart(2, '0')
    const sprite = this.add.image(0, 2, `user-npc-${suffix}`).setOrigin(0.5, 0.86)
    sprite.setDisplaySize(48, 62)
    person.add([shadow, sprite])
    this.tweens.add({
      targets: sprite,
      y: -1,
      duration: 260 + Math.random() * 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
    return person
  }


  private getAvatarColor(style: GameSnapshot['player']['avatarStyle']): number {
    return { green: COLORS.green, orange: COLORS.orange, blue: COLORS.blue }[style]
  }

  private spawnPasserby(): void {
    const width = this.scale.width
    const height = this.scale.height
    if (width <= 0 || height <= 0 || !this.npcLayer) return

    const rainFactor = this.lastSnapshot.world.weather === 'rain' ? 0.55 : 1
    if (Math.random() > rainFactor) return

    this.npcSequence = (this.npcSequence % 12) + 1
    const person = this.createNpc(this.npcSequence, 0.8 + Math.random() * 0.15)
    this.activeNpcCount += 1
    const y = height * (0.58 + Math.random() * 0.1)
    const leftToRight = Math.random() > 0.5
    person.setPosition(leftToRight ? -30 : width + 30, y)
    this.npcLayer.add(person)

    this.tweens.add({
      targets: person,
      x: leftToRight ? width + 35 : -35,
      y: y + (Math.random() - 0.5) * 12,
      duration: 6_500 + Math.random() * 3_500,
      ease: 'Linear',
      onComplete: () => {
        person.destroy()
        this.activeNpcCount = Math.max(0, this.activeNpcCount - 1)
      },
    })
  }

  private showSale(count: number, revenue: number): void {
    if (!this.booth || !this.npcLayer) return
    const customer = this.createNpc(1 + Math.floor(Math.random() * 12), 0.78)
    customer.setPosition(this.booth.x + 70, this.booth.y + 28)
    this.npcLayer.add(customer)
    this.tweens.add({
      targets: customer,
      x: this.booth.x + 25,
      duration: 420,
      yoyo: true,
      hold: 480,
      onComplete: () => customer.destroy(),
    })

    const coin = this.add
      .text(this.booth.x, this.booth.y - 80, `+${formatMoney(revenue, true)} · ${count} khách`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#0d6655',
        padding: { x: 8, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(40)
    this.tweens.add({
      targets: coin,
      y: coin.y - 36,
      alpha: 0,
      duration: 1_250,
      ease: 'Cubic.easeOut',
      onComplete: () => coin.destroy(),
    })
  }

  private createRain(): void {
    this.rainLayer?.removeAll(true)
    this.rainDrops = []
    const width = this.scale.width
    const height = this.scale.height

    for (let index = 0; index < 42; index += 1) {
      const drop = this.add
        .rectangle(Math.random() * width, Math.random() * height, 2, 16, 0xb9e6ff, 0.65)
        .setRotation(-0.25)
      this.rainDrops.push(drop)
      this.rainLayer?.add(drop)
    }
  }

  private animateRain(): void {
    if (this.lastSnapshot.world.weather !== 'rain') return
    const width = this.scale.width
    const height = this.scale.height
    this.rainDrops.forEach((drop) => {
      drop.x -= 4
      drop.y += 18
      if (drop.y > height + 20) {
        drop.y = -20
        drop.x = Math.random() * width
      }
    })
  }

  private applySnapshot(snapshot: GameSnapshot): void {
    if (this.booth) {
      this.booth.setAlpha(snapshot.business.owned ? 1 : 0.56)
    }
    if (this.boothStatus) {
      const text = !snapshot.business.owned
        ? 'CHƯA SỞ HỮU'
        : snapshot.business.open
          ? `ĐANG BÁN · ${snapshot.business.inventory} PHẦN`
          : `ĐÃ ĐÓNG · ${snapshot.business.inventory} PHẦN`
      const color = snapshot.business.open ? '#0d6655' : '#173b42'
      this.boothStatus.setText(text).setBackgroundColor(color)
    }
    if (this.rainLayer) {
      this.rainLayer.setVisible(snapshot.world.weather === 'rain')
    }
    this.updateLighting(snapshot.world.minuteOfDay, snapshot.world.weather)
  }

  private updateLighting(minute: number, weather: Weather): void {
    if (!this.nightOverlay) return
    const width = this.scale.width
    const height = this.scale.height
    let darkness = 0

    if (minute < 330) darkness = 0.52
    else if (minute < 450) darkness = 0.52 * (1 - (minute - 330) / 120)
    else if (minute > 1_200) darkness = Math.min(0.56, (minute - 1_200) / 300)

    if (weather === 'cloudy') darkness += 0.06
    if (weather === 'rain') darkness += 0.13

    this.nightOverlay.clear()
    if (darkness > 0) {
      this.nightOverlay.fillStyle(0x102f4a, darkness).fillRect(0, 0, width, height)
    }
  }
}
