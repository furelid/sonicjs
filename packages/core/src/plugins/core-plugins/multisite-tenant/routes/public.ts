import { Hono } from 'hono'
import { html } from 'hono/html'
// import type { Context } from 'hono'
import { MultisiteTenantService } from '../services/multisite'

const publicRoutes = new Hono()

/**
 * GET /contact
 * Display the public contact form
 */
publicRoutes.get('/contact', async (c: any) => {
  try {
    // Get DB from context
    const db = c.get('db') || c.env?.DB
    if (!db) {
      return c.html('<h1>Service temporarily unavailable</h1>', 503)
    }

    const service = new MultisiteTenantService(db)
    const { data: settings } = await service.getSettings()

    // For testing: Allow form to work even if not activated
    // TODO: Remove this after proper plugin activation
    // if (status !== 'active') {
    //   return c.text('Contact form is currently disabled.', 503)
    // } 

    const useAliases = settings.useAliases === 1 || settings.useAliases === true || settings.useAliases === 'true' || settings.useAliases === 'on'

    console.log('[ Multisite Tenant Public] settings.useAliases:', settings.useAliases, 'type:', typeof settings.useAliases)

    return c.html(html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${useAliases ? 'Alias Enabled' : 'Alias Disabled'}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <a href="/" class="btn btn-link mt-3">← Back Home</a>
          </div>
        </div> 
      </body>
    </html>
  `)
  } catch (error) {
    console.error('Error rendering contact page:', error)
    return c.html('<h1>Error loading contact form</h1>', 500)
  }
})

export default publicRoutes
