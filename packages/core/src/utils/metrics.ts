/**
 * In-memory metrics tracker optimized for constant-time request recording.
 * Uses fixed time buckets instead of storing every request timestamp.
 */

interface TimeBucket {
  slot: number
  count: number
}

class MetricsTracker {
  private readonly windowSize = 10000 // 10 seconds window
  private readonly bucketSize = 100 // 100ms buckets for smoother short-window metrics
  private readonly totalBuckets = this.windowSize / this.bucketSize
  private readonly oneSecondBuckets = 1000 / this.bucketSize
  private readonly buckets: TimeBucket[] = Array.from({ length: this.totalBuckets }, () => ({
    slot: Number.NEGATIVE_INFINITY,
    count: 0
  }))

  /**
   * Record a new request in O(1)
   */
  recordRequest(): void {
    const slot = this.getCurrentSlot()
    const bucket = this.buckets[this.getBucketIndex(slot)]!

    if (bucket.slot !== slot) {
      bucket.slot = slot
      bucket.count = 0
    }

    bucket.count++
  }

  /**
   * Get current requests per second
   */
  getRequestsPerSecond(): number {
    return this.sumBuckets(this.oneSecondBuckets)
  }

  /**
   * Get total requests in the current 10-second window
   */
  getTotalRequests(): number {
    return this.sumBuckets(this.totalBuckets)
  }

  /**
   * Get average requests per second over the 10-second window
   */
  getAverageRPS(): number {
    const totalRequests = this.getTotalRequests()
    if (totalRequests === 0) {
      return 0
    }

    const windowSeconds = this.windowSize / 1000
    return totalRequests / windowSeconds
  }

  /**
   * Reset metrics state (used by tests)
   */
  reset(): void {
    for (const bucket of this.buckets) {
      bucket.slot = Number.NEGATIVE_INFINITY
      bucket.count = 0
    }
  }

  private getCurrentSlot(): number {
    return Math.floor(Date.now() / this.bucketSize)
  }

  private getBucketIndex(slot: number): number {
    return slot % this.totalBuckets
  }

  private sumBuckets(windowBuckets: number): number {
    const currentSlot = this.getCurrentSlot()
    const minSlot = currentSlot - windowBuckets + 1
    let total = 0

    for (const bucket of this.buckets) {
      if (bucket.slot >= minSlot && bucket.slot <= currentSlot) {
        total += bucket.count
      }
    }

    return total
  }
}

// Global singleton instance
export const metricsTracker = new MetricsTracker()
