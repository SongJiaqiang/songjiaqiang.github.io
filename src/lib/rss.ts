import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { ui, type Lang } from '../i18n/ui';
import { getPosts, entrySlug } from './content';
import { localizedPath } from '../i18n/utils';

export async function rssFeed(context: APIContext, lang: Lang) {
	const posts = (await getPosts()).filter((post) => (lang === 'en' ? true : post.data.lang === lang));
	const strings = ui[lang];

	return rss({
		title: strings.siteTitle,
		description: strings.siteSubtitle,
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: localizedPath(post.data.lang, `/blog/${entrySlug(post.id)}`),
		})),
	});
}
