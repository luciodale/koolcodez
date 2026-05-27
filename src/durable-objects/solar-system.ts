// Stub kept only so the delete-class migration can run.
// Remove this file after the migration completes.
export class SolarSystem {
	constructor(_state: DurableObjectState, _env: unknown) {}

	async fetch(): Promise<Response> {
		return new Response('gone', { status: 410 })
	}
}
