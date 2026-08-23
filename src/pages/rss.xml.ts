import type { APIContext } from 'astro';
import { rssFeed } from '../lib/rss';

export function GET(context: APIContext) {
	return rssFeed(context, 'zh-cn');
}
