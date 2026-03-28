import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { StashWatcherPage } from './pages/StashWatcherPage';

type AppPage = 'calculator' | 'stash-watcher';

const NAV_ITEMS: Array<{ key: AppPage; label: string }> = [
	{ key: 'calculator', label: 'Currency Calculator' },
	{ key: 'stash-watcher', label: 'Stash Watcher' },
];

const App = () => {
	const [activePage, setActivePage] = useState<AppPage>('calculator');

	return (
		<div className="min-h-screen bg-palette-bg text-palette-textStrong">
			<header className="border-b border-palette-border bg-palette-surfaceElevated/80 backdrop-blur">
				<div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-palette-brand">
								Path of Exile
							</p>
							<h1 className="text-lg font-bold sm:text-xl">Trading Toolkit</h1>
						</div>
						<nav className="hidden items-center gap-2 sm:flex" aria-label="Main navigation">
							{NAV_ITEMS.map((item) => {
								const isActive = activePage === item.key;

								return (
									<button
										key={item.key}
										type="button"
										onClick={() => setActivePage(item.key)}
										className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
											isActive
												? 'bg-palette-brand text-white'
												: 'bg-transparent text-palette-textMuted hover:bg-palette-bg hover:text-palette-textStrong'
										}`}
										aria-current={isActive ? 'page' : undefined}
									>
										{item.label}
									</button>
								);
							})}
						</nav>
					</div>

					<div className="sm:hidden">
						<label htmlFor="mobile-page-nav" className="sr-only">
							Select a page
						</label>
						<select
							id="mobile-page-nav"
							value={activePage}
							onChange={(event) => setActivePage(event.target.value as AppPage)}
							className="w-full rounded-xl border border-palette-border bg-palette-surface px-3 py-2 text-sm font-medium text-palette-textStrong"
						>
							{NAV_ITEMS.map((item) => (
								<option key={item.key} value={item.key}>
									{item.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</header>

			{activePage === 'calculator' ? <HomePage /> : <StashWatcherPage />}
		</div>
	);
};

export default App;
