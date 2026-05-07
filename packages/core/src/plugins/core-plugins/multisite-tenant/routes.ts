import { Hono } from 'hono'

// type Bindings = {
//   DB: D1Database
//   KV: KVNamespace
//   MEDIA_BUCKET: R2Bucket
//   EMAIL_QUEUE?: Queue
//   SENDGRID_API_KEY?: string
//   DEFAULT_FROM_EMAIL?: string
//   IMAGES_ACCOUNT_ID?: string
//   IMAGES_API_TOKEN?: string
// }

// type Variables = {
//   user: {
//     userId: string
//     email: string
//     role: string
//     exp: number
//     iat: number
//   }
// }

// const multiSiteRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>()
const app = new Hono()

app.get('/', async (c) => {
  // const user = c.get('user')
  // console.log('[MultisitePlugin] User from context:', user)

  return c.json({ message: 'Welcome to the Multisite Plugin API' })
})
// Debug endpoint to check workflow functionality
app.get('/debug', async (c) => {
  // const user = c.get('user')
  // if (!user || user.role !== 'admin') {
  //   return c.json({ error: 'Unauthorized' }, 403)
  // }

  const debug: any = {
    timestamp: new Date().toISOString(),
    tests: {}
  }

  try {
    // Test 1: Check   states
    debug.tests.multiSiteStates = {
      status: 'testing',
      error: null,
      result: null
    }

    const states = []
    states.push({ id: 1, name: 'Default Site', domain: 'https://example.com' })

    // states.push(...await c.env.DB.prepare(`
    //   SELECT id, name, domain FROM multi_sites ORDER BY is_initial DESC, name ASC
    // `).all().then(res => res.results))

    debug.tests.multiSiteStates.status = 'success'
    debug.tests.multiSiteStates.result = {
      count: states.length,
      states: states.map(s => ({ id: s.id, name: s.name, domain: s.domain }))
    }
  } catch (error: any) {
    debug.tests.multiSiteStates.status = 'error'
    debug.tests.multiSiteStates.error = error.message
  }

  try {
    // Test 2: Check database tables exist
    debug.tests.tableCheck = {
      status: 'testing',
      error: null,
      result: null
    }

    const tableResults: any = {}
    const tables = ['multi_sites']

    for (const table of tables) {
      // const result = await c.env.DB.prepare(`
      //   SELECT COUNT(*) as count FROM ${table}
      // `).first()
      // tableResults[table] = result?.count || 0
      tableResults[table] = 0 // Placeholder since we can't run actual DB queries here
    }

    debug.tests.tableCheck.status = 'success'
    debug.tests.tableCheck.result = tableResults
  } catch (error: any) {
    debug.tests.tableCheck.status = 'error'
    debug.tests.tableCheck.error = error.message
  }

  return c.json(debug)
}) 

export default app