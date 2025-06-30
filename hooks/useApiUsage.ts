"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { RateLimiter } from '@/lib/rate-limit'
import type { UsageInfo } from '@/types/api'

export function useApiUsage() {
  const { user } = useAuth()
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUsage = () => {
    if (!user?.uid) {
      setUsage(null)
      setLoading(false)
      return
    }

    const current = RateLimiter.getCurrentUsage(user.uid)
    const limit = RateLimiter.getDailyLimit()
    const remaining = RateLimiter.getRemainingRequests(user.uid)
    const resetTime = RateLimiter.getResetTime()

    setUsage({
      current,
      limit,
      remaining,
      resetTime
    })
    setLoading(false)
  }

  useEffect(() => {
    updateUsage()
  }, [user?.uid])

  const canMakeRequest = (): boolean => {
    if (!user?.uid) return false
    return RateLimiter.canMakeRequest(user.uid)
  }

  const incrementUsage = (): boolean => {
    if (!user?.uid) return false
    const success = RateLimiter.incrementUsage(user.uid)
    if (success) {
      updateUsage()
    }
    return success
  }

  return {
    usage,
    loading,
    canMakeRequest,
    incrementUsage,
    updateUsage
  }
}