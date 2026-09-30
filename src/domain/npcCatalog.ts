import type { Gender, WorldState, BusinessState } from './types'

export type NpcGroup = 'school' | 'food' | 'trade' | 'health' | 'office' | 'culture' | 'community' | 'transport' | 'farm' | 'service'
export type Outfit = 'uniform' | 'apron' | 'workwear' | 'coat' | 'suit' | 'aodai' | 'baba' | 'casual'
export type Accessory = 'bag' | 'basket' | 'tools' | 'book' | 'medical' | 'laptop' | 'flowers' | 'parcel' | 'produce' | 'camera'
export type Hat = 'none' | 'conical' | 'helmet' | 'hardhat' | 'chef' | 'cap'
export interface NpcProfile {
  id: string; name: string; age: number; gender: Gender; job: string; group: NpcGroup
  outfit: Outfit; accessory: Accessory; hat: Hat; color: string; accent: string
  skin: string; hair: string; hairStyle: number; glasses: boolean; variant: number
}
const roles: Record<string, { group: NpcGroup; outfit: Outfit; accessory: Accessory; hat: Hat; advice: string }> = {
  'Học sinh tiểu học': { group: 'school', outfit: 'uniform', accessory: 'bag', hat: 'none', advice: 'Con thích phần xôi nhỏ, dễ mang tới lớp.' },
  'Học sinh THCS': { group: 'school', outfit: 'uniform', accessory: 'book', hat: 'none', advice: 'Trước giờ vào lớp, tụi em cần mua thật nhanh.' },
  'Học sinh THPT': { group: 'school', outfit: 'uniform', accessory: 'bag', hat: 'none', advice: 'Một bữa sáng đủ chất giúp em học tốt hơn.' },
  'Sinh viên': { group: 'school', outfit: 'casual', accessory: 'book', hat: 'cap', advice: 'Giá hợp túi tiền thì tụi mình sẽ ghé thường xuyên.' },
  'Giáo viên': { group: 'school', outfit: 'aodai', accessory: 'book', hat: 'none', advice: 'Hàng ăn gần trường cần sạch sẽ và phục vụ đúng giờ.' },
  'Bán xôi': { group: 'food', outfit: 'apron', accessory: 'basket', hat: 'conical', advice: 'Gạo nếp ngon và giữ nóng tốt là bí quyết của tôi.' },
  'Bán bánh mì': { group: 'food', outfit: 'apron', accessory: 'basket', hat: 'cap', advice: 'Chuẩn bị nguyên liệu trước giờ cao điểm nhé.' },
  'Đầu bếp': { group: 'food', outfit: 'coat', accessory: 'tools', hat: 'chef', advice: 'Chất lượng ổn định khiến khách quay lại.' },
  'Pha chế': { group: 'food', outfit: 'apron', accessory: 'basket', hat: 'none', advice: 'Một lời chào vui vẻ cũng làm khách nhớ quán.' },
  'Bán chè': { group: 'food', outfit: 'baba', accessory: 'basket', hat: 'conical', advice: 'Ngày nóng khách thích đồ thanh mát, nhớ quan sát thời tiết.' },
  'Thợ xây': { group: 'trade', outfit: 'workwear', accessory: 'tools', hat: 'hardhat', advice: 'Tụi tôi cần bữa sáng chắc bụng trước khi vào công trình.' },
  'Thợ điện': { group: 'trade', outfit: 'workwear', accessory: 'tools', hat: 'hardhat', advice: 'Dụng cụ điện gần quầy cần tránh nước và kiểm tra thường xuyên.' },
  'Thợ sửa xe': { group: 'trade', outfit: 'workwear', accessory: 'tools', hat: 'cap', advice: 'Xe bán hàng phải chắc chắn, bánh xe dễ di chuyển.' },
  'Thợ mộc': { group: 'trade', outfit: 'workwear', accessory: 'tools', hat: 'none', advice: 'Một biển hiệu rõ ràng giúp người đi đường thấy quầy.' },
  'Thợ may': { group: 'trade', outfit: 'baba', accessory: 'tools', hat: 'none', advice: 'Tạp dề gọn gàng tạo thiện cảm với khách.' },
  'Bác sĩ': { group: 'health', outfit: 'coat', accessory: 'medical', hat: 'none', advice: 'Vệ sinh thực phẩm và sức khỏe người bán cần được ưu tiên.' },
  'Điều dưỡng': { group: 'health', outfit: 'coat', accessory: 'medical', hat: 'cap', advice: 'Những ca trực sớm cần đồ ăn mang đi tiện lợi.' },
  'Dược sĩ': { group: 'health', outfit: 'coat', accessory: 'medical', hat: 'none', advice: 'Đừng quên nghỉ ngơi và uống đủ nước khi bán hàng.' },
  'Kỹ thuật viên xét nghiệm': { group: 'health', outfit: 'coat', accessory: 'medical', hat: 'none', advice: 'Làm việc theo quy trình giúp giảm sai sót.' },
  'Nhân viên cứu hộ': { group: 'health', outfit: 'workwear', accessory: 'medical', hat: 'helmet', advice: 'Lối đi quanh quầy nên thông thoáng.' },
  'Nhân viên văn phòng': { group: 'office', outfit: 'suit', accessory: 'laptop', hat: 'none', advice: 'Giao đúng giờ khiến cả văn phòng tin tưởng.' },
  'Kế toán': { group: 'office', outfit: 'suit', accessory: 'book', hat: 'none', advice: 'Doanh thu khác lợi nhuận; luôn ghi cả giá vốn và chi phí.' },
  'Lập trình viên': { group: 'office', outfit: 'casual', accessory: 'laptop', hat: 'none', advice: 'Thử từng thay đổi nhỏ rồi đo kết quả nhé.' },
  'Nhân viên ngân hàng': { group: 'office', outfit: 'suit', accessory: 'laptop', hat: 'none', advice: 'Giữ một khoản dự phòng trước khi mở rộng quầy.' },
  'Nhà thiết kế': { group: 'office', outfit: 'casual', accessory: 'book', hat: 'none', advice: 'Biển hiệu dễ đọc tốt hơn quá nhiều chi tiết.' },
  'Nghệ sĩ đờn ca': { group: 'culture', outfit: 'aodai', accessory: 'book', hat: 'none', advice: 'Khu phố có tiếng đàn và chuyện trò thật ấm áp.' },
  'Nhiếp ảnh gia': { group: 'culture', outfit: 'casual', accessory: 'camera', hat: 'cap', advice: 'Ánh sáng buổi sáng làm món ăn trông hấp dẫn hơn.' },
  'Thủ thư': { group: 'culture', outfit: 'aodai', accessory: 'book', hat: 'none', advice: 'Mỗi ngày học một điều mới, rồi áp dụng vào quầy.' },
  'Họa sĩ': { group: 'culture', outfit: 'apron', accessory: 'book', hat: 'cap', advice: 'Màu sắc ấm áp khiến góc phố gần gũi hơn.' },
  'Hướng dẫn viên': { group: 'culture', outfit: 'aodai', accessory: 'camera', hat: 'conical', advice: 'Du khách thích nghe câu chuyện về món ăn Việt Nam.' },
  'Người nghỉ hưu': { group: 'community', outfit: 'baba', accessory: 'basket', hat: 'none', advice: 'Buôn bán bền lâu nhờ giữ chữ tín với hàng xóm.' },
  'Tổ trưởng dân phố': { group: 'community', outfit: 'casual', accessory: 'book', hat: 'none', advice: 'Giữ vỉa hè sạch và chừa lối đi cho mọi người nhé.' },
  'Tình nguyện viên': { group: 'community', outfit: 'uniform', accessory: 'bag', hat: 'cap', advice: 'Có dịp cùng dọn khu phố thì rủ tôi với.' },
  'Nhân viên vệ sinh': { group: 'community', outfit: 'workwear', accessory: 'tools', hat: 'conical', advice: 'Phân loại rác sau ca bán giúp đường phố sạch hơn.' },
  'Người chăm sóc gia đình': { group: 'community', outfit: 'baba', accessory: 'basket', hat: 'none', advice: 'Nhà tôi thích người bán nhớ khẩu vị của từng người.' },
  'Tài xế xe ôm': { group: 'transport', outfit: 'workwear', accessory: 'bag', hat: 'helmet', advice: 'Khách đi làm thường mua đồ ăn trước chuyến xe.' },
  'Nhân viên giao hàng': { group: 'transport', outfit: 'uniform', accessory: 'parcel', hat: 'helmet', advice: 'Đóng gói chắc và ghi rõ đơn giúp giao thuận lợi.' },
  'Tài xế xe buýt': { group: 'transport', outfit: 'uniform', accessory: 'bag', hat: 'cap', advice: 'Tôi chỉ có ít phút nghỉ; phục vụ nhanh rất quan trọng.' },
  'Bưu tá': { group: 'transport', outfit: 'uniform', accessory: 'parcel', hat: 'helmet', advice: 'Địa chỉ và tên người nhận nên rõ ràng.' },
  'Nhân viên kho': { group: 'transport', outfit: 'workwear', accessory: 'parcel', hat: 'hardhat', advice: 'Nhập hàng vừa đủ, đừng để tồn quá nhiều.' },
  'Trồng rau': { group: 'farm', outfit: 'baba', accessory: 'produce', hat: 'conical', advice: 'Chọn nguyên liệu tươi mỗi ngày nhé.' },
  'Trồng lúa': { group: 'farm', outfit: 'baba', accessory: 'produce', hat: 'conical', advice: 'Hạt gạo ngon là công sức của cả một mùa.' },
  'Bán trái cây': { group: 'farm', outfit: 'apron', accessory: 'produce', hat: 'conical', advice: 'Trái cây theo mùa thường ngon và giá dễ chịu.' },
  'Bán hoa': { group: 'farm', outfit: 'apron', accessory: 'flowers', hat: 'conical', advice: 'Một chậu hoa nhỏ cũng làm quầy vui mắt.' },
  'Ngư dân': { group: 'farm', outfit: 'workwear', accessory: 'basket', hat: 'cap', advice: 'Đi làm sớm thì bữa sáng nóng hổi quý lắm.' },
  'Chủ tạp hóa': { group: 'service', outfit: 'baba', accessory: 'basket', hat: 'none', advice: 'Khách quen cần sự ổn định và lời chào thân thiện.' },
  'Thợ cắt tóc': { group: 'service', outfit: 'apron', accessory: 'tools', hat: 'none', advice: 'Nhớ sở thích của khách là cách giữ khách lâu dài.' },
  'Nhân viên khách sạn': { group: 'service', outfit: 'suit', accessory: 'laptop', hat: 'none', advice: 'Phục vụ chu đáo bắt đầu từ những việc nhỏ.' },
  'Bảo vệ': { group: 'service', outfit: 'uniform', accessory: 'bag', hat: 'cap', advice: 'Ca trực dài, một bữa ăn đúng giờ giúp tôi tỉnh táo.' },
  'Thợ sửa điện thoại': { group: 'service', outfit: 'workwear', accessory: 'tools', hat: 'none', advice: 'Khách tin người nói rõ giá và làm đúng hẹn.' },
}
// 100 fictional residents, hand-authored identities; visuals are reproducible from this catalog.
const rows: Array<[string, number, Gender, string]> = [
 ['An',7,'male','Học sinh tiểu học'],['Bông',8,'female','Học sinh tiểu học'],
 ['Khang',12,'male','Học sinh THCS'],['Ngọc',13,'female','Học sinh THCS'],
 ['Tuấn',16,'male','Học sinh THPT'],['Linh',17,'female','Học sinh THPT'],
 ['Huy',20,'male','Sinh viên'],['Vy',21,'female','Sinh viên'],
 ['Thầy Phúc',38,'male','Giáo viên'],['Cô Hương',34,'female','Giáo viên'],
 ['Chú Sáu',54,'male','Bán xôi'],['Dì Hạnh',49,'female','Bán xôi'],
 ['Anh Tài',29,'male','Bán bánh mì'],['Chị Liên',36,'female','Bán bánh mì'],
 ['Anh Vũ',32,'male','Đầu bếp'],['Chị Thảo',27,'female','Đầu bếp'],
 ['Duy',23,'male','Pha chế'],['Trâm',25,'female','Pha chế'],
 ['Chú Bảy',58,'male','Bán chè'],['Dì Nga',61,'female','Bán chè'],
 ['Anh Sơn',41,'male','Thợ xây'],['Chị Loan',35,'female','Thợ xây'],
 ['Anh Điền',30,'male','Thợ điện'],['Chị Ánh',28,'female','Thợ điện'],
 ['Chú Lộc',52,'male','Thợ sửa xe'],['Chị Kim',33,'female','Thợ sửa xe'],
 ['Bác Đạt',60,'male','Thợ mộc'],['Chị Ngân',39,'female','Thợ mộc'],
 ['Chú Đức',48,'male','Thợ may'],['Dì Tâm',55,'female','Thợ may'],
 ['Bác sĩ Minh',43,'male','Bác sĩ'],['Bác sĩ Diệp',37,'female','Bác sĩ'],
 ['Anh Hải',26,'male','Điều dưỡng'],['Chị Yến',31,'female','Điều dưỡng'],
 ['Anh Quân',35,'male','Dược sĩ'],['Chị Hà',42,'female','Dược sĩ'],
 ['Anh Kiên',29,'male','Kỹ thuật viên xét nghiệm'],['Chị Uyên',24,'female','Kỹ thuật viên xét nghiệm'],
 ['Anh Hùng',33,'male','Nhân viên cứu hộ'],['Chị Oanh',30,'female','Nhân viên cứu hộ'],
 ['Anh Long',28,'male','Nhân viên văn phòng'],['Chị Chi',32,'female','Nhân viên văn phòng'],
 ['Anh Thành',45,'male','Kế toán'],['Chị Dung',39,'female','Kế toán'],
 ['Hoàng',24,'male','Lập trình viên'],['My',23,'female','Lập trình viên'],
 ['Anh Khôi',36,'male','Nhân viên ngân hàng'],['Chị Phương',29,'female','Nhân viên ngân hàng'],
 ['Anh Bảo',27,'male','Nhà thiết kế'],['Chị Tú',26,'female','Nhà thiết kế'],
 ['Chú Năm',63,'male','Nghệ sĩ đờn ca'],['Dì Lệ',57,'female','Nghệ sĩ đờn ca'],
 ['Anh Phong',31,'male','Nhiếp ảnh gia'],['Chị Vân',34,'female','Nhiếp ảnh gia'],
 ['Chú Trí',50,'male','Thủ thư'],['Cô Thu',46,'female','Thủ thư'],
 ['Anh Thiện',40,'male','Họa sĩ'],['Chị Quỳnh',28,'female','Họa sĩ'],
 ['Anh Việt',25,'male','Hướng dẫn viên'],['Chị Như',22,'female','Hướng dẫn viên'],
 ['Ông Ba',76,'male','Người nghỉ hưu'],['Bà Tám',82,'female','Người nghỉ hưu'],
 ['Bác Cường',67,'male','Tổ trưởng dân phố'],['Bác Huệ',65,'female','Tổ trưởng dân phố'],
 ['Đăng',19,'male','Tình nguyện viên'],['Nhi',18,'female','Tình nguyện viên'],
 ['Chú Tiến',56,'male','Nhân viên vệ sinh'],['Dì Sen',51,'female','Nhân viên vệ sinh'],
 ['Chú Hòa',44,'male','Người chăm sóc gia đình'],['Cô Hằng',47,'female','Người chăm sóc gia đình'],
 ['Chú Bình',53,'male','Tài xế xe ôm'],['Chị Đào',38,'female','Tài xế xe ôm'],
 ['Nam',22,'male','Nhân viên giao hàng'],['Trang',24,'female','Nhân viên giao hàng'],
 ['Chú Khoa',46,'male','Tài xế xe buýt'],['Chị Hiền',40,'female','Tài xế xe buýt'],
 ['Anh Toàn',34,'male','Bưu tá'],['Chị Bích',30,'female','Bưu tá'],
 ['Anh Dũng',37,'male','Nhân viên kho'],['Chị Mến',43,'female','Nhân viên kho'],
 ['Bác Chín',68,'male','Trồng rau'],['Dì Út',59,'female','Trồng rau'],
 ['Bác Tư',71,'male','Trồng lúa'],['Bà Mười',73,'female','Trồng lúa'],
 ['Chú Lâm',49,'male','Bán trái cây'],['Dì Sáu',56,'female','Bán trái cây'],
 ['Anh Tân',33,'male','Bán hoa'],['Chị Hồng',41,'female','Bán hoa'],
 ['Chú Mạnh',62,'male','Ngư dân'],['Dì Biển',54,'female','Ngư dân'],
 ['Chú Nhân',57,'male','Chủ tạp hóa'],['Cô Lan',52,'female','Chủ tạp hóa'],
 ['Anh Lợi',29,'male','Thợ cắt tóc'],['Chị Mai',35,'female','Thợ cắt tóc'],
 ['Anh Hưng',32,'male','Nhân viên khách sạn'],['Chị Hảo',27,'female','Nhân viên khách sạn'],
 ['Bác Vinh',64,'male','Bảo vệ'],['Cô Hòa',58,'female','Bảo vệ'],
 ['Anh Tín',26,'male','Thợ sửa điện thoại'],['Chị Nguyệt',31,'female','Thợ sửa điện thoại'],
]
const colors = ['#397664','#bc573b','#5575a0','#b88134','#82639a','#4c827e','#ab617b','#626e43','#465571','#a67f65']
const skins = ['#f4c9a0','#dca678','#eabc91','#c68e63','#f6d4b1']
export const NPC_CATALOG: NpcProfile[] = rows.map(([name, age, gender, job], i) => ({
 id: `npc-${String(i + 1).padStart(3, '0')}`, name, age, gender, job,
 ...roles[job], color: colors[(i * 3 + Math.floor(i / 10)) % colors.length]!,
 accent: colors[(i * 7 + 4) % colors.length]!, skin: skins[i % skins.length]!,
 hair: age >= 65 ? '#d8d0bd' : age >= 50 ? '#6a6258' : ['#302d2b','#513d31','#382d24'][i % 3]!,
 hairStyle: i % 5, glasses: i % 7 === 0 || age >= 70, variant: i,
}))
export const NPC_GROUP_LABELS: Record<NpcGroup, string> = { school:'Trường học',food:'Ẩm thực',trade:'Thợ nghề',health:'Y tế',office:'Văn phòng',culture:'Văn hóa',community:'Đời sống',transport:'Vận tải',farm:'Nông nghiệp',service:'Dịch vụ' }
export function getNpc(id: string): NpcProfile | undefined { return NPC_CATALOG.find((npc) => npc.id === id) }
export function npcLine(npc: NpcProfile, world: WorldState, business: BusinessState, topic: 'greet' | 'work' = 'greet'): string {
 if (topic === 'work') return roles[npc.job]!.advice
 if (world.weather === 'rain') return `${npc.age < 18 ? 'Em' : 'Tôi'} mang đồ che mưa rồi. Quầy nhớ giữ thức ăn khô ráo nhé!`
 if (npc.age < 18) return 'Chào anh chị! Em đang ghé khu phố trên đường tới lớp.'
 if (world.minuteOfDay >= 19 * 60) return 'Khu phố lên đèn rồi. Hẹn bạn sáng mai nhé!'
 if (business.open) return `Quầy ${business.name} thơm quá! Chúc bạn bán đắt hàng.`
 return `Chào hàng xóm mới! Tôi là ${npc.name}, làm ${npc.job.toLocaleLowerCase('vi')}.`
}
/** Rotating roster varies by day and time without changing economic RNG. */
export function streetNpc(world: WorldState, sequence: number): NpcProfile {
 const hour = world.minuteOfDay / 60
 const pool = hour >= 19 ? NPC_CATALOG.filter((n) => n.age >= 18) : hour < 9 ? NPC_CATALOG : NPC_CATALOG.filter((n) => n.age >= 18 || n.age >= 15)
 return pool[(world.day * 17 + Math.floor(hour) * 7 + sequence * 13) % pool.length]!
}
