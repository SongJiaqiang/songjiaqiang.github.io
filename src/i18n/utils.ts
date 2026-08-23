import { defaultLang, languages, ui, type Lang, type UiKey } from './ui';

export function isLang(value: string | undefined): value is Lang {
	return value !== undefined && value in languages;
}

export function langFromPath(pathname: string): Lang {
	return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : defaultLang;
}

export function stripLang(pathname: string): string {
	const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
	return stripped === '' ? '/' : stripped;
}

export function localizedPath(lang: Lang, path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	if (lang === 'en') {
		return normalized === '/' ? '/en/' : `/en${normalized}`;
	}
	return normalized;
}

export function switchLocalePath(pathname: string, target: Lang): string {
	return localizedPath(target, stripLang(pathname));
}

export function useTranslations(lang: Lang) {
	return function t(key: UiKey): string {
		return ui[lang][key] || ui[defaultLang][key];
	};
}
