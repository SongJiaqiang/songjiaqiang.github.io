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

export type TravelYearGroup = {
	year: number;
	posts: CollectionEntry<'travel'>[];
};

export function groupTravelByYear(posts: CollectionEntry<'travel'>[]): TravelYearGroup[] {
	const years = new Map<number, CollectionEntry<'travel'>[]>();
	for (const post of posts) {
		const year = post.data.date.getFullYear();
		const list = years.get(year) ?? [];
		list.push(post);
		years.set(year, list);
	}

	return [...years.entries()]
		.sort((a, b) => b[0] - a[0])
		.map(([year, yearPosts]) => ({
			year,
			posts: yearPosts.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf()),
		}));
}

export const TRAVEL_MONTH_GROUP_THRESHOLD = 4;

export type TravelTimelineItem =
	| { type: 'post'; post: CollectionEntry<'travel'> }
	| { type: 'month'; year: number; month: number; posts: CollectionEntry<'travel'>[] };

export function travelTimelineItems(posts: CollectionEntry<'travel'>[]): TravelTimelineItem[] {
	const byMonth = new Map<string, CollectionEntry<'travel'>[]>();
	for (const post of posts) {
		const key = `${post.data.date.getFullYear()}-${post.data.date.getMonth()}`;
		const list = byMonth.get(key) ?? [];
		list.push(post);
		byMonth.set(key, list);
	}

	const items: TravelTimelineItem[] = [];
	for (const monthPosts of byMonth.values()) {
		if (monthPosts.length >= TRAVEL_MONTH_GROUP_THRESHOLD) {
			const first = monthPosts[0].data.date;
			items.push({
				type: 'month',
				year: first.getFullYear(),
				month: first.getMonth(),
				posts: monthPosts,
			});
		} else {
			for (const post of monthPosts) {
				items.push({ type: 'post', post });
			}
		}
	}
	return items;
}

export function formatMonth(date: Date, lang: Lang): string {
	return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', {
		month: 'short',
	});
}

export function formatDay(date: Date, lang: Lang): string {
	return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', {
		month: 'short',
		day: 'numeric',
	});
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
