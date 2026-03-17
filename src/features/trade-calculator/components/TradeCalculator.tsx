import { useMemo, useState, type ChangeEventHandler } from 'react';
import { NumberField } from './NumberField';
import { calculateTrade } from '../utils/tradeMath';

const INITIAL_VALUES = {
	wantRatio: '1.5',
	haveRatio: '1',
	inventory: '3',
};

export const TradeCalculator = () => {
	const [wantRatio, setWantRatio] = useState(INITIAL_VALUES.wantRatio);
	const [haveRatio, setHaveRatio] = useState(INITIAL_VALUES.haveRatio);
	const [inventory, setInventory] = useState(INITIAL_VALUES.inventory);

	const result = useMemo(
		() => calculateTrade({ wantRatio, haveRatio, inventory }),
		[wantRatio, haveRatio, inventory],
	);

	const handleChange =
		(
			setter: (value: string) => void,
		): ChangeEventHandler<HTMLInputElement> =>
		(event) => {
			setter(event.target.value);
		};

	return (
		<section className="space-y-6 rounded-2xl border border-palette-border bg-palette-surfaceElevated p-5 shadow-card sm:p-6">
			<header className="space-y-2">
				<h2 className="text-xl font-semibold text-palette-textStrong">
					Faustus trade helper
				</h2>
				<p className="text-sm text-palette-textMuted">
					Enter ratio and inventory. Values update instantly with
					whole-number trades only.
				</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-2">
				<NumberField
					id="wantRatio"
					label="I want (ratio)"
					value={wantRatio}
					onChange={handleChange(setWantRatio)}
					helpText="First number from the in-game ratio"
					placeholder="1"
				/>
				<NumberField
					id="haveRatio"
					label="I have (ratio)"
					value={haveRatio}
					onChange={handleChange(setHaveRatio)}
					helpText="Second number from the in-game ratio"
					placeholder="1"
				/>
			</div>

			<NumberField
				id="inventory"
				label="Inventory available"
				value={inventory}
				onChange={handleChange(setInventory)}
				helpText="Use a whole number because Faustus does not accept fractions"
				placeholder="673"
			/>

			<div className="rounded-xl border border-palette-border bg-palette-surface p-4">
				<p className="text-xs uppercase tracking-wide text-palette-textMuted">
					Use these values in game
				</p>
				<div className="mt-3 grid grid-cols-2 gap-3 text-center">
					<div className="rounded-lg bg-palette-bg p-3">
						<p className="text-xs text-palette-textMuted">I want</p>
						<p className="text-2xl font-semibold text-palette-textStrong">
							{result.receiveAmount.toString()}
						</p>
					</div>
					<div className="rounded-lg bg-palette-bg p-3">
						<p className="text-xs text-palette-textMuted">I have</p>
						<p className="text-2xl font-semibold text-palette-textStrong">
							{result.sellAmount.toString()}
						</p>
					</div>
				</div>

				<div className="mt-4 space-y-1 text-sm text-palette-textMuted">
					<p>
						Normalized ratio: {result.normalizedWant.toString()} :{' '}
						{result.normalizedHave.toString()}
					</p>
					<p>
						Leftover inventory: {result.leftoverAmount.toString()}
					</p>
					{result.message ? (
						<p className="font-medium text-palette-warning">
							{result.message}
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
};
