// Stub worker entry that re-exports the SolarSystem class so the
// delete-class migration can run. Remove this file after the migration.
import { createExports as createServerExports } from '@astrojs/cloudflare/entrypoints/server.js'
import type { SSRManifest } from 'astro'
import { SolarSystem } from './durable-objects/solar-system'

export function createExports(manifest: SSRManifest) {
	const base = createServerExports(manifest)
	return {
		default: base.default,
		SolarSystem,
	}
}
