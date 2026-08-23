// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://songjiaqiang.com',
	integrations: [
		starlight({
			title: {
				'zh-CN': '文档',
				en: 'Docs',
			},
			logo: {
				src: './src/assets/mark.svg',
				replacesTitle: false,
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/SongJiaqiang',
				},
			],
			defaultLocale: 'root',
			locales: {
				root: { label: '简体中文', lang: 'zh-CN' },
				en: { label: 'English' },
			},
			sidebar: [
				{
					label: 'Evo',
					items: [{ autogenerate: { directory: 'docs/evo' } }],
				},
			],
			customCss: ['./src/styles/global.css'],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: '',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@500;600;700&display=swap',
					},
				},
			],
			components: {
				Header: './src/components/starlight/Header.astro',
			},
		}),
		sitemap(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	redirects: {
		'/2020/02/01/001-hello-world': '/blog',
		'/2020/02/01/002-first-post': '/blog/002-first-post',
		'/2020/02/02/003-new-keyboard-varmilo': '/blog/003-new-keyboard-varmilo',
		'/2020/02/02/004-how-to-use-gitalk': '/blog/004-how-to-use-gitalk',
		'/2020/02/03/005-learning-flutter-1-install': '/blog/005-learning-flutter-1-install',
		'/2020/02/04/006-learning-flutter-2-first-app': '/blog/006-learning-flutter-2-first-app',
		'/2020/02/05/007-learning-flutter-3-base-widget': '/blog/007-learning-flutter-3-base-widget',
		'/2020/04/08/flutter-project-evo-01': '/blog/flutter-project-evo-01',
		'/evoradio': '/apps/evo',
	},
});
