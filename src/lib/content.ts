import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { localizedPath } from '../i18n/utils';
import { inclusiveDurationDays, type TravelStory } from './travelJournal';

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

export async function getTravelPosts(lang?: Lang) {
	const posts = await getCollection('travel', ({ data }) => !data.draft);
	const filtered = lang ? posts.filter((post) => post.data.lang === lang) : posts;
	return filtered.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function travelPath(post: CollectionEntry<'travel'>, uiLang: Lang): string {
	const slug = entrySlug(post.id);
	if (post.data.lang === 'en') {
		return localizedPath('en', `/travel/${slug}`);
	}
	return localizedPath(uiLang, `/travel/${slug}`);
}

export function dateOnly(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function toTravelStory(post: CollectionEntry<'travel'>, uiLang: Lang): TravelStory {
	const start = post.data.date;
	const end = post.data.endDate;
	return {
		id: entrySlug(post.id),
		title: post.data.title,
		location: post.data.location,
		date: dateOnly(start),
		endDate: end ? dateOnly(end) : undefined,
		durationDays: end ? inclusiveDurationDays(start, end) : undefined,
		notes: post.data.description,
		cover: post.data.cover,
		href: travelPath(post, uiLang),
		photoCount: post.data.photos.length,
		videoCount: post.data.videos.length,
	};
}

export function youtubeId(url: string): string | undefined {
	const match = url.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
	);
	return match?.[1];
}

export function bilibiliId(url: string): string | undefined {
	const match = url.match(/bilibili\.com\/video\/(BV[\w]+)/i);
	return match?.[1];
}

export function isDirectVideo(url: string): boolean {
	return /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(url);
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
