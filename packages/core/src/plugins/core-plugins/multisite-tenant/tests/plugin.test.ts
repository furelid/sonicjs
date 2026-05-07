// tests/plugin.test.ts
import { describe, it, expect } from 'vitest'
import plugin from '../index.js'

describe('Multisite Plugin', () => {
  it('should have correct metadata', () => {
    expect(plugin.name).toBe('multisite')
    expect(plugin.version).toBe('1.0.0')
  })

  it('should register routes', () => {
    expect(plugin.routes).toBeDefined()
    expect(plugin.routes?.length).toBeGreaterThan(0)
  })

  it('should have lifecycle hooks', () => {
    expect(plugin.activate).toBeDefined()
    expect(plugin.deactivate).toBeDefined()
  })
})