import type { CareerId } from './careers'
import type { DayStats, DayReport, GameSnapshot } from './types'
export function freshDayStats(cashOpening: number | null, careerId: CareerId): DayStats {
 return { revenue:0,cogs:0,expenses:0,customers:0,lostCustomers:0,cashOpening,stockPurchases:0,capitalPurchases:0,recoveries:0,communityRewards:0,careerIds:[careerId] }
}
export function closeDayReport(snapshot: GameSnapshot, rent: number, payroll: number): DayReport {
 const stats=snapshot.dayStats
 return {...stats,day:snapshot.world.day,weather:snapshot.world.weather,rent,payroll,profit:stats.revenue-stats.cogs-stats.expenses-rent-payroll,cashClosing:snapshot.player.money-rent-payroll}
}
/** All cash movements; cost of stock is prepaid, COGS applies only when sold. */
export function expectedClosingCash(report: DayReport): number | null {
 if (report.cashOpening===null) return null
 return report.cashOpening+report.revenue+report.recoveries+report.communityRewards-report.stockPurchases-report.capitalPurchases-report.expenses-report.rent-report.payroll
}
