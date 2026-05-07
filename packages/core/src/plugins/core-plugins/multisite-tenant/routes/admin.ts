import { Hono } from 'hono'
// import type { Context } from 'hono' 
import { requireAuth } from 'src/middleware'
import { renderAdminLayoutCatalyst } from 'src/templates'
import { escapeHtml } from 'src/utils'
import type { Bindings, Variables } from '../../../../app'
import { renderSettingsPage } from '../components/settings-page'
import type { MultisiteSelect } from '../schemas/multisite'
import { MultisiteTenantService } from '../services/multisite'

const adminRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>()

adminRoutes.use('*', requireAuth())

adminRoutes.use('*', async (c, next) => {
  const user = c.get('user')
  if (user?.role !== 'admin') {
    return c.text('Access denied', 403)
  }
  return next()
})

adminRoutes.get('/', async (c) => {
  const user = c.get('user')
  const db = c.env.DB

  const siteTenants = []

  try {

    const sites = await db.prepare(`
      SELECT * FROM plugin_multisites
      `).all<MultisiteSelect>();

    for (const site of sites.results || []) {
      siteTenants.push({
        id: site.id,
        name: site.name,
        domain: site.domain,
        isDefault: Boolean(site.is_default),
        isInitial: Boolean(site.is_initial),
        aliases: JSON.parse(site.aliases || '[]'),
        createdBy: site.created_by,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
        deletedAt: site.deleted_at
      })
    }
  } catch {
    // Tables may not exist yet
  }

  const content = `
      <div class="space-y-8">
        <div>
          <h1 class="text-2xl font-semibold text-zinc-950 dark:text-white">Analytics Dashboard</h1>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last 24 hours overview from system logs</p>
        </div>
   
  
        <!-- Sites -->
        <div class="rounded-lg bg-white dark:bg-zinc-800 ring-1 ring-zinc-950/5 dark:ring-white/10">
          <div class="px-6 py-4 border-b border-zinc-950/5 dark:border-white/10">
            <h2 class="text-lg font-semibold text-zinc-950 dark:text-white">Sites</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th class="px-6 py-2 text-left font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                  <th class="px-6 py-2 text-left font-medium text-zinc-500 dark:text-zinc-400">Domain</th>
                  <th class="px-6 py-2 text-left font-medium text-zinc-500 dark:text-zinc-400">Created</th>
                  <th class="px-6 py-2 text-left font-medium text-zinc-500 dark:text-zinc-400">Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-950/5 dark:divide-white/10">
                ${siteTenants.length > 0 ? siteTenants.map(a => `
                  <tr>
                    <td class="px-6 py-2 font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-xs">${escapeHtml(a.name)}</td>
                    <td class="px-6 py-2"><span class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium">${escapeHtml(a.domain)}</span></td>
                    <td class="px-6 py-2"><span class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium">${escapeHtml(a.createdAt)}</span></td>
                    <td class="px-6 py-2 text-zinc-500 dark:text-zinc-400">${escapeHtml(a.updatedAt)}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">No sites available.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `

  return c.html(renderAdminLayoutCatalyst({
    title: 'Multisite Tenant Admin',
    pageTitle: 'Multisite Tenant Admin',
    currentPath: '/admin/multisite',
    version: c.get('appVersion'),
    user: user ? {
      name: user.email.split('@')[0] || 'Admin',
      email: user.email,
      role: user.role
    } : undefined,
    content,
    dynamicMenuItems: c.get('pluginMenuItems')
  }))
})
/**
 * GET /admin/multisite/settings
 * Display the multisite tenant settings page
 */
adminRoutes.get('/settings', async (c: any) => {
  try {
    // Get DB from context (set by SonicJS middleware)
    const db = c.get('db') || c.env?.DB
    if (!db) {
      return c.html('<h1>Database not available</h1>', 500)
    }

    const service = new MultisiteTenantService(db)
    const { data } = await service.getSettings()

    return c.html(renderSettingsPage(data))
  } catch (error) {
    console.error('Error loading settings page:', error)
    return c.html('<h1>Error loading settings</h1>', 500)
  }
})

/**
 * POST /admin/multisite/settings
 * Save multisite tenant settings
 */
adminRoutes.post('/settings', async (c: any) => {
  try {
    const body = await c.req.json()

    // Get DB from context
    const db = c.get('db') || c.env?.DB
    if (!db) {
      return c.json({ success: false, error: 'Database not available' }, 500)
    }

    const service = new MultisiteTenantService(db)
    await service.saveSettings(body)

    return c.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[MultisiteTenant Admin] Error saving settings:', errorMessage)
    console.error('[MultisiteTenant Admin] Full error:', error)
    return c.json({
      success: false,
      error: `Failed to save settings: ${errorMessage}`
    }, 500)
  }
})

export { adminRoutes as multisiteAdminRoutes }

