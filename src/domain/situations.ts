import type { BusinessState, LifeSituation, SituationChoice, WorldState } from './types'

type SituationContext = Pick<WorldState, 'day' | 'minuteOfDay' | 'weather'> &
  Pick<BusinessState, 'price' | 'productName'> & { unit?: string }

type RandomState = { seed: number }

const names = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Huy', 'Lan', 'Linh', 'Mai', 'Minh', 'Nam', 'Ngân', 'Phúc', 'Quân', 'Thảo', 'Trang', 'Tú', 'Vy']
const roles = ['học sinh vừa tan tiết', 'cô giáo trực cổng', 'anh giao hàng buổi sớm', 'cô công nhân ca ngày', 'bác xe ôm công nghệ', 'mẹ bỉm đang vội', 'cô bán hoa đầu ngõ', 'chú bảo vệ khu phố', 'bạn sinh viên đi làm thêm', 'bác lao công', 'cô y tá trực đêm', 'anh thợ sửa xe', 'cô chủ quán cà phê', 'bác nông dân chở rau', 'em nhỏ đi cùng bố', 'anh nhân viên văn phòng', 'cô nhiếp ảnh gia', 'bác hưu trí đi tập thể dục']
const locations = ['cổng trường Bình Minh', 'ngã tư đèn xanh', 'chợ sáng', 'vỉa hè quán nước', 'trạm xe buýt', 'sân chung cư', 'hẻm nhỏ có tiệm tạp hóa', 'công viên ven hồ', 'bãi gửi xe', 'khu khám bệnh', 'đường vào chợ đầu mối', 'sân bóng thiếu nhi']
const needs = [
  { title: 'Quên ví', detail: 'vừa phát hiện quên ví ở nhà và đang lúng túng tìm cách xoay xở.' },
  { title: 'Bữa sáng gấp', detail: 'cần một bữa sáng nhanh trước khi ca làm bắt đầu.' },
  { title: 'Đơn hàng đông', detail: 'đang phải giao nhiều đơn trong mưa và chưa kịp ăn gì.' },
  { title: 'Chờ con', detail: 'đang chờ con học xong nhưng trời bắt đầu oi nóng.' },
  { title: 'Tiệc lớp nhỏ', detail: 'muốn đặt thêm phần ăn cho một nhóm bạn cùng lớp.' },
  { title: 'Khách quen', detail: 'đã nghe hàng xóm khen quầy của bạn và muốn thử lần đầu.' },
  { title: 'Đổi tiền lẻ', detail: 'chỉ có tiền mệnh giá lớn, làm mọi người xếp hàng chậm lại.' },
  { title: 'Góp vốn nhóm', detail: 'đang làm dự án nhỏ và hỏi kinh nghiệm mở bán.' },
  { title: 'Quà cảm ơn', detail: 'muốn mua phần ăn để cảm ơn một người đã giúp mình.' },
  { title: 'Mất áo mưa', detail: 'bị ướt và cần một chỗ dừng chân an toàn vài phút.' },
  { title: 'Tìm việc làm thêm', detail: 'đang hỏi thăm các quầy hàng trong khu phố.' },
  { title: 'Hết pin điện thoại', detail: 'không thể liên lạc với người nhà đúng lúc đang vội.' },
  { title: 'Đơn đặt chung', detail: 'có thể rủ thêm nhiều người cùng mua nếu được phục vụ nhanh.' },
  { title: 'Bữa sáng cho bệnh nhân', detail: 'cần mang đồ ăn nhẹ đến khu khám bệnh gần đó.' },
  { title: 'Hàng xóm mới', detail: 'vừa chuyển đến và đang tìm những địa điểm đáng tin trong khu.' },
  { title: 'Ngày lương về', detail: 'muốn tự thưởng một bữa sáng ngon sau ca làm dài.' },
  { title: 'Đơn tổ dân quân', detail: 'chuẩn bị tới buổi sinh hoạt của tổ dân quân và muốn đặt đồ mang theo.' },
  { title: 'Ca tuần tra', detail: 'vừa hết ca tuần tra khu phố và ghé mua đồ trước khi về nhà.' },
  { title: 'Nhóm kế toán', detail: 'đang tổng hợp sổ sách cùng đồng nghiệp và muốn đặt một đơn chung.' },
  { title: 'Chờ xe buýt', detail: 'còn ít phút trước chuyến xe buýt và cần mua món dễ mang đi.' },
  { title: 'Chuyến giao hàng', detail: 'vừa giao xong hàng ở đầu ngõ và muốn ghé nghỉ chân một lát.' },
  { title: 'Buổi tập văn nghệ', detail: 'đang chuẩn bị cho buổi tập văn nghệ của khu phố và muốn đặt đồ cho nhóm.' },
  { title: 'Khách ghé chợ phiên', detail: 'ghé khu phố trong ngày chợ phiên và muốn thử món được hàng xóm giới thiệu.' },
  { title: 'Đơn ít ngọt', detail: 'hỏi về nguyên liệu và muốn chọn món hợp khẩu vị của mình.' },
  { title: 'Mang tới công trình', detail: 'muốn mua đồ cho đồng nghiệp đang nghỉ ở công trình gần đó.' },
  { title: 'Cảm ơn đội hỗ trợ', detail: 'muốn đặt một đơn để cảm ơn những người vừa giúp dọn khu phố.' },
]
const twists = ['Một cơn gió làm tờ thực đơn bay xuống đường.', 'Hai người phía sau bắt đầu sốt ruột vì sắp muộn giờ.', 'Một chú chó nhỏ ngồi cạnh quầy và nhìn mọi người rất tò mò.', 'Nhóm học sinh bên cạnh đang quay video chia sẻ quán ăn sáng.', 'Cô bán hoa đầu ngõ nhận ra người này và khẽ gật đầu chào.', 'Một cơn mưa nhỏ vừa dứt khiến vỉa hè đông người hơn.', 'Tiếng chuông vào lớp vang lên từ phía trường học.', 'Một xe giao hàng vừa dừng gần đó, làm lối đi hơi chật.', 'Bảng giá của bạn đang được nhiều người đứng xem.', 'Người hàng xóm nói đây là cơ hội để tạo thiện cảm.', 'Có khách phía sau đề nghị nhập đơn cùng để tiết kiệm thời gian.', 'Người này hứa sẽ kể lại trải nghiệm với cả tổ dân phố.']
const moments = ['lúc khu phố vừa thức giấc', 'trong giờ cao điểm', 'khi mưa vừa tạnh', 'trước giờ vào ca']

export const SITUATION_INTERVAL_MINUTES = 75
export const SCENARIO_COMBINATION_COUNT =
  names.length * roles.length * locations.length * needs.length * twists.length * moments.length

function next(state: RandomState): number {
  state.seed = (Math.imul(state.seed, 1_664_525) + 1_013_904_223) >>> 0
  return state.seed / 4_294_967_296
}

function pick<T>(items: readonly T[], state: RandomState): T {
  return items[Math.floor(next(state) * items.length)]!
}

function makeChoices(productName: string, price: number, state: RandomState,unit='phần'): SituationChoice[] {
  const serviceCost = Math.max(4_000, Math.round(price * 0.28 / 1_000) * 1_000)
  const orderCount = 1 + Math.floor(next(state) * 3)
  const saleValue = price * orderCount

  return [
    {
      id: 'serve',
      label: `Phục vụ ${orderCount} ${unit}`,
      description: `Bán ${productName} thật nhanh, ưu tiên người đang vội.`,
      tone: 'business',
      effect: { money: saleValue, revenue: saleValue, inventory: -orderCount, businessReputation: 1.2, xp: 10 },
    },
    {
      id: 'help',
      label: 'Hỗ trợ tử tế',
      description: 'Giảm giá và giúp họ giải quyết việc gấp.',
      tone: 'kind',
      effect: { money: -serviceCost, expense: serviceCost, reputation: 2.4, businessReputation: 2.8, quality: 1, xp: 14 },
    },
    {
      id: 'connect',
      label: 'Kết nối khu phố',
      description: 'Giới thiệu thêm dịch vụ phù hợp và xin lời giới thiệu.',
      tone: 'careful',
      effect: { marketing: 6, reputation: 1, businessReputation: 0.8, xp: 8 },
    },
  ]
}

export function generateLifeSituation(
  seed: number,
  context: SituationContext,
): { situation: LifeSituation; seed: number } {
  const state: RandomState = { seed }
  const name = pick(names, state)
  const role = pick(roles, state)
  const location = pick(locations, state)
  const need = pick(needs, state)
  const twist = pick(twists, state)
  const originalMoment = pick(moments, state)
  const moment = context.minuteOfDay >= 720 ? 'trong nhịp chiều của khu phố' : originalMoment
  const icon = context.weather === 'rain' ? '🌧️' : pick(['🌻', '🍚', '💬', '🚲', '☀️', '🏡'], state)
  const id = `d${context.day}-${context.minuteOfDay}-${state.seed.toString(36)}`

  const choices = makeChoices(context.productName, context.price, state,context.unit)
  return {
    seed: state.seed,
    situation: {
      id,
      title: `${need.title}: ${name}`,
      description: `${name}, ${role}, ghé qua ${location} ${moment}. Họ ${context.minuteOfDay >= 720 ? need.detail.replaceAll('bữa sáng','món ăn hoặc đồ uống') : need.detail} ${twist}`,
      character: name,
      role,
      location,
      icon,
      choices,
    },
  }
}
