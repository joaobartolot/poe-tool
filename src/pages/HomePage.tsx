import { TradeCalculator } from '../features/trade-calculator/components/TradeCalculator';

export const HomePage = () => {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12">
			<header className="mb-6 space-y-2 sm:mb-8">
				<p className="text-sm font-medium uppercase tracking-widest text-palette-brand">
					Path of Exile
				</p>
				<h1 className="text-3xl font-bold text-palette-textStrong sm:text-4xl">
					Faustus Currency Calculator
				</h1>
			</header>
			<TradeCalculator />
		</main>
	);
};
