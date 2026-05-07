
import { PluginHelpers } from 'src/plugins/sdk'
import { z } from 'zod'

export const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    domain: z.url({ message: 'Must be a valid URL' }),
    isDefault: z.boolean().default(false),
    isInitial: z.boolean().default(false),
    aliases: z.array(z.url({ message: 'Must be a valid URL' })).default([])
})

export const migration = PluginHelpers.createMigration('plugin_multisites', [
    { name: 'id', type: 'TEXT', primaryKey: true },
    { name: 'name', type: 'TEXT', nullable: false },
    { name: 'domain', type: 'TEXT', nullable: false, unique: true },
    { name: 'is_default', type: 'INTEGER', nullable: false, defaultValue: '0' },
    { name: 'is_initial', type: 'INTEGER', nullable: false, defaultValue: '0' },
    { name: 'aliases', type: 'TEXT', nullable: false, defaultValue: '[]' }
])

const dbSchema = z.object({
    id: z.string(),
    name: z.string(),
    domain: z.string(),
    is_default: z.boolean(),
    is_initial: z.boolean(),
    aliases: z.string(),
    created_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable()
})

export type Multisite = z.infer<typeof schema>
export type MultisiteDB = z.infer<typeof dbSchema>
export type MultisiteSelect = MultisiteDB
export type MultisiteInsert = Omit<MultisiteDB, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'deleted_at'>
export type MultisiteUpdate = Partial<MultisiteInsert>
