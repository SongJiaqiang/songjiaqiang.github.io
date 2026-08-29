const THEME_KEY = 'theme';
const LIGHT = 'light';
const DARK = 'dark';

function getPreferredTheme(): string {
	const stored = localStorage.getItem(THEME_KEY) || localStorage.getItem('starlight-theme');
	if (stored === LIGHT || stored === DARK) return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

let themeValue: string =
	(window as unknown as { __theme?: { value: string } }).__theme?.value ?? getPreferredTheme();

function persist(): void {
	localStorage.setItem(THEME_KEY, themeValue);
	localStorage.setItem('starlight-theme', themeValue);
	reflect();
}

function reflect(): void {
	const root = document.documentElement;
	root.setAttribute('data-theme', themeValue);
	root.classList.toggle('dark', themeValue === DARK);
	document.querySelector('#theme-btn')?.setAttribute('aria-label', themeValue);

	const bg = window.getComputedStyle(document.body).backgroundColor;
	document.querySelector("meta[name='theme-color']")?.setAttribute('content', bg);
}

function setup(): void {
	reflect();
	document.querySelector('#theme-btn')?.addEventListener('click', () => {
		themeValue = themeValue === LIGHT ? DARK : LIGHT;
		persist();
	});
}

setup();
document.addEventListener('astro:after-swap', setup);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
	if (localStorage.getItem(THEME_KEY)) return;
	themeValue = matches ? DARK : LIGHT;
	persist();
});
