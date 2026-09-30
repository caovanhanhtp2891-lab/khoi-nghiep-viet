import type { BusinessState, WorldState } from './types'

export function npcChatLine(world: WorldState, business: BusinessState, sequence: number): { name: string; text: string } {
  const names = ['Cô Lan · Tạp hóa', 'Chú Bình · Xe ôm', 'Mai · Hàng xóm', 'Nam · Giao hàng', 'Bác Tư · Khách quen']
  const hour = world.minuteOfDay / 60
  const lines = world.weather === 'rain'
    ? ['Mưa rồi, mọi người nhớ mang áo mưa nhé!', 'Cho tôi trú mưa một lát nha.', 'Quầy có mái che là khách thích lắm đó.']
    : hour < 10
      ? [business.open ? `Quầy ${business.name} thơm quá, cho tôi một phần!` : 'Ai bán đồ ăn sáng nhớ mở quầy sớm nha.', 'Sáng nay khu phố đông vui ghê!', 'Ăn sáng xong mình đi làm thôi.']
      : hour < 18
        ? ['Chiều ghé chợ mua rau nhé mọi người.', 'Làm ly cà phê rồi làm tiếp thôi!', 'Khởi nghiệp phải kiên trì, mai lại cố gắng.']
        : ['Tối rồi, khu phố lên đèn đẹp quá!', 'Mai tôi ghé ăn xôi tiếp nha.', 'Cả nhà nghỉ sớm để mai khỏe nhé.']
  return { name: names[sequence % names.length]!, text: lines[sequence % lines.length]! }
}
