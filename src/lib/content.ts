import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { localizedPath } from '../i18n/utils';

export function entrySlug(id: string): string {
	return id.replace(/^(zh-cn|en)\//, '');
}

export function entryLang(id: string): Lang {
	return id.startsWith('en/') ? 'en' : 'zh-cn';
}

export async function getPosts(lang?: Lang) {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	const filtered = lang ? posts.filter((post) => post.data.lang === lang) : posts;
	return filtered.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getApps(lang: Lang) {
	const apps = await getCollection('apps');
	return apps
		.filter((app) => app.data.lang === lang)
		.sort((a, b) => a.data.order - b.data.order);
}

export function postPath(post: CollectionEntry<'blog'>, uiLang: Lang): string {
	const slug = entrySlug(post.id);
	if (post.data.lang === 'en') {
		return localizedPath('en', `/blog/${slug}`);
	}
	if (uiLang === 'en') {
		return `/blog/${slug}`;
	}
	return `/blog/${slug}`;
}

export function appPath(app: CollectionEntry<'apps'>): string {
	const slug = entrySlug(app.id);
	return localizedPath(app.data.lang, `/apps/${slug}`);
}

export function docsPath(docsSlug: string, lang: Lang): string {
	return localizedPath(lang, docsSlug.startsWith('/') ? docsSlug : `/${docsSlug}`);
}

export function formatDate(date: Date, lang: Lang): string {
	return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}
