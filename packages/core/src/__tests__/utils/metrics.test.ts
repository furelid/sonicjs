import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { metricsTracker } from '../../utils/metrics'

describe('MetricsTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    metricsTracker.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should record requests and track total', () => {
    metricsTracker.recordRequest()
    metricsTracker.recordRequest()
    metricsTracker.recordRequest()

    expect(metricsTracker.getTotalRequests()).toBe(3)
  })

  it('should calculate requests per second', () => {
    metricsTracker.recordRequest()
    metricsTracker.recordRequest()

    const rps = metricsTracker.getRequestsPerSecond()
    expect(rps).toBe(2)
  })

  it('should calculate average RPS over time window', () => {
    metricsTracker.recordRequest()
    metricsTracker.recordRequest()
    metricsTracker.recordRequest()

    const avgRPS = metricsTracker.getAverageRPS()
    expect(avgRPS).toBe(0.3)
  })

  it('should return 0 RPS when no recent requests', () => {
    expect(metricsTracker.getRequestsPerSecond()).toBe(0)
  })

  it('should return 0 average RPS when no requests in window', () => {
    expect(metricsTracker.getAverageRPS()).toBe(0)
  })

  it('should handle high request volumes', () => {
    for (let i = 0; i < 100; i++) {
      metricsTracker.recordRequest()
    }

    expect(metricsTracker.getTotalRequests()).toBe(100)
    expect(metricsTracker.getRequestsPerSecond()).toBe(100)
  })

  it('should automatically cleanup old requests outside 10-second window', () => {
    metricsTracker.recordRequest()
    expect(metricsTracker.getTotalRequests()).toBe(1)

    vi.advanceTimersByTime(11000)
    expect(metricsTracker.getTotalRequests()).toBe(0)
  })

  it('should calculate RPS only for last second', () => {
    metricsTracker.recordRequest()
    metricsTracker.recordRequest()
    expect(metricsTracker.getRequestsPerSecond()).toBe(2)
    vi.advanceTimersByTime(2000)
    metricsTracker.recordRequest()
    expect(metricsTracker.getRequestsPerSecond()).toBe(1)
  })

  it('should keep 10-second totals while dropping older buckets', () => {
    metricsTracker.recordRequest()
    vi.advanceTimersByTime(9500)
    metricsTracker.recordRequest()

    expect(metricsTracker.getTotalRequests()).toBe(2)

    vi.advanceTimersByTime(600)
    expect(metricsTracker.getTotalRequests()).toBe(1)
  })
})
