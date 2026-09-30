import type { NpcProfile, TalkTopic } from './npcCatalog'
import type { BusinessState, WorldState } from './types'

type Theme = 'business' | 'neighborhood' | 'rain' | 'hot' | 'night' | 'school' | 'health'
interface Scene { id:string; theme:Theme; question:string; reply:string }
// Fifty curated exchanges. Each has ten opening and ten responding phrasings.
const rows: Array<[Theme,string,string]> = [
 ['business','Làm sao biết quầy hôm nay có lãi?','Hãy trừ giá vốn hàng đã bán, chi phí, tiền thuê và lương khỏi doanh thu.'],
 ['business','Có nên dùng hết tiền để mua dụng cụ mới?','Giữ một khoản dự phòng cho nguyên liệu và chi phí cuối ngày trước đã.'],
 ['business','Tôi nhập nhiều nguyên liệu mà tiền mặt giảm, có phải bị lỗ?','Tiền nhập hàng và giá vốn hàng đã bán là hai khoản khác nhau; hãy xem báo cáo dòng tiền.'],
 ['business','Lúc nào nên nhập thêm hàng cho quầy?','Theo dõi tồn kho trước giờ cao điểm, đừng chờ tới khi hết hàng mới chuẩn bị.'],
 ['business','Khách xếp hàng lâu thì nên làm gì?','Chuẩn bị trước nguyên liệu và xem công suất; tuyển người cũng có lương hằng ngày.'],
 ['business','Tăng giá một chút có bán tốt hơn không?','Giá cao hơn tăng tiền mỗi món nhưng có thể giảm nhu cầu; thử và so lợi nhuận.'],
 ['business','Quầy vắng khách có nên giảm giá thật mạnh?','Đừng giảm dưới giá vốn; quan sát giờ bán và thời tiết trước khi đổi giá.'],
 ['business','Tờ rơi có làm quán đông ngay không?','Nhận diện tăng dần nhưng không thay cho chất lượng và phục vụ đúng giờ.'],
 ['business','Hôm nay đổi nghề thì các dụng cụ cũ ra sao?','Đọc bảng thu hồi và vốn cần thêm trước khi xác nhận đổi nghề nhé.'],
 ['business','Nên xem thứ hạng theo tiền bán hay lợi nhuận?','Doanh thu cho biết quy mô bán, lợi nhuận cho biết phần còn lại sau chi phí.'],
 ['business','Vì sao có lãi mà tiền mặt vẫn ít?','Tiền có thể đang nằm trong nguyên liệu và dụng cụ; đối chiếu từng dòng tiền.'],
 ['business','Mái che có đáng đầu tư cho ngày mưa?','So chi phí lắp với nhu cầu ngày mưa và khoản dự phòng của quầy.'],
 ['business','Nhận nhiều đơn cùng lúc có tốt không?','Chuẩn bị đủ hàng và giao đúng hẹn; quầy hiện chỉ nhận một đơn đang làm.'],
 ['business','Muốn vượt chủ quầy cùng nghề thì bắt đầu từ đâu?','Bán trong cả ca, giữ đủ hàng và theo dõi chi phí trước khi nhận thi đua.'],
 ['business','Tôi vừa có khách quay lại, nên làm gì tiếp?','Giữ chất lượng ổn định và nhớ lời góp ý của khách quen.'],
 ['business','Tủ lớn hơn có làm hàng tự đầy lên không?','Tủ chỉ tăng chỗ chứa; nguyên liệu vẫn cần mua bằng tiền của quầy.'],
 ['business','Thi đua hôm nay cần những điều kiện nào?','Nhận thử thách đúng giờ, bán ít nhất mười sản phẩm rồi so lãi lúc quyết toán.'],
 ['business','Có nên bỏ phần còn lại của ca khi đang thi đua?','Kết thúc sớm bỏ doanh thu còn lại của bạn, còn đối thủ vẫn bán hết ca.'],
 ['business','Khách mới chưa biết tên quầy thì sao?','Biển hiệu rõ ràng và một lời chào ngắn giúp họ nhớ quầy.'],
 ['business','Sau một ngày bán kém nên thay đổi gì?','Đọc báo cáo, chọn một điều chỉnh nhỏ rồi theo dõi ngày kế tiếp.'],
 ['neighborhood','Cuối tuần khu phố có hoạt động gì?','Mọi người đang rủ nhau dọn đầu ngõ và chăm các chậu cây.'],
 ['neighborhood','Để xe trước quầy thế nào cho gọn?','Chừa lối đi cho người đi bộ và nhắc khách đỗ đúng chỗ.'],
 ['neighborhood','Tôi mới tới khu này, nên làm quen ai trước?','Chào người ở gần, hỏi tên và lắng nghe câu chuyện của họ trước nhé.'],
 ['neighborhood','Có cách nào giảm rác sau ca bán không?','Tách bao bì với thức ăn thừa, buộc túi gọn và giữ sạch quanh quầy.'],
 ['neighborhood','Chậu cây đầu ngõ hơi héo, ai chăm nhỉ?','Mọi người có thể chia nhau tưới vào lúc mát, tránh tưới giữa trưa nóng.'],
 ['neighborhood','Người lớn tuổi đi ngang cần giúp gì?','Chừa lối thoáng, nói rõ ràng và hỏi trước khi giúp họ.'],
 ['neighborhood','Tôi muốn giới thiệu quầy cho hàng xóm thì sao?','Kể món bạn bán và giờ mở cửa, rồi mời họ ghé khi tiện.'],
 ['neighborhood','Tờ thực đơn vừa bay khỏi quầy rồi!','Mình nhặt ở chỗ an toàn và kẹp lại cho chắc nhé.'],
 ['neighborhood','Ai đang tìm chiếc túi vải ở ghế đá?','Hỏi người trông coi gần đó; đừng tự mở đồ của người khác.'],
 ['neighborhood','Phố đông xe hơn mọi hôm nhỉ?','Xe buýt và xe giao hàng cùng tới, mình đứng gọn trên vỉa hè nhé.'],
 ['rain','Mưa tới rồi, quầy cần chuẩn bị gì?','Che nguyên liệu và giữ lối khách đứng chờ khô ráo trước nhé.'],
 ['rain','Khách cầm áo mưa ướt vào quầy thì sao?','Gợi ý họ gấp gọn, để nước không rơi vào chỗ đồ ăn.'],
 ['rain','Đường trơn quá, mọi người đi cẩn thận nhé?','Đúng rồi, đi chậm và tránh những chỗ đọng nước trước cửa quầy.'],
 ['rain','Nguyên liệu có cần chuyển chỗ khi mưa lớn?','Đặt vào chỗ có mái che và đậy kín, không để gần nước bắn.'],
 ['rain','Mưa tạnh rồi nhưng khách vẫn ít nhỉ?','Đợi nhịp phố trở lại, kiểm tra hàng và giữ quầy sạch trong lúc chờ.'],
 ['hot','Trời nóng thế này mọi người thích gì?','Đồ uống mát được hỏi nhiều hơn; vẫn giữ nguyên liệu và dụng cụ sạch nhé.'],
 ['hot','Đứng bán giữa trưa có mệt không?','Nghỉ ngắn khi vắng khách, uống nước và tìm bóng râm phù hợp.'],
 ['hot','Đá và ly đã chuẩn bị đủ chưa?','Kiểm tra trước cao điểm chiều, đừng để khách chờ tới lượt mới chuẩn bị.'],
 ['hot','Có nên đổi bảng giá vì nắng nóng?','Quan sát nhu cầu và giá vốn trước, đừng chỉ nhìn thấy đông khách.'],
 ['hot','Khách muốn đợi dưới bóng cây được không?','Nếu chỗ đó an toàn và không chắn lối đi thì mình chỉ họ nhé.'],
 ['night','Phố lên đèn rồi, giờ này còn khách không?','Có người tan ca và đi dạo; mỗi nghề vẫn có giờ đóng cửa riêng.'],
 ['night','Gần hết ca nên xem việc gì trước?','Kiểm tra hàng còn lại, đơn đang nhận và các khoản phải quyết toán.'],
 ['night','Mai mở cửa có cần chuẩn bị từ tối nay?','Ghi lại hàng cần mua và giờ cao điểm, sáng mai sẽ đỡ vội.'],
 ['night','Đèn quầy hơi tối, khách có đọc được giá không?','Giữ bảng giá rõ và chỗ đứng sáng để mọi người dễ chọn.'],
 ['night','Hôm nay mọi người vất vả rồi nhỉ?','Chúc cả phố nghỉ ngơi tốt, mai mình lại gặp nhau ở đầu ngõ.'],
 ['school','Sắp vào lớp mà hàng còn đông quá?','Chuẩn bị món dễ mang và báo rõ thời gian chờ để các bạn lựa chọn.'],
 ['school','Các em muốn phần nhỏ hơn thì sao?','Lắng nghe nhu cầu, nhưng thay đổi sản phẩm cần tính lại nguyên liệu và giá.'],
 ['school','Sinh viên thường hỏi gì khi mua đồ ăn?','Họ thích biết giá rõ, món đủ chất và phục vụ nhanh trước giờ học.'],
 ['health','Làm sao giữ góc bán hàng sạch?','Rửa dụng cụ, che nguyên liệu và giữ khu vực đồ ăn tách khỏi rác.'],
 ['health','Làm việc lâu nên nhớ điều gì?','Ăn uống đều, uống nước và nghỉ ngắn khi có thể; đừng bỏ qua sức khỏe.'],
]
export const DIALOGUE_SCENES: Scene[] = rows.map(([theme,question,reply],i)=>({id:`scene-${String(i+1).padStart(2,'0')}`,theme,question,reply}))
const openings = ['', 'Cho tôi hỏi chút: ', 'Mình đang băn khoăn: ', 'Bạn nghĩ sao về chuyện này: ', 'Có ai biết không: ', 'Tôi muốn nghe ý kiến: ', 'Nhân lúc nghỉ, mình hỏi nhé: ', 'Cùng bàn một chuyện nhé: ', 'Hàng xóm ơi, ', 'Tôi gặp chuyện này hôm nay: ']
const endings = ['', ' Mình cùng thử nhé.', ' Có gì khó cứ hỏi thêm.', ' Làm từng bước sẽ dễ hơn.', ' Tôi cũng đang tập thói quen đó.', ' Cảm ơn bạn đã hỏi.', ' Mình nhắc nhau cùng làm nhé.', ' Đừng vội, xem kỹ trước đã.', ' Hôm sau kể tôi kết quả nhé.', ' Chúc bạn một ngày thuận lợi.']
export const DIALOGUE_BANK = DIALOGUE_SCENES.flatMap(scene=>[
 ...openings.map((prefix,i)=>({id:`${scene.id}-q${i}`,sceneId:scene.id,side:'question' as const,text:`${prefix}${scene.question}`})),
 ...endings.map((suffix,i)=>({id:`${scene.id}-r${i}`,sceneId:scene.id,side:'reply' as const,text:`${scene.reply}${suffix}`})),
])
export const DIALOGUE_COUNT = DIALOGUE_BANK.length

export function chatTheme(input:string): 'business'|'neighborhood'|'rain'|'hot'|'night'|'school'|'health'|'greet' {
 const t=input.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('đ','d')
 if (/mưa/i.test(input) || /ao mua|troi mua|duong tron/.test(t)) return 'rain'
 if (/nong|khat|nuoc mat/.test(t)) return 'hot'
 if (/buoi toi|ban dem|len den|den duong|het ca/.test(t)) return 'night'
 if (/truong|hoc|lop|sinh vien/.test(t)) return 'school'
 if (/suc khoe|ve sinh|sach|nghi ngoi/.test(t)) return 'health'
 if (/gia|lai|loi nhuan|tien|von|hang|ban|quay|nghe|thi dua/.test(t)) return 'business'
 if (/pho|xe|dan quan|cong an|hang xom|cay|rac/.test(t)) return 'neighborhood'
 return 'greet'
}
function scenesFor(npc: NpcProfile,world:WorldState,topic:string): Scene[] {
 const theme=topic==='greet' ? world.weather==='rain'?'rain':world.weather==='hot'?'hot':world.minuteOfDay>=1140?'night':npc.group==='school'?'school':npc.group==='health'?'health':'neighborhood' : topic
 return DIALOGUE_SCENES.filter(s=>s.theme===theme)
}
export function chatSceneIds(input:string):string[]|undefined {
 const t=input.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('đ','d')
 const numbers=/loi nhuan|co lai|tinh lai|gia von|so sach/.test(t)?[1,10,11]:/gia|giam gia|tang gia/.test(t)?[6,7]:/nhap|nguyen lieu|ton kho|mua hang/.test(t)?[3,4,16]:/nhan vien|tuyen|luong|cong suat/.test(t)?[5]:/thi dua|doi thu/.test(t)?[14,17,18]:/von|du phong|dung cu/.test(t)?[2,9]:/to roi|bien hieu|marketing/.test(t)?[8,19]:/don dat|giao don/.test(t)?[13]:undefined
 return numbers?.map(n=>`scene-${String(n).padStart(2,'0')}`)
}
export function dialogueExchange(npc:NpcProfile,world:WorldState,sequence:number,topic='greet',sceneIds?:string[]) {
 const scenes=sceneIds ? DIALOGUE_SCENES.filter(s=>sceneIds.includes(s.id)) : scenesFor(npc,world,topic)
 const index=Math.abs(world.day*11+Math.floor(world.minuteOfDay/60)*7+npc.variant+sequence)
 const scene=scenes[index%scenes.length]!
 const variation=Math.floor(index/scenes.length)%10
 return {sceneId:scene.id,question:`${openings[variation]}${scene.question}`,reply:`${scene.reply}${endings[variation]}`}
}
export function residentDialogue(npc:NpcProfile,world:WorldState,_business:BusinessState,sequence:number,topic:TalkTopic):string {
 return dialogueExchange(npc,world,sequence,topic).reply
}
