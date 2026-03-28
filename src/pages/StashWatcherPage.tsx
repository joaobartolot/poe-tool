const MOCK_ALERTS = [
	{ id: 1, item: 'Divine Orb', target: '>= 220 chaos', current: '214 chaos', status: 'Watching' },
	{ id: 2, item: 'Mirror Shard', target: '<= 31 divine', current: '33 divine', status: 'Waiting' },
	{ id: 3, item: 'Awakened Sextant', target: '>= 3 chaos', current: '3.2 chaos', status: 'Triggered' },
];

export const StashWatcherPage = () => {
	return (
		<main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
			<header className="mb-6 space-y-2 sm:mb-8">
				<p className="text-sm font-medium uppercase tracking-widest text-palette-brand">
					Mock Preview
				</p>
				<h2 className="text-3xl font-bold text-palette-textStrong sm:text-4xl">Stash Watcher</h2>
				<p className="text-sm text-palette-textMuted sm:text-base">
					Track stash tabs and get notified when item values hit your configured targets.
				</p>
			</header>

			<section className="rounded-2xl border border-palette-border bg-palette-surface p-4 shadow-sm sm:p-6">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
					<h3 className="text-lg font-semibold">Active Watch Rules</h3>
					<button
						type="button"
						className="rounded-full bg-palette-brand px-4 py-2 text-sm font-semibold text-white"
					>
						+ Create Rule
					</button>
				</div>

				<ul className="space-y-3">
					{MOCK_ALERTS.map((alert) => (
						<li
							key={alert.id}
							className="rounded-xl border border-palette-border bg-palette-surfaceElevated p-4"
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-base font-semibold text-palette-textStrong">{alert.item}</p>
									<p className="text-sm text-palette-textMuted">Target: {alert.target}</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-palette-textStrong">{alert.current}</p>
									<span
										className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
											alert.status === 'Triggered'
												? 'bg-green-100 text-green-800'
												: alert.status === 'Watching'
													? 'bg-blue-100 text-blue-800'
													: 'bg-amber-100 text-amber-800'
										}`}
									>
										{alert.status}
									</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
};
