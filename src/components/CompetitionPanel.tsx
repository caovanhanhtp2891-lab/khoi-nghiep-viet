import { useState } from 'react'
import { Trophy, TrendingUp } from 'lucide-react'
import { assetBreakdown, DUEL_REWARD, DUEL_XP, leaderboard, operatingProfit, projectedProfit, RIVAL_DEFINITIONS, type RankingMetric } from '../domain/competition'
import { career, tradingHours } from '../domain/careers'
import { formatMoney } from '../domain/format'
import { getNpc } from '../domain/npcCatalog'
import { rivalForCareer } from '../domain/rivalSimulation'
import { snapshotFromStore, useGameStore } from '../store/gameStore'
import { NpcPortrait } from './NpcPortrait'
import { CharacterArt } from './CharacterArt'

const METRICS: Array<[RankingMetric,string]> = [['assets','Tài sản'],['revenue','Doanh thu'],['profit','Lợi nhuận']]
export function CompetitionPanel() {
  const store = useGameStore()
  const [metric,setMetric] = useState<RankingMetric>('assets')
  const rankings = leaderboard(snapshotFromStore(store),metric)
  const me = rankings.find(r=>r.isPlayer)!
  const next = [...rankings].reverse().find(r=>r.value>me.value)
  const rival = rivalForCareer(store.competition,store.business.careerId)
  const duel = store.competition.activeDuel
  const opponent = duel ? store.competition.rivals.find(r=>r.id===duel.rivalId)! : rival
  const eligible = store.world.day>=store.competition.eligibleFromDay
  const already = store.competition.lastDuelDay===store.world.day
  const enoughTime = store.world.minuteOfDay<=career(store.business.careerId).close-120
  const canAccept = store.onboarded && store.business.owned && eligible && !already && enoughTime && !duel
  const assets = assetBreakdown(store.player.money,store.business,store.neighborhood.upgrades)
  return <div className="stack-list competition-panel">
    <article className="competition-hero"><span><Trophy size={22}/> ĐUA TOP BÌNH MINH</span><h3>Hạng {me.rank}<small>/4</small></h3><strong>{formatMoney(me.value)}</strong><p>{metric==='assets'?'Tài sản ước tính hiện tại':metric==='revenue'?'Doanh thu hôm nay':'Lợi nhuận dự kiến sau thuê/lương hôm nay'}</p><div>{next?`Cần thêm ${formatMoney(next.value-me.value)} để bằng ${next.name}.`:'Bạn đang dẫn đầu tiêu chí này.'}</div></article>
    <p className="community-note">Bảng xếp hạng trên máy này với 3 chủ quầy NPC. Cập nhật theo giờ game; pause dừng cả bạn và đối thủ.</p>
    <div className="ranking-metrics" role="group" aria-label="Tiêu chí xếp hạng">{METRICS.map(([id,label])=><button key={id} className={metric===id?'is-active':''} aria-pressed={metric===id} onClick={()=>setMetric(id)}>{label}</button>)}</div>
    <ol className="ranking-list" aria-label="Xếp hạng khu phố">{rankings.map(entry=><li key={entry.id} className={entry.isPlayer?'is-player':''}><b className="ranking-position">{entry.rank===1?'♛':entry.rank}</b>{entry.npcId?<NpcPortrait npcId={entry.npcId}/>:<CharacterArt gender={store.player.gender} className="ranking-player-art"/>}<div className="ranking-identity"><strong>{entry.name} <em>{entry.isPlayer?'Bạn':'NPC'}</em></strong><small>{entry.business.owned?career(entry.business.careerId).label:'Chưa mở quầy'}</small><span>{entry.business.open?'Đang bán':'Đã đóng'} · {entry.customers} sản phẩm hôm nay</span></div><strong className="ranking-value" title={formatMoney(entry.value)}>{formatMoney(entry.value,true)}</strong></li>)}</ol>
    <details className="section-card"><summary>Cách tính tài sản của bạn</summary><div className="report-ledger"><span>Tiền mặt<strong>{formatMoney(assets.cash)}</strong></span><span>Hàng tồn theo giá vốn<strong>{formatMoney(assets.stock)}</strong></span><span>Dụng cụ (50% vốn mua)<strong>{formatMoney(assets.equipment)}</strong></span><span>Nâng cấp (50% giá mua)<strong>{formatMoney(assets.improvements)}</strong></span><span className="total">Tài sản ước tính<strong>{formatMoney(assets.total)}</strong></span></div><p className="community-note">Đây là giá trị để so hạng, không phải khoản tiền được nhận ngay. Doanh thu khác lợi nhuận; lợi nhuận hôm nay đã trừ thuê/lương dự kiến. Đồng điểm cùng hạng.</p></details>
    <section className="section-card duel-card"><div className="section-title-row"><h3><TrendingUp size={17}/> Thi đua hôm nay</h3><span>Ngày {store.world.day}</span></div><div className="duel-opponent"><NpcPortrait npcId={opponent.id}/><div><strong>{getNpc(opponent.id)!.name}</strong><small>{opponent.business.name}</small></div></div>
      <p>Bán ít nhất 10 sản phẩm sau khi nhận, có lãi và lợi nhuận cao hơn đối thủ cùng nghề lúc quyết toán. Thưởng {formatMoney(DUEL_REWARD)} +{DUEL_XP} XP.</p>
      {duel ? <><div className="duel-comparison"><span>Bạn · tạm tính<strong>{formatMoney(projectedProfit(store.dayStats,store.business)-duel.playerStartProfit,true)}</strong></span><span>Đối thủ · tạm tính<strong>{formatMoney(projectedProfit(opponent.dayStats,opponent.business)-duel.rivalStartProfit,true)}</strong></span></div><p className="community-note">Đã bán {store.dayStats.customers-duel.playerStartCustomers}/10 sản phẩm sau nhận. Chi phí trước lúc nhận không tính vào thử thách; thuê/lương cuối ngày vẫn tính. Kết quả chốt khi sang ngày mới. Trong thi đua giữ nguyên nghề.</p></>
        : <><button className="primary-button full-button" disabled={!canAccept} onClick={store.acceptDuel}>{!store.business.owned?'Mở quầy để thi đua':!eligible?`Bắt đầu từ ngày ${store.competition.eligibleFromDay}`:already?'Đã thi đua hôm nay':!enoughTime?'Chờ ca ngày mai':`Nhận thi đua với ${getNpc(rival.id)!.name}`}</button><small>Một thử thách/ngày, nhận trước khi còn dưới 120 phút trong ca. Kết thúc sớm bỏ doanh thu của bạn; đối thủ vẫn bán hết ca.</small></>}
    </section>
    {store.competition.history.length>0 && <section className="section-card duel-history"><h3>Kết quả 30 ngày gần nhất</h3>{[...store.competition.history].reverse().map(result=><article key={result.day}><div><strong>Ngày {result.day} · {result.outcome==='won'?'Thắng thi đua':'Chưa thắng'}</strong><small>vs {getNpc(result.rivalId)!.name} · {result.customers} sản phẩm sau nhận</small><span>Bạn {formatMoney(result.playerProfit,true)} · Đối thủ {formatMoney(result.rivalProfit,true)}</span></div>{result.outcome==='won'?<button className="secondary-button" disabled={result.claimed} onClick={()=>store.claimDuelReward(result.day)}>{result.claimed?'Đã nhận':'Nhận 50k ₫'}</button>:<small>Cần ít nhất 10 sản phẩm, lãi dương và hơn đối thủ.</small>}</article>)}</section>}
    <section className="rival-details"><h3>Ba chủ quầy cạnh tranh</h3>{store.competition.rivals.map(r=>{const definition=RIVAL_DEFINITIONS.find(d=>d.id===r.id)!,config=career(r.business.careerId);return <details className="section-card" key={r.id}><summary>{getNpc(r.id)!.name} · {config.label}</summary><p>{definition.style}</p><div className="report-ledger"><span>Ca bán<strong>{tradingHours(config.id)}</strong></span><span>Giá<strong>{formatMoney(r.business.price)}/{config.unit}</strong></span><span>Kho<strong>{r.business.inventory}/{r.business.maxInventory} {config.unit}</strong></span><span>Tiền mặt<strong>{formatMoney(r.cash)}</strong></span><span>Doanh thu hôm nay<strong>{formatMoney(r.dayStats.revenue)}</strong></span><span>Thu nhập trước phí cố định<strong>{formatMoney(operatingProfit(r.dayStats))}</strong></span><span>Nhân viên<strong>{r.business.hasEmployee?'Có · 120.000đ/ngày':'Chưa tuyển'}</strong></span></div><p className="community-note">Tự nhập hàng, marketing, tuyển người và nâng cấp khi đủ vốn; chi phí được ghi vào sổ. Cùng nghề đang bán và còn hàng làm nhu cầu của bạn giảm 12%; đối thủ cũng chịu mức giảm này khi bạn đang bán và còn hàng.</p></details>})}</section>
    {store.competition.news.length>0 && <section className="section-card competition-news"><h3>Tin cạnh tranh mới</h3>{[...store.competition.news].reverse().slice(0,6).map(news=><article key={news.id}><small>Ngày {news.day} · {String(Math.floor(news.minute/60)).padStart(2,'0')}:{String(news.minute%60).padStart(2,'0')} · {getNpc(news.npcId)!.name}</small><p>{news.text}</p></article>)}</section>}
  </div>
}
