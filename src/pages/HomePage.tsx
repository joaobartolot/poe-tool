import { TradeCalculator } from '../features/trade-calculator/components/TradeCalculator';

export const HomePage = () => {
	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
			<header className="mb-6 space-y-2 sm:mb-8">
				<p className="text-sm font-medium uppercase tracking-widest text-palette-brand">
					Faustus
				</p>
				<h2 className="text-3xl font-bold text-palette-textStrong sm:text-4xl">
					Currency Calculator
				</h2>
				<p className="text-sm text-palette-textMuted sm:text-base">
					Quickly estimate efficient exchange paths for your Path of Exile trades.
				</p>
			</header>
			<TradeCalculator />
		</main>
	);
};
