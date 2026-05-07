import manifest from '../manifest.json';
// import type { MultisiteItem, MultisiteAlias } from '../types'
import type { D1Database } from '@cloudflare/workers-types';
import type { MultisiteSettings } from '../types';
// import type { ContactSettings } from '@/plugins/contact-form/types';

export class MultisiteTenantService {
  constructor(private db: D1Database) { }
  /**
    * Get plugin settings from the database
    */
  async getSettings(): Promise<{ status: string; data: MultisiteSettings }> {
    try {
      const record = await this.db
        .prepare(`SELECT settings, status FROM plugins WHERE id = ?`)
        .bind(manifest.id)
        .first()

      if (!record) {
        return {
          status: 'inactive',
          data: this.getDefaultSettings()
        }
      }

      return {
        status: (record?.status as string) || 'inactive',
        data: record?.settings ? JSON.parse(record.settings as string) : this.getDefaultSettings()
      }
    } catch (error) {
      console.error('Error getting contact form settings:', error)
      return {
        status: 'inactive',
        data: this.getDefaultSettings()
      }
    }
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): MultisiteSettings {
    return {
      useAliases: false
    }
  }

  /**
   * Save plugin settings to the database
   */
  async saveSettings(settings: MultisiteSettings): Promise<void> {
    try {
      console.log('[MultisiteTenantService.saveSettings] Starting save for plugin:', manifest.id)
      console.log('[MultisiteTenantService.saveSettings] Settings:', JSON.stringify(settings))

      // Check if plugin row exists
      const existing = await this.db
        .prepare(`SELECT id, status FROM plugins WHERE id = ?`)
        .bind(manifest.id)
        .first()

      console.log('[MultisiteTenantService.saveSettings] Existing row:', JSON.stringify(existing))

      if (existing) {
        // Update existing row
        console.log('[MultisiteTenantService.saveSettings] Updating existing row...')
        const result = await this.db
          .prepare(`UPDATE plugins SET settings = ?, last_updated = ? WHERE id = ?`)
          .bind(JSON.stringify(settings), Date.now(), manifest.id)
          .run()
        console.log('[MultisiteTenantService.saveSettings] UPDATE result:', JSON.stringify(result))
        console.log('[MultisiteTenantService.saveSettings] Successfully updated')
      } else {
        // Insert new row
        console.log('[MultisiteTenantService.saveSettings] No existing row, inserting new...')
        const result = await this.db
          .prepare(`
            INSERT INTO plugins (id, name, display_name, description, version, author, category, status, settings, installed_at, last_updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive', ?, ?, ?)
          `)
          .bind(
            manifest.id,
            manifest.name,
            manifest.name, // Use name for display_name since displayName doesn't exist in manifest
            manifest.description || '',
            manifest.version || '1.0.0',
            manifest.author || 'Unknown',
            manifest.category || 'other',
            JSON.stringify(settings),
            Date.now(),
            Date.now()
          )
          .run()
        console.log('[MultisiteTenantService.saveSettings] INSERT result:', JSON.stringify(result))
        console.log('[MultisiteTenantService.saveSettings] Successfully inserted')
      }
      console.log('[MultisiteTenantService.saveSettings] Settings saved successfully')
    } catch (error) {
      console.error('[MultisiteTenantService.saveSettings] ERROR:', error)
      console.error('[MultisiteTenantService.saveSettings] Error message:', error instanceof Error ? error.message : String(error))
      console.error('[MultisiteTenantService.saveSettings] Error stack:', error instanceof Error ? error.stack : 'No stack')
      throw new Error(`Failed to save multisite tenant settings: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  // Lifecycle methods
  /**
   * Install the plugin (create database entry)
   */
  async install(): Promise<void> {
    try {
      const timeStamp = Date.now()
      await this.db
        .prepare(`
          INSERT INTO plugins (
            id, name, display_name, description, version, author,
            is_core, category, status, dependencies, settings,
            installed_at, last_updated
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'inactive', ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET 
            display_name = excluded.display_name,
            description = excluded.description,
            version = excluded.version,
            updated_at = excluded.last_updated
        `)
        .bind(
          manifest.id,
          manifest.id,
          manifest.name,
          manifest.description,
          manifest.version,
          manifest.author,
          manifest.is_core ? 1 : 0,
          manifest.category,
          JSON.stringify(manifest.dependencies || []),
          JSON.stringify(manifest.defaultSettings || {}),
          timeStamp,
          timeStamp
        )
        .run()
      console.log('Multisite Tenant plugin installed successfully')
    } catch (error) {
      console.error('Error installing Multisite Tenant plugin:', error)
      throw new Error('Failed to install Multisite Tenant plugin')
    }
  }

  /**
   * Activate the plugin
   */
  async activate(): Promise<void> {
    try {
      await this.db
        .prepare(`
          UPDATE plugins 
          SET status = 'active', last_updated = ? 
          WHERE id = ?
        `)
        .bind(Date.now(), manifest.id)
        .run()
      console.log('Multisite Tenant plugin activated')
    } catch (error) {
      console.error('Error activating Multisite Tenant plugin:', error)
      throw new Error('Failed to activate Multisite Tenant plugin')
    }
  }

  /**
   * Deactivate the plugin
   */
  async deactivate(): Promise<void> {
    try {
      await this.db
        .prepare(`
          UPDATE plugins 
          SET status = 'inactive', last_updated = ? 
          WHERE id = ?
        `)
        .bind(Date.now(), manifest.id)
        .run()
      console.log('Multisite Tenant plugin deactivated')
    } catch (error) {
      console.error('Error deactivating Multisite Tenant plugin:', error)
      throw new Error('Failed to deactivate Multisite Tenant plugin')
    }
  }

  /**
   * Uninstall the plugin (remove database entry)
   */
  async uninstall(): Promise<void> {
    try {
      await this.db
        .prepare(`DELETE FROM plugins WHERE id = ?`)
        .bind(manifest.id)
        .run()
      console.log('Multisite Tenant plugin uninstalled')
    } catch (error) {
      console.error('Error uninstalling Multisite Tenant plugin:', error)
      throw new Error('Failed to uninstall Multisite Tenant plugin')
    }
  }
}