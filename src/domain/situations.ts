import type { BusinessState, LifeSituation, SituationChoice, WorldState } from './types'

type SituationContext = Pick<WorldState, 'day' | 'minuteOfDay' | 'weather'> &
  Pick<BusinessState, 'price' | 'productName'>

type RandomState = { seed: number }

const names = [
  'An', 'B?nh', 'Chi', 'D?ng', 'H?', 'Huy', 'Lan', 'Linh', 'Mai', 'Minh', 'Nam', 'Ng?n',
  'Ph?c', 'Qu?n', 'Th?o', 'Trang', 'T?', 'Vy',
]

const roles = [
  'h?c sinh v?a tan ti?t', 'c? gi?o tr?c c?ng', 'anh giao h?ng bu?i s?m', 'c? c?ng nh?n ca ng?y',
  'b?c xe ?m c?ng ngh?', 'm? b?m ?ang v?i', 'c? b?n hoa ??u ng?', 'ch? b?o v? khu ph?',
  'b?n sinh vi?n ?i l?m th?m', 'b?c lao c?ng', 'c? y t? tr?c ??m', 'anh th? s?a xe',
  'c? ch? qu?n c? ph?', 'b?c n?ng d?n ch? rau', 'em nh? ?i c?ng b?', 'anh nh?n vi?n v?n ph?ng',
  'c? nhi?p ?nh gia', 'b?c h?u tr? ?i t?p th? d?c',
]

const locations = [
  'c?ng tr??ng B?nh Minh', 'ng? t? ??n xanh', 'ch? s?ng', 'v?a h? qu?n n??c',
  'tr?m xe bu?t', 's?n chung c?', 'h?m nh? c? ti?m t?p h?a', 'c?ng vi?n ven h?',
  'b?i g?i xe', 'khu kh?m b?nh', '???ng v?o ch? ??u m?i', 's?n b?ng thi?u nhi',
]

const needs = [
  { title: 'Qu?n v?', detail: 'v?a ph?t hi?n qu?n v? ? nh? v? ?ang l?ng t?ng t?m c?ch xoay x?.' },
  { title: 'B?a s?ng g?p', detail: 'c?n m?t b?a s?ng nhanh tr??c khi ca l?m b?t ??u.' },
  { title: '??n h?ng ??ng', detail: '?ang ph?i giao nhi?u ??n trong m?a v? ch?a k?p ?n g?.' },
  { title: 'Ch? con', detail: '?ang ch? con h?c xong nh?ng tr?i b?t ??u oi n?ng.' },
  { title: 'Ti?c l?p nh?', detail: 'mu?n ??t th?m ph?n ?n cho m?t nh?m b?n c?ng l?p.' },
  { title: 'Kh?ch quen', detail: '?? nghe h?ng x?m khen qu?y c?a b?n v? mu?n th? l?n ??u.' },
  { title: '??i ti?n l?', detail: 'ch? c?n ti?n m?nh gi? l?n, l?m m?i ng??i x?p h?ng ch?m l?i.' },
  { title: 'G?i v?n nh?m', detail: '?ang l?m d? ?n nh? v? h?i kinh nghi?m m? b?n.' },
  { title: 'Qu? c?m ?n', detail: 'mu?n mua ph?n ?n ?? c?m ?n m?t ng??i ?? gi?p m?nh.' },
  { title: 'M?t ?o m?a', detail: 'b? ??t v? c?n m?t ch? d?ng ch?n an to?n v?i ph?t.' },
  { title: 'T?m vi?c l?m th?m', detail: '?ang h?i th?m c?c qu?y h?ng trong khu ph?.' },
  { title: 'H?t pin ?i?n tho?i', detail: 'kh?ng th? li?n l?c v?i ng??i nh? ??ng l?c ?ang v?i.' },
  { title: '??n ??t chung', detail: 'c? th? r? th?m nhi?u ng??i c?ng mua n?u ???c ph?c v? nhanh.' },
  { title: 'B?a s?ng cho b?nh nh?n', detail: 'c?n mang ?? ?n nh? ??n khu kh?m b?nh g?n ??.' },
  { title: 'H?ng x?m m?i', detail: 'v?a chuy?n ??n v? ?ang t?m nh?ng ??a ?i?m ??ng tin trong khu.' },
  { title: 'Ng?y l??ng v?', detail: 'mu?n t? th??ng m?t b?a s?ng ngon sau ca l?m d?i.' },
]

const twists = [
  'M?t c?n gi? l?m t? th?c ??n bay xu?ng ???ng.',
  'Hai ng??i ph?a sau b?t ??u s?t ru?t v? s?p mu?n gi?.',
  'M?t ch? ch? nh? ng?i c?nh qu?y v? nh?n m?i ng??i r?t t? m?.',
  'Nh?m h?c sinh b?n c?nh ?ang quay video chia s? qu?n ?n s?ng.',
  'C? b?n hoa ??u ng? nh?n ra ng??i n?y v? kh? g?t ??u ch?o.',
  'M?t c?n m?a nh? v?a d?t khi?n v?a h? ??ng ng??i h?n.',
  'Ti?ng chu?ng v?o l?p vang l?n t? ph?a tr??ng h?c.',
  'M?t xe giao h?ng v?a d?ng g?n ??, l?m l?i ?i h?i ch?t.',
  'B?ng gi? c?a b?n ?ang ???c nhi?u ng??i ??ng xem.',
  'Ng??i h?ng x?m n?i ??y l? c? h?i ?? t?o thi?n c?m.',
  'C? kh?ch ph?a sau ?? ngh? nh?p ??n c?ng ?? ti?t ki?m th?i gian.',
  'Ng??i n?y h?a s? k? l?i tr?i nghi?m v?i c? t? d?n ph?.',
]

const moments = [
  'l?c khu ph? v?a th?c gi?c', 'trong gi? cao ?i?m', 'khi m?a v?a t?nh', 'tr??c gi? v?o ca',
]

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

function makeChoices(productName: string, price: number, state: RandomState): SituationChoice[] {
  const serviceCost = Math.max(4_000, Math.round(price * 0.28 / 1_000) * 1_000)
  const orderCount = 1 + Math.floor(next(state) * 3)
  const saleValue = price * orderCount

  return [
    {
      id: 'serve',
      label: `Ph?c v? ${orderCount} ph?n`,
      description: `B?n ${productName} th?t nhanh, ?u ti?n ng??i ?ang v?i.`,
      tone: 'business',
      effect: { money: saleValue, revenue: saleValue, inventory: -orderCount, businessReputation: 1.2, xp: 10 },
    },
    {
      id: 'help',
      label: 'H? tr? t? t?',
      description: 'Gi?m gi? v? gi?p h? gi?i quy?t vi?c g?p.',
      tone: 'kind',
      effect: { money: -serviceCost, expense: serviceCost, reputation: 2.4, businessReputation: 2.8, quality: 1, xp: 14 },
    },
    {
      id: 'connect',
      label: 'K?t n?i khu ph?',
      description: 'Gi?i thi?u th?m d?ch v? ph? h?p v? xin l?i gi?i thi?u.',
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
  const moment = pick(moments, state)
  const icon = context.weather === 'rain' ? '?' : pick(['??', '??', '??', '??', '??', '?'], state)
  const id = `d${context.day}-${context.minuteOfDay}-${state.seed.toString(36)}`

  return {
    seed: state.seed,
    situation: {
      id,
      title: `${need.title}: ${name}`,
      description: `${name}, ${role}, gh? qua ${location} ${moment}. H? ${need.detail} ${twist}`,
      character: name,
      role,
      location,
      icon,
      choices: makeChoices(context.productName, context.price, state),
    },
  }
}
