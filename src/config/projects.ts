type Registry = 'npm' | 'clojars'

type Project = {
	title: string
	description: string
	shortDescription: string
	href: string
	tags: string[]
	registry: Registry
	packageName: string
	logo: string
}

export const projects: Project[] = [
	{
		title: 'react-socket',
		description:
			'A batteries included React library for real time WebSocket communication. Type safe hooks, automatic reconnection, optimistic updates, and offline message queuing out of the box.',
		shortDescription:
			'Type safe WebSocket hooks with reconnection, optimistic updates, and offline queuing.',
		href: '/projects/react-socket',
		tags: ['React Hooks', 'TypeScript', 'WebSocket', 'Real Time'],
		registry: 'npm',
		packageName: '@luciodale/react-socket',
		logo: '/react-socket-logo.svg',
	},
	{
		title: 'react-searchable-dropdown',
		description:
			'A high performance, virtualized dropdown component supporting single and multi selection, async search, custom rendering, and new option creation with zero dependencies.',
		shortDescription:
			'Virtualized single and multi select with async search and custom rendering.',
		href: '/projects/react-searchable-dropdown',
		tags: ['React Component', 'TypeScript', 'Fuzzy Search', 'Accessibility'],
		registry: 'npm',
		packageName: '@luciodale/react-searchable-dropdown',
		logo: '/react-searchable-dropdown-logo.svg',
	},
	{
		title: 'swipe-bar',
		description:
			'A gesture driven sidebar that brings native app fluidity to the web. Smooth spring physics, touch and mouse support, and a tiny footprint for mobile first interfaces.',
		shortDescription:
			'Gesture driven sidebars with spring physics for mobile first interfaces.',
		href: '/projects/swipe-bar',
		tags: ['React Component', 'Touch Gestures', 'Mobile UI', 'Zero Dependencies'],
		registry: 'npm',
		packageName: '@luciodale/swipe-bar',
		logo: '/swipe-bar-logo.svg',
	},
	{
		title: 'fork',
		description:
			'A headless form management library for Re-frame and Reagent. Handles validation, submission, dirty tracking, and field state with a declarative API.',
		shortDescription:
			'Headless form management for Re-frame and Reagent with declarative validation.',
		href: '/projects/fork',
		tags: ['ClojureScript', 'Re-frame', 'Forms', 'Validation'],
		registry: 'clojars',
		packageName: 'fork',
		logo: '/fork-logo.svg',
	},
]

async function fetchNpmVersion(packageName: string): Promise<string | null> {
	const encoded = packageName.replace('/', '%2F')
	const res = await fetch(
		`https://registry.npmjs.org/${encoded}/latest`
	)
	if (!res.ok) return null
	const data = (await res.json()) as { version: string }
	return data.version
}

async function fetchClojarsVersion(
	packageName: string
): Promise<string | null> {
	const res = await fetch(
		`https://clojars.org/api/artifacts/${packageName}`
	)
	if (!res.ok) return null
	const data = (await res.json()) as { latest_version: string }
	return data.latest_version
}

export async function fetchVersion(
	registry: Registry,
	packageName: string
): Promise<string> {
	const version =
		registry === 'npm'
			? await fetchNpmVersion(packageName)
			: await fetchClojarsVersion(packageName)
	return version ?? 'unknown'
}

export type ProjectWithStatus = Project & { status: string }

export async function getProjectsWithVersions(): Promise<
	ProjectWithStatus[]
> {
	const results = await Promise.all(
		projects.map(async (project) => {
			const version = await fetchVersion(
				project.registry,
				project.packageName
			)
			return {
				...project,
				status: `${project.registry} v${version}`,
			}
		})
	)
	return results
}
