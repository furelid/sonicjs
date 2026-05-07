import { PluginBuilder } from 'src/plugins/sdk'
import type { Plugin } from 'src/types'
import manifest from './manifest.json'
import { multisiteAdminRoutes } from './routes/admin'
import * as MultisiteSchema from './schemas/multisite'
import { MultisiteTenantService } from './services/multisite'



const createMultisitePlugin = (): Plugin => {
  const builder = PluginBuilder.create({
    name: manifest.id,
    version: manifest.version,
    description: manifest.description,
  })

  builder.metadata({
    author: { name: manifest.author },
    license: manifest.license,
    compatibility: '^2.0.0',
  })

  // const routes = new Hono()

  // routes.get('/', async (c) => {
  //   const user = c.get('user')
  //   console.log('[MultisiteTenantPlugin] User from context:', user)
  //   return c.html(html`<h1>Hello from Multi-Site Tenant Plugin!</h1>`)
  // })

  // builder.addRoute('/admin/multisite', routes, {
  //   description: 'Multisite Tenant plugin admin page',
  //   requiresAuth: true
  // }) 

  builder.addRoute('/admin/multisite', multisiteAdminRoutes as any, {
    description: 'Multisite Tenant admin routes',
    requiresAuth: true,
    priority: 100
  })

  builder.addAdminPage(
    '/multisite/settings',
    'Multisite Tenant Settings',
    'MultisiteTenantSettings',
    {
      description: 'Configure multisite tenant settings',
      icon: 'chart-bar'
      // permissions: ['admin', 'multisite_tenant.manage']
    }
  )

  builder.addMenuItem('Multisite Tenant', '/admin/multisite', {
    // icon: 'hand-raised',
    icon: 'chart-bar',
    order: 40,
    // permissions: ['admin']
  })

  builder.addMenuItem('Dashboard', '/admin/multisite', {
    icon: 'chart-bar',
    parent: 'Multisite Tenant',
    order: 1,
    permissions: ['admin', 'analytics:read']
  })

  builder.addModel('multisite', {
    tableName: 'plugin_multisites',
    schema: MultisiteSchema.schema,
    migrations: [MultisiteSchema.migration]
  })

  // Register service
  let multisiteTenantService: MultisiteTenantService | null = null

  builder.addService('multisiteTenantService', MultisiteTenantService, {
    description: 'Multisite Tenant service for managing sites and settings',
    singleton: true
  })

  builder.lifecycle({
    install: async (context) => {
      multisiteTenantService = new MultisiteTenantService(context.db)
      await multisiteTenantService.install()
      context.logger.info('Multisite Tenant plugin installed!')
    },
    activate: async (context) => {
      multisiteTenantService = new MultisiteTenantService(context.db)
      await multisiteTenantService.activate()
      context.logger.info('Multisite Tenant plugin activated!')
    },
    deactivate: async (context) => {
      if (multisiteTenantService) {
        await multisiteTenantService.deactivate()
        multisiteTenantService = null
      }
      context.logger.info('Multisite Tenant plugin deactivated!')
    },
    uninstall: async (context) => {
      if (multisiteTenantService) {
        await multisiteTenantService.uninstall()
        multisiteTenantService = null
      }
      context.logger.info('Multisite Tenant plugin uninstalled!')
    },
    configure: async (config: any) => {
      if (multisiteTenantService) {
        await multisiteTenantService.saveSettings(config)
      }
      console.log('Multisite Tenant plugin configuration updated:', config)
    }
  })

  return builder.build() as Plugin as Plugin
}

export default createMultisitePlugin()