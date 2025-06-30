import { auth } from './firebase'

interface UserUsage {
  userId: string
  date: string
  requests: number
}

const DAILY_LIMIT = 10
const STORAGE_KEY = 'lynx_user_usage'

export class RateLimiter {
  private static getUserUsageKey(userId: string): string {
    const today = new Date().toISOString().split('T')[0]
    return `${STORAGE_KEY}_${userId}_${today}`
  }

  static getCurrentUsage(userId: string): number {
    if (typeof window === 'undefined') return 0
    
    const key = this.getUserUsageKey(userId)
    const stored = localStorage.getItem(key)
    
    if (!stored) return 0
    
    try {
      const usage: UserUsage = JSON.parse(stored)
      return usage.requests || 0
    } catch {
      return 0
    }
  }

  static canMakeRequest(userId: string): boolean {
    const currentUsage = this.getCurrentUsage(userId)
    return currentUsage < DAILY_LIMIT
  }

  static getRemainingRequests(userId: string): number {
    const currentUsage = this.getCurrentUsage(userId)
    return Math.max(0, DAILY_LIMIT - currentUsage)
  }

  static incrementUsage(userId: string): boolean {
    if (!this.canMakeRequest(userId)) {
      return false
    }

    if (typeof window === 'undefined') return false

    const key = this.getUserUsageKey(userId)
    const today = new Date().toISOString().split('T')[0]
    const currentUsage = this.getCurrentUsage(userId)

    const newUsage: UserUsage = {
      userId,
      date: today,
      requests: currentUsage + 1
    }

    localStorage.setItem(key, JSON.stringify(newUsage))
    return true
  }

  static getResetTime(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  static getDailyLimit(): number {
    return DAILY_LIMIT
  }
}