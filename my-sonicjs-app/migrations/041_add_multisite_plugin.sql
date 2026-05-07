-- Add Multisite Plugin
-- Migration: 041_add_multisite_tenant_plugin
-- Description: Add multisite plugin for managing multiple sites
INSERT
  OR IGNORE INTO plugins (
    id,
    name,
    display_name,
    description,
    version,
    author,
    category,
    icon,
    status,
    is_core,
    settings,
    permissions,
    dependencies,
    installed_at,
    last_updated
  )
VALUES (
    'multisite-tenant',
    'multisite-tenant',
    'Multisite Tenant',
    'Manage multiple sites within a single SonicJS instance',
    '1.0.0',
    'furpan',
    'demo',
    '👋',
    'inactive',
    FALSE,
    '{}',
    '[]',
    '[]',
    unixepoch(),
    unixepoch()
  );
-- Create plugin_multisites table
CREATE TABLE IF NOT EXISTS plugin_multisites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  is_default INTEGER NOT NULL DEFAULT 0,
  is_initial INTEGER NOT NULL DEFAULT 0,
  aliases TEXT NOT NULL DEFAULT '[]',
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);
-- Create indexes for plugin_multisites table
CREATE INDEX IF NOT EXISTS idx_plugin_multisites_created_by ON plugin_multisites(created_by);
CREATE INDEX IF NOT EXISTS idx_plugin_multisites_created_at ON plugin_multisites(created_at);
CREATE INDEX IF NOT EXISTS idx_plugin_multisites_deleted_at ON plugin_multisites(deleted_at);
CREATE INDEX IF NOT EXISTS idx_plugin_multisites_domain ON plugin_multisites(domain);