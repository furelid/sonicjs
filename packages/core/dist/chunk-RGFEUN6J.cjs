'use strict';

// src/utils/metrics.ts
var MetricsTracker = class {
  windowSize = 1e4;
  // 10 seconds window
  bucketSize = 100;
  // 100ms buckets for smoother short-window metrics
  totalBuckets = this.windowSize / this.bucketSize;
  oneSecondBuckets = 1e3 / this.bucketSize;
  buckets = Array.from({ length: this.totalBuckets }, () => ({
    slot: Number.NEGATIVE_INFINITY,
    count: 0
  }));
  /**
   * Record a new request in O(1)
   */
  recordRequest() {
    const slot = this.getCurrentSlot();
    const bucket = this.buckets[this.getBucketIndex(slot)];
    if (bucket.slot !== slot) {
      bucket.slot = slot;
      bucket.count = 0;
    }
    bucket.count++;
  }
  /**
   * Get current requests per second
   */
  getRequestsPerSecond() {
    return this.sumBuckets(this.oneSecondBuckets);
  }
  /**
   * Get total requests in the current 10-second window
   */
  getTotalRequests() {
    return this.sumBuckets(this.totalBuckets);
  }
  /**
   * Get average requests per second over the 10-second window
   */
  getAverageRPS() {
    const totalRequests = this.getTotalRequests();
    if (totalRequests === 0) {
      return 0;
    }
    const windowSeconds = this.windowSize / 1e3;
    return totalRequests / windowSeconds;
  }
  /**
   * Reset metrics state (used by tests)
   */
  reset() {
    for (const bucket of this.buckets) {
      bucket.slot = Number.NEGATIVE_INFINITY;
      bucket.count = 0;
    }
  }
  getCurrentSlot() {
    return Math.floor(Date.now() / this.bucketSize);
  }
  getBucketIndex(slot) {
    return slot % this.totalBuckets;
  }
  sumBuckets(windowBuckets) {
    const currentSlot = this.getCurrentSlot();
    const minSlot = currentSlot - windowBuckets + 1;
    let total = 0;
    for (const bucket of this.buckets) {
      if (bucket.slot >= minSlot && bucket.slot <= currentSlot) {
        total += bucket.count;
      }
    }
    return total;
  }
};
var metricsTracker = new MetricsTracker();

exports.metricsTracker = metricsTracker;
//# sourceMappingURL=chunk-RGFEUN6J.cjs.map
//# sourceMappingURL=chunk-RGFEUN6J.cjs.map