import { businessForCareer } from '../domain/careers'
import { createCompetition } from '../domain/competition'
import { freshDayStats } from '../domain/accounting'
import { initialNeighborhood } from '../domain/neighborhood'
import type { GameSnapshot } from '../domain/types'

export function createInitialSnapshot(): GameSnapshot {
  return {
    version: 6,
    onboarded: false,
    tutorialStep: 0,
    player: {
      name: 'Nhà khởi nghiệp',
      avatarStyle: 'green',
      gender: 'male',
      position: { x: 0.58, y: 0.72 },
      age: 18,
      money: 1_000_000,
      xp: 0,
      level: 1,
      businessSkill: 8,
      reputation: 50,
    },
    world: {
      day: 1,
      minuteOfDay: 5 * 60 + 30,
      weather: 'sunny',
      speed: 1,
      paused: false,
      rngSeed: 24_051_998,
    },
    business: businessForCareer('xoi'),
    dayStats: freshDayStats(1_000_000, 'xoi'),
    reports: [],
    competition: createCompetition({ day: 1, minuteOfDay: 330 }),
    lifetime: {
      revenue: 0,
      profit: 0,
      customers: 0,
      daysCompleted: 0,
    },
    story: {
      activeSituation: null,
      history: [],
      lastSituationAt: -90,
      resolvedToday: 0,
    },
    neighborhood: initialNeighborhood(),
    chat: [],
    chatSeq: 0,
    noticeSeq: 1,
    notices: [
      {
        id: 1,
        message: 'Chào mừng bạn đến với khu phố khởi nghiệp!',
        tone: 'info',
      },
    ],
  }
}
