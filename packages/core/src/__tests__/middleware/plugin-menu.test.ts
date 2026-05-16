import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../plugins/manifest-registry', () => ({
  PLUGIN_REGISTRY: {
    analytics: {
      id: 'analytics',
      codeName: 'analytics',
      displayName: 'Analytics',
      description: 'Analytics plugin',
      version: '1.0.0',
      author: 'SonicJS',
      category: 'core',
      iconEmoji: '📊',
      permissions: [],
      dependencies: [],
      is_core: true,
      defaultSettings: {},
      adminMenu: {
        label: 'Analytics',
        path: '/admin/analytics',
        icon: '',
        order: 10,
      },
    },
  },
}))

import { invalidatePluginMenuCache, pluginMenuMiddleware } from '../../middleware/plugin-menu'

function createMockDb(activeNames: string[] = ['analytics']) {
  const all = vi.fn().mockResolvedValue({
    results: activeNames.map(name => ({ name })),
  })
  const bind = vi.fn().mockReturnValue({ all })
  const prepare = vi.fn().mockReturnValue({ bind })
  return { prepare, bind, all }
}

function createMockContext(pathname: string, db: { prepare: ReturnType<typeof vi.fn> }) {
  const req = { url: `https://example.com${pathname}` }
  const set = vi.fn()
  const res = new Response('<html><body><!-- DYNAMIC_PLUGIN_MENU --></body></html>', {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
  return {
    req,
    env: { DB: db },
    set,
    res,
  } as any
}

describe('pluginMenuMiddleware', () => {
  beforeEach(() => {
    invalidatePluginMenuCache()
    vi.clearAllMocks()
  })

  it('skips plugin DB lookup for /admin/api routes', async () => {
    const db = createMockDb()
    const c = createMockContext('/admin/api/plugins', db as any)
    const next = vi.fn().mockResolvedValue(undefined)

    await pluginMenuMiddleware()(c, next)

    expect(next).toHaveBeenCalledOnce()
    expect(db.prepare).not.toHaveBeenCalled()
    expect(c.set).not.toHaveBeenCalled()
  })

  it('skips plugin DB lookup for exact /admin/api path', async () => {
    const db = createMockDb()
    const c = createMockContext('/admin/api', db as any)
    const next = vi.fn().mockResolvedValue(undefined)

    await pluginMenuMiddleware()(c, next)

    expect(next).toHaveBeenCalledOnce()
    expect(db.prepare).not.toHaveBeenCalled()
    expect(c.set).not.toHaveBeenCalled()
  })

  it('uses cached menu items between admin requests', async () => {
    const db = createMockDb()
    const middleware = pluginMenuMiddleware()

    const firstContext = createMockContext('/admin/dashboard', db as any)
    await middleware(firstContext, vi.fn().mockResolvedValue(undefined))

    const secondContext = createMockContext('/admin/settings', db as any)
    await middleware(secondContext, vi.fn().mockResolvedValue(undefined))

    expect(db.prepare).toHaveBeenCalledTimes(1)
    expect(firstContext.set).toHaveBeenCalledWith('pluginMenuItems', [
      { label: 'Analytics', path: '/admin/analytics', icon: '' },
    ])
    expect(secondContext.set).toHaveBeenCalledWith('pluginMenuItems', [
      { label: 'Analytics', path: '/admin/analytics', icon: '' },
    ])
  })

  it('re-queries plugin status after cache invalidation', async () => {
    const db = createMockDb()
    const middleware = pluginMenuMiddleware()

    await middleware(createMockContext('/admin/dashboard', db as any), vi.fn().mockResolvedValue(undefined))
    expect(db.prepare).toHaveBeenCalledTimes(1)

    invalidatePluginMenuCache()

    await middleware(createMockContext('/admin/content', db as any), vi.fn().mockResolvedValue(undefined))
    expect(db.prepare).toHaveBeenCalledTimes(2)
  })
})
