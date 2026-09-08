import { useState, type RefObject } from 'react';
import type { Lang } from '../../i18n/ui';
import {
	buildTimelineScale,
	formatMonthTick,
	formatStoryDate,
	timelinePosition,
	type TravelStory,
} from '../../lib/travelJournal';

type Props = {
	stories: TravelStory[];
	lang: Lang;
	activeId: string | undefined;
	timelineLabel: string;
	onSelect: (id: string) => void;
	scrollerRef: RefObject<HTMLDivElement | null>;
};

function MapPin({ active }: { active: boolean }) {
	return (
		<span
			className={`relative flex items-center justify-center rounded-full transition-transform ${
				active
					? 'size-9 scale-110 bg-sky-100 ring-2 ring-sky-500 dark:bg-sky-950 dark:ring-sky-400'
					: 'size-6'
			}`}
			aria-hidden="true"
		>
			<svg
				className={active ? 'size-5 text-red-600' : 'size-4 text-amber-800 dark:text-amber-300'}
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
				<circle cx="12" cy="10" r="2.6" fill="white" />
			</svg>
		</span>
	);
}

export default function TravelJournalTimeline({
	stories,
	lang,
	activeId,
	timelineLabel,
	onSelect,
	scrollerRef,
}: Props) {
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const scale = buildTimelineScale(stories);

	return (
		<div
			ref={scrollerRef}
			className="h-[120px] shrink-0 overflow-x-auto rounded-xl bg-amber-50 shadow-[inset_0_1px_8px_rgba(0,0,0,0.06)] dark:bg-muted"
			aria-label={timelineLabel}
		>
			<div className="relative h-full" style={{ width: scale.width, minWidth: '100%' }}>
				<div className="absolute inset-x-8 inset-y-0">
					<div
						className="pointer-events-none absolute top-[46px] right-0 left-0 h-px bg-foreground"
						aria-hidden="true"
					/>
					{scale.months.map((tick, index) => {
						const left = ((index + 0.5) / scale.months.length) * 100;
						const showYear = tick.month === 0 || index === 0;
						return (
							<div
								key={`${tick.year}-${tick.month}`}
								className="pointer-events-none absolute top-[38px] flex -translate-x-1/2 flex-col items-center"
								style={{ left: `${left}%` }}
							>
								<span className="h-4 w-px bg-foreground" />
								<span className="mt-2 text-[11px] font-medium tracking-wide whitespace-nowrap text-foreground">
									{formatMonthTick(tick.year, tick.month, lang, showYear)}
								</span>
							</div>
						);
					})}
					{stories.map((story) => {
						const left = timelinePosition(story.date, scale);
						const active = story.id === activeId;
						const showLabel = active || hoveredId === story.id;
						return (
							<button
								key={story.id}
								id={`timeline-node-${story.id}`}
								type="button"
								className="absolute top-[46px] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center border-0 bg-transparent p-0"
								style={{ left: `${left}%`, zIndex: active ? 3 : 2 }}
								aria-current={active ? 'true' : undefined}
								aria-label={`${story.title} — ${formatStoryDate(story.date, lang)}`}
								onClick={() => onSelect(story.id)}
								onMouseEnter={() => setHoveredId(story.id)}
								onMouseLeave={() => setHoveredId(null)}
								onFocus={() => setHoveredId(story.id)}
								onBlur={() => setHoveredId(null)}
							>
								{showLabel ? (
									<span className="absolute bottom-full mb-2 max-w-40 truncate rounded-md bg-white px-2 py-1 text-[11px] font-medium text-foreground shadow-md dark:bg-background dark:ring-1 dark:ring-border">
										{story.title} · {formatStoryDate(story.date, lang)}
										<span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-background" />
									</span>
								) : null}
								<MapPin active={active} />
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
