# Phase 1: Core Package Extraction - Foundation

**Status**: 🚧 In Progress
**Started**: 2025-01-17
**Timeline**: Week 1 (5-7 days)
**Goal**: Audit codebase, set up package structure, define public API

## Overview

Phase 1 focuses on preparation and foundation work for extracting SonicJS core into an pnpm package. No code migration happens yet - this phase is about understanding what we have and planning the extraction.

## Objectives

1. ✅ Complete codebase audit
2. ✅ Categorize all files as "core" or "user"
3. ✅ Document module dependencies
4. ✅ Identify breaking changes
5. ✅ Set up monorepo structure
6. ✅ Configure build tooling
7. ✅ Define public API surface
8. ✅ Create package.json for @sonicjs-cms/core

## Phase 1 Tasks

### Task 1: Codebase Audit ✅

**Goal**: Understand the current codebase structure and categorize every file.

**Approach**:
```bash
# Analyze directory structure
tree src/ -L 3

# Count files by category
find src/ -type f -name "*.ts" | wc -l

# Identify large files
find src/ -type f -name "*.ts" -exec wc -l {} \; | sort -rn | head -20
```

**Deliverable**: `CODEBASE_AUDIT.md` with categorization of all files.

### Task 2: Module Dependency Analysis ✅

**Goal**: Map out dependencies between modules to avoid circular dependencies.

**Questions to Answer**:
- Which modules depend on each other?
- Are there circular dependencies?
- What's the dependency tree depth?
- Which modules are most coupled?

**Tools**:
- Analyze import statements
- Create dependency graph
- Identify circular dependencies

**Deliverable**: `DEPENDENCY_MAP.md` with visual dependency graphs.

### Task 3: Breaking Changes Identification ✅

**Goal**: Identify potential breaking changes in the extraction.

**Categories**:
1. **Import Path Changes**: `src/services/...` → `@sonicjs-cms/core/services/...`
2. **API Changes**: Functions that need to be exported differently
3. **Type Changes**: TypeScript types that need to be public
4. **Configuration Changes**: How users configure SonicJS
5. **Migration Changes**: How migrations are handled

**Deliverable**: `BREAKING_CHANGES.md` with migration strategies.

### Task 4: Monorepo Setup ✅

**Goal**: Create the package structure for core extraction.

**Structure**:
```
sonicjs/
├── packages/
│   ├── core/                    # @sonicjs-cms/core package
│   │   ├── src/                 # Core source code
│   │   ├── migrations/          # Core migrations
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts       # Build config
│   │   └── README.md
│   └── create-sonicjs/          # pnpm dlx create-sonicjs-app (future)
├── examples/
│   └── basic/                   # Example user project
├── package.json                 # Root workspace config
└── README.md
```

**Steps**:
1. Create `packages/core` directory
2. Set up pnpm workspaces in root package.json
3. Copy package.json to packages/core
4. Configure TypeScript for monorepo

**Deliverable**: Working monorepo structure.

### Task 5: Build Tooling Configuration ✅

**Goal**: Set up tsup for building the core package.

**Requirements**:
- ESM and CJS output formats
- TypeScript definitions (.d.ts)
- Source maps for debugging
- Tree-shaking support
- Small bundle size

**Configuration**:
```typescript
// packages/core/tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,  // Keep readable for debugging
  external: [
    '@cloudflare/workers-types',
    'hono',
    'drizzle-orm',
    'zod'
  ],
  noExternal: [
    // Internal dependencies to bundle
  ]
})
```

**Deliverable**: Working build configuration that produces distributable package.

### Task 6: Public API Definition ✅

**Goal**: Define what gets exported from `@sonicjs-cms/core`.

**Categories of Exports**:

1. **Core Application**
   ```typescript
   export { createSonicJSApp } from './app'
   export type { SonicJSConfig } from './config'
   ```

2. **Services**
   ```typescript
   export { CollectionService } from './services/collection-loader'
   export { MigrationService } from './services/migrations'
   export { PluginService } from './services/plugin-service'
   ```

3. **Middleware**
   ```typescript
   export { requireAuth, optionalAuth } from './middleware/auth'
   export { requireRole } from './middleware/permissions'
   export { bootstrapMiddleware } from './middleware/bootstrap'
   ```

4. **Types**
   ```typescript
   export type { CollectionConfig } from './types/collection-config'
   export type { PluginConfig } from './types/plugin'
   export type { User, Role } from './types/auth'
   ```

5. **Routes (for extending)**
   ```typescript
   export { apiRoutes } from './routes/api'
   export { adminRoutes } from './routes/admin'
   export { authRoutes } from './routes/auth'
   ```

6. **Utilities**
   ```typescript
   export { validators } from './utils/validators'
   export { templateRenderer } from './utils/template-renderer'
   ```

**Deliverable**: `packages/core/src/index.ts` with complete exports.

### Task 7: Package Configuration ✅

**Goal**: Create proper package.json for @sonicjs-cms/core.

**Key Fields**:
```json
{
  "name": "@sonicjs-cms/core",
  "version": "1.0.0-alpha.1",
  "description": "Core framework for SonicJS headless CMS",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./services": {
      "import": "./dist/services/index.js",
      "require": "./dist/services/index.cjs",
      "types": "./dist/services/index.d.ts"
    },
    "./middleware": {
      "import": "./dist/middleware/index.js",
      "require": "./dist/middleware/index.cjs",
      "types": "./dist/middleware/index.d.ts"
    },
    "./routes": {
      "import": "./dist/routes/index.js",
      "require": "./dist/routes/index.cjs",
      "types": "./dist/routes/index.d.ts"
    }
  },
  "files": [
    "dist",
    "migrations",
    "README.md"
  ],
  "peerDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "hono": "^4.0.0",
    "drizzle-orm": "^0.44.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**Deliverable**: Complete package.json ready for publishing.

## File Categorization

### Core Files (Move to @sonicjs-cms/core)

#### Database Layer
- ✅ `src/db/schema.ts`
- ✅ `src/db/index.ts`
- ✅ `migrations/*.sql`

#### Core Services
- ✅ `src/services/collection-loader.ts`
- ✅ `src/services/collection-sync.ts`
- ✅ `src/services/logger.ts`
- ✅ `src/services/migrations.ts`
- ✅ `src/services/plugin-bootstrap.ts`
- ✅ `src/services/plugin-service.ts`
- ✅ `src/services/auth-validation.ts`

#### Middleware
- ✅ `src/middleware/auth.ts`
- ✅ `src/middleware/bootstrap.ts`
- ✅ `src/middleware/logging.ts`
- ✅ `src/middleware/performance.ts`
- ✅ `src/middleware/permissions.ts`

#### Core Routes
- ✅ `src/routes/admin.ts`
- ✅ `src/routes/admin-content.ts`
- ✅ `src/routes/admin-users.ts`
- ✅ `src/routes/admin-media.ts`
- ✅ `src/routes/admin-plugins.ts`
- ✅ `src/routes/admin-logs.ts`
- ✅ `src/routes/admin-settings.ts`
- ✅ `src/routes/api.ts`
- ✅ `src/routes/api-media.ts`
- ✅ `src/routes/api-content-crud.ts`
- ✅ `src/routes/auth.ts`
- ✅ `src/routes/docs.ts`

#### Templates
- ✅ `src/templates/layouts/*.ts`
- ✅ `src/templates/pages/admin-*.ts`
- ✅ `src/templates/components/*.ts`

#### Types
- ✅ `src/types/collection-config.ts`
- ✅ `src/types/index.ts`

#### Utilities
- ✅ `src/utils/string-utils.ts`
- ✅ `src/utils/validators.ts`
- ✅ `src/utils/template-renderer.ts`

#### Core Plugins
- ✅ `src/plugins/core/hook-system.ts`
- ✅ `src/plugins/core/plugin-registry.ts`

#### Media
- ✅ `src/media/images.ts`
- ✅ `src/media/storage.ts`

### User Files (Stay in User Project)

#### Collections
- ❌ `src/collections/**/*.collection.ts`

#### Available Plugins
- ❌ `src/plugins/available/cache-plugin/**`
- ❌ `src/plugins/available/workflow-plugin/**`
- ❌ `src/plugins/available/faq-plugin/**`
- ❌ `src/plugins/available/email-templates-plugin/**`

#### Configuration
- ❌ `wrangler.toml`
- ❌ `.env`
- ❌ `drizzle.config.ts`

#### Project Files
- ❌ `package.json` (user's version)
- ❌ `tsconfig.json` (user's version)
- ❌ `README.md` (user's version)

## Dependency Analysis

### External Dependencies (Peer Dependencies)

Required by user and core:
- `@cloudflare/workers-types`: ^4.0.0
- `hono`: ^4.0.0
- `drizzle-orm`: ^0.44.0
- `zod`: ^3.0.0

### Internal Dependencies

**Tier 1 (No dependencies)**:
- Types (`src/types/`)
- Utilities (`src/utils/`)

**Tier 2 (Depends on Tier 1)**:
- Services (`src/services/`)
- Middleware (`src/middleware/`)

**Tier 3 (Depends on Tier 1 + 2)**:
- Routes (`src/routes/`)
- Templates (`src/templates/`)

**Tier 4 (Depends on all)**:
- Main app (`src/index.ts`)

### Circular Dependencies to Resolve

**Issue 1: Routes ↔ Services**
- Routes import services
- Some services might import route utilities
- **Solution**: Extract shared utilities to separate module

**Issue 2: Middleware ↔ Services**
- Middleware uses services
- Services might use middleware context
- **Solution**: Use dependency injection

**Issue 3: Templates ↔ Routes**
- Routes render templates
- Templates might reference route URLs
- **Solution**: Pass URLs as template data

## Breaking Changes

### Import Path Changes

**Before (Current)**:
```typescript
import { requireAuth } from '../middleware/auth'
import { CollectionService } from '../services/collection-loader'
```

**After (With Package)**:
```typescript
import { requireAuth } from '@sonicjs-cms/core/middleware'
import { CollectionService } from '@sonicjs-cms/core/services'
```

**Migration Strategy**: Provide codemod script to automatically update imports.

### Configuration Changes

**Before (Current)**:
```typescript
// src/index.ts
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
app.use('*', bootstrapMiddleware())
// ... manual setup
```

**After (With Package)**:
```typescript
// src/index.ts
import { createSonicJSApp } from '@sonicjs-cms/core'

const app = createSonicJSApp({
  collections: './src/collections',
  plugins: './src/plugins',
  routes: './src/routes'
})

export default app
```

**Migration Strategy**: Provide migration guide with before/after examples.

### Type Export Changes

**Before (Current)**:
```typescript
// Types are internal
import type { CollectionConfig } from '../types/collection-config'
```

**After (With Package)**:
```typescript
// Types are public API
import type { CollectionConfig } from '@sonicjs-cms/core'
```

**Migration Strategy**: All types exported from main package entry point.

## Success Criteria for Phase 1

- ✅ Complete codebase audit document
- ✅ Dependency map with no circular dependencies identified
- ✅ Monorepo structure created and working
- ✅ Build tooling configured and produces output
- ✅ Public API defined in index.ts
- ✅ Package.json configured correctly
- ✅ Breaking changes documented with migration paths
- ✅ Phase 1 deliverables reviewed and approved

## Risks & Mitigation

### Risk 1: Circular Dependencies
**Likelihood**: High
**Impact**: High (blocks extraction)
**Mitigation**:
- Map all dependencies upfront
- Refactor using dependency injection
- Extract shared utilities

### Risk 2: Large Bundle Size
**Likelihood**: Medium
**Impact**: Medium (affects DX)
**Mitigation**:
- Tree-shaking configuration
- External dependencies properly configured
- Monitor bundle size in CI

### Risk 3: Missing Dependencies
**Likelihood**: Medium
**Impact**: High (runtime errors)
**Mitigation**:
- Thorough testing of extracted package
- Integration tests with example project
- Beta testing period

## Next Steps (Phase 2)

After Phase 1 completion:
1. Start moving core files to packages/core
2. Update import paths
3. Fix circular dependencies
4. Build and test the package
5. Create example user project

## Timeline

**Day 1-2**: Codebase audit and categorization
**Day 3-4**: Dependency analysis and breaking changes
**Day 5**: Monorepo setup and build configuration
**Day 6**: Public API definition
**Day 7**: Documentation and review

**Total**: 7 days

---

**Phase Status**: 🚧 In Progress
**Started**: 2025-01-17
**Expected Completion**: 2025-01-24
**Current Step**: Codebase Audit
