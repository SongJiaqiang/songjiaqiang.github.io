import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import {
	fillTemplate,
	groupStoriesByYear,
	type TravelJournalLabels,
	type TravelStory,
} from '../../lib/travelJournal';
import TravelJournalTimeline from './TravelJournalTimeline';
import TravelStoryCard from './TravelStoryCard';

type Props = {
	stories: TravelStory[];
	lang: Lang;
	labels: TravelJournalLabels;
	notice?: string;
};

export default function TravelJournal({ stories, lang, labels, notice }: Props) {
	const groups = useMemo(() => groupStoriesByYear(stories), [stories]);
	const newestYear = groups[0]?.year;
	const initialId = groups[0]?.stories[0]?.id ?? stories[0]?.id;
	const [activeId, setActiveId] = useState<string | undefined>(initialId);
	const galleryRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const clickingRef = useRef(false);
	const clickTimerRef = useRef<number>(0);

	const selectStory = useCallback((id: string, scrollGallery: boolean) => {
		setActiveId(id);
		if (!scrollGallery) return;

		const gallery = galleryRef.current;
		const card = document.getElementById(`story-${id}`);
		if (!gallery || !card) return;

		clickingRef.current = true;
		window.clearTimeout(clickTimerRef.current);
		const offset = card.getBoundingClientRect().top - gallery.getBoundingClientRect().top + gallery.scrollTop;
		gallery.scrollTo({ top: offset, behavior: 'smooth' });
		clickTimerRef.current = window.setTimeout(() => {
			clickingRef.current = false;
		}, 900);
	}, []);

	useEffect(() => {
		return () => window.clearTimeout(clickTimerRef.current);
	}, []);

	useEffect(() => {
		const root = galleryRef.current;
		if (!root) return;

		const ratios = new Map<string, number>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = entry.target.id.replace(/^story-/, '');
					if (entry.isIntersecting) {
						ratios.set(id, entry.intersectionRatio);
					} else {
						ratios.delete(id);
					}
				}
				if (clickingRef.current) return;
				let nextId: string | undefined;
				let best = 0;
				for (const [id, ratio] of ratios) {
					if (ratio > best) {
						best = ratio;
						nextId = id;
					}
				}
				if (nextId) setActiveId(nextId);
			},
			{
				root,
				threshold: [0.25, 0.4, 0.6, 0.8],
				rootMargin: '-8% 0px -45% 0px',
			},
		);

		for (const story of stories) {
			const el = document.getElementById(`story-${story.id}`);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, [stories]);

	useEffect(() => {
		if (!activeId) return;
		const node = document.getElementById(`timeline-node-${activeId}`);
		const scroller = timelineRef.current;
		if (!node || !scroller) return;

		const nodeRect = node.getBoundingClientRect();
		const scrollerRect = scroller.getBoundingClientRect();
		const visible =
			nodeRect.left >= scrollerRect.left + 32 && nodeRect.right <= scrollerRect.right - 32;
		if (!visible) {
			node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
		}
	}, [activeId]);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<header className="shrink-0 py-4">
				<h1 className="text-2xl font-bold tracking-wide uppercase sm:text-3xl">{labels.title}</h1>
				{notice ? <p className="text-muted-foreground mt-2 text-sm">{notice}</p> : null}
			</header>
			<TravelJournalTimeline
				stories={stories}
				lang={lang}
				activeId={activeId}
				timelineLabel={labels.timeline}
				onSelect={(id) => selectStory(id, true)}
				scrollerRef={timelineRef}
			/>
			<div
				ref={galleryRef}
				className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-xl bg-stone-50 px-3 py-4 sm:px-5 dark:bg-background/40"
			>
				{groups.map(({ year, stories: yearStories }) => {
					const heading =
						year === newestYear
							? fillTemplate(labels.yearExplorations, { year })
							: fillTemplate(labels.yearJourneys, { year });
					return (
						<section
							key={year}
							className="mb-10 last:mb-0 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6"
							aria-labelledby={`year-${year}`}
						>
							<h2
								id={`year-${year}`}
								className="sticky top-0 z-10 bg-stone-50/95 py-2 text-xl font-bold tracking-wide uppercase dark:bg-background/95"
							>
								{heading}
							</h2>
							<div className="space-y-5 pb-8">
								{yearStories.map((story) => (
									<TravelStoryCard
										key={story.id}
										story={story}
										lang={lang}
										labels={labels}
										active={story.id === activeId}
									/>
								))}
							</div>
						</section>
					);
				})}
			</div>
		</div>
	);
}
