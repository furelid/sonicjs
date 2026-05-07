import { describe, it, expect, beforeEach } from 'vitest' 
import multisitePlugin from '../index' 
import { PluginManager } from '@sonicjs-cms/core/plugins'

describe('Plugin Integration', () => {
  let manager: PluginManager

  beforeEach(() => {
    manager = new PluginManager()
  })

  it('should install plugin', async () => {
    await manager.install(multisitePlugin, {
      enabled: true,
      apiKey: 'test-key'
    })

    const status = manager.getStatus('multisite')
    expect(status.installed).toBe(true)
  })

  it('should activate plugin', async () => {
    await manager.install(multisitePlugin, { enabled: true })

    const status = manager.getStatus('multisite')
    expect(status.active).toBe(true)
  })

  // it('should handle configuration', async () => {
  //   await manager.install(multisitePlugin)

  //   const newConfig = {
  //     enabled: true,
  //     apiKey: 'updated-key'
  //   }

  //   await multisitePlugin.configure?.(newConfig)

  //   // Verify configuration was applied
  //   expect(manager.registry.getConfig('multisite')).toMatchObject(newConfig)
  // })
})