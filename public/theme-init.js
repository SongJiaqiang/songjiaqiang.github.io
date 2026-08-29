(function () {
	const stored = localStorage.getItem('theme') || localStorage.getItem('starlight-theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
	const root = document.documentElement;
	root.setAttribute('data-theme', theme);
	root.classList.toggle('dark', theme === 'dark');
	window.__theme = { value: theme };
	try {
		localStorage.setItem('starlight-theme', theme);
	} catch {
		/* ignore quota / private mode */
	}
})();
