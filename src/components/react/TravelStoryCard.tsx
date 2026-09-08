import type { Lang } from '../../i18n/ui';
import {
	fillTemplate,
	formatStoryDateRange,
	type TravelJournalLabels,
	type TravelStory,
} from '../../lib/travelJournal';

type Props = {
	story: TravelStory;
	lang: Lang;
	labels: TravelJournalLabels;
	active: boolean;
};

function PinIcon() {
	return (
		<svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"
				stroke="currentColor"
				strokeWidth="1.75"
			/>
			<circle cx="12" cy="10" r="2.25" fill="currentColor" />
		</svg>
	);
}

function ClockIcon() {
	return (
		<svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
			<path d="M12 8v4.5l2.5 1.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
		</svg>
	);
}

function NotesIcon() {
	return (
		<svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M7 4.75h10A1.25 1.25 0 0 1 18.25 6v14L12 16.5 5.75 20V6A1.25 1.25 0 0 1 7 4.75z"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function PhotosIcon() {
	return (
		<svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="3.75" y="5.75" width="16.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
			<circle cx="9" cy="10" r="1.4" fill="currentColor" />
			<path d="M6 16.5l3.8-3.8 2.4 2.4 2.6-3.3L18 16.5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
		</svg>
	);
}

function VideosIcon() {
	return (
		<svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="3.75" y="6.5" width="11.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
			<path d="M15.25 10.2 20.25 8v8l-5-2.2v-3.6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
		</svg>
	);
}

function MapIcon() {
	return (
		<svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M8.5 5.5 3.75 7.25v11.5L8.5 17l7 1.75 4.75-1.75V5.5L15.5 7.25 8.5 5.5z"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinejoin="round"
			/>
			<path d="M8.5 5.5v11.5M15.5 7.25v11.5" stroke="currentColor" strokeWidth="1.75" />
		</svg>
	);
}

export default function TravelStoryCard({ story, lang, labels, active }: Props) {
	const dateLabel = formatStoryDateRange(story, lang);

	return (
		<article
			id={`story-${story.id}`}
			className={`scroll-mt-4 rounded-xl bg-white shadow-md transition-shadow dark:bg-background dark:ring-1 dark:ring-border ${
				active ? 'ring-2 ring-accent shadow-lg' : ''
			}`}
		>
			<div className="flex flex-col overflow-hidden md:flex-row">
				<a href={story.href} className="block shrink-0 md:w-[45%]">
					<img
						src={story.cover}
						alt=""
						className="h-48 w-full rounded-t-xl object-cover md:h-full md:min-h-52 md:rounded-l-xl md:rounded-tr-none"
					/>
				</a>
				<div className="flex flex-1 flex-col p-5">
					<h3 className="text-base font-bold tracking-wide uppercase">
						<a href={story.href} className="hover:text-accent">
							{story.title}
							<span className="text-muted-foreground font-semibold"> | {dateLabel}</span>
						</a>
					</h3>
					<ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
						<li className="flex items-center gap-2">
							<PinIcon />
							<span>{story.location}</span>
						</li>
						{story.durationDays ? (
							<li className="flex items-center gap-2">
								<ClockIcon />
								<span>{fillTemplate(labels.durationDays, { n: story.durationDays })}</span>
							</li>
						) : null}
						<li className="flex items-center gap-2">
							<NotesIcon />
							<span>{labels.tripNotes}</span>
						</li>
					</ul>
					<p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{story.notes}</p>
					<div className="mt-4 flex justify-end gap-1">
						{story.photoCount > 0 ? (
							<a
								href={story.href}
								className="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-accent"
								aria-label={labels.photos}
								title={labels.photos}
							>
								<PhotosIcon />
							</a>
						) : null}
						{story.videoCount > 0 ? (
							<a
								href={story.href}
								className="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-accent"
								aria-label={labels.videos}
								title={labels.videos}
							>
								<VideosIcon />
							</a>
						) : null}
						<a
							href={story.href}
							className="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-accent"
							aria-label={labels.map}
							title={labels.map}
						>
							<MapIcon />
						</a>
					</div>
				</div>
			</div>
		</article>
	);
}
