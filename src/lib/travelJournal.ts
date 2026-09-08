import type { Lang } from '../i18n/ui';

export type TravelStory = {
	id: string;
	title: string;
	location: string;
	date: string;
	endDate?: string;
	durationDays?: number;
	notes: string;
	cover: string;
	href: string;
	photoCount: number;
	videoCount: number;
};

export type TravelJournalLabels = {
	title: string;
	yearExplorations: string;
	yearJourneys: string;
	tripNotes: string;
	durationDays: string;
	photos: string;
	videos: string;
	map: string;
	timeline: string;
};

export type TravelStoryYearGroup = {
	year: number;
	stories: TravelStory[];
};

export function fillTemplate(template: string, vars: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}

export function parseDateOnly(value: string): Date {
	const [year, month, day] = value.slice(0, 10).split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function localeFor(lang: Lang): string {
	return lang === 'en' ? 'en-US' : 'zh-CN';
}

export function formatStoryDate(iso: string, lang: Lang): string {
	return parseDateOnly(iso).toLocaleDateString(localeFor(lang), {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function formatStoryDateRange(story: TravelStory, lang: Lang): string {
	if (!story.endDate) return formatStoryDate(story.date, lang);
	const start = parseDateOnly(story.date);
	const end = parseDateOnly(story.endDate);
	const sameYear = start.getFullYear() === end.getFullYear();
	const startLabel = start.toLocaleDateString(localeFor(lang), {
		month: 'short',
		day: 'numeric',
		year: sameYear ? undefined : 'numeric',
	});
	const endLabel = formatStoryDate(story.endDate, lang);
	return `${startLabel} – ${endLabel}`;
}

export function formatMonthTick(year: number, month: number, lang: Lang, showYear: boolean): string {
	const date = new Date(year, month, 1);
	const monthLabel = date
		.toLocaleDateString(localeFor(lang), { month: 'short' })
		.replace('.', '')
		.toUpperCase();
	return showYear ? `${monthLabel} ${year}` : monthLabel;
}

export function groupStoriesByYear(stories: TravelStory[]): TravelStoryYearGroup[] {
	const years = new Map<number, TravelStory[]>();
	for (const story of stories) {
		const year = parseDateOnly(story.date).getFullYear();
		const list = years.get(year) ?? [];
		list.push(story);
		years.set(year, list);
	}

	return [...years.entries()]
		.sort((a, b) => b[0] - a[0])
		.map(([year, yearStories]) => ({
			year,
			stories: yearStories.sort(
				(a, b) => parseDateOnly(a.date).valueOf() - parseDateOnly(b.date).valueOf(),
			),
		}));
}

export type TimelineMonth = {
	year: number;
	month: number;
};

export type TimelineScale = {
	months: TimelineMonth[];
	width: number;
};

const MONTH_WIDTH = 168;
const PAD_MONTHS = 1;

export function buildTimelineScale(stories: TravelStory[]): TimelineScale {
	if (stories.length === 0) {
		return { months: [], width: MONTH_WIDTH };
	}

	const dates = stories.map((story) => parseDateOnly(story.date));
	const min = dates.reduce((earliest, date) => (date < earliest ? date : earliest));
	const max = dates.reduce((latest, date) => (date > latest ? date : latest));

	const cursor = new Date(min.getFullYear(), min.getMonth() - PAD_MONTHS, 1);
	const last = new Date(max.getFullYear(), max.getMonth() + PAD_MONTHS, 1);
	const months: TimelineMonth[] = [];

	while (cursor <= last) {
		months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
		cursor.setMonth(cursor.getMonth() + 1);
	}

	return { months, width: Math.max(months.length * MONTH_WIDTH, MONTH_WIDTH) };
}

export function timelinePosition(dateValue: string, scale: TimelineScale): number {
	if (scale.months.length === 0) return 0;
	const date = parseDateOnly(dateValue);
	const first = scale.months[0];
	const monthIndex =
		(date.getFullYear() - first.year) * 12 + (date.getMonth() - first.month);
	const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const fraction = (date.getDate() - 1) / daysInMonth;
	const clamped = Math.min(Math.max(monthIndex + fraction, 0), scale.months.length);
	return (clamped / scale.months.length) * 100;
}

export function inclusiveDurationDays(start: Date, end: Date): number {
	const ms = end.valueOf() - start.valueOf();
	return Math.max(1, Math.round(ms / 86_400_000) + 1);
}
