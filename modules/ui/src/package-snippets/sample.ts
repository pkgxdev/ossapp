import type { Snippet } from "../types";

export const snippets: Snippet[] = [
	{
		snippet_id: "a1",
		created_at: new Date(),
		user: "xxxavier",
		avatar_url: "/images/bored-ape.png",
		stars: 123,
		files: [
			{
				name: "sample.js",
				language: "javscript",
				data: `import name from './name';
console.log('hello world');`
			},
			{
				name: "name.js",
				language: "javscript",
				data: `export const name = 'onamaiwa';`
			}
		],
		forks: [],
		comments: [
			{
				user: "denise",
				comment: "noice!"
			}
		]
	},
	{
		snippet_id: "a2",
		created_at: new Date(),
		user: "aaaron",
		avatar_url: "/images/bored-ape.png",
		stars: 3,
		files: [
			{
				name: "example.py",
				language: "python",
				data: `import name from './name';
console.log('hello world');`
			}
		],
		forks: [],
		comments: [
			{
				user: "denise",
				comment: "noice!"
			},
			{
				user: "denice",
				comment: "doesnt work!"
			}
		]
	}
];
