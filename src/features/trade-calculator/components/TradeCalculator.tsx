import {
	useEffect,
	useMemo,
	useState,
	type ChangeEventHandler,
	type KeyboardEventHandler,
} from 'react';
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
	const [shouldAutoCopy, setShouldAutoCopy] = useState(true);
	const [copyStatus, setCopyStatus] = useState('');

	const result = useMemo(
		() => calculateTrade({ wantRatio, haveRatio, inventory }),
		[wantRatio, haveRatio, inventory],
	);

	const copyReceiveAmount = async () => {
		if (!result.canTrade) {
			setCopyStatus('Enter a valid trade before copying.');
			return;
		}

		if (!navigator.clipboard?.writeText) {
			setCopyStatus('Clipboard access is not available on this device.');
			return;
		}

		try {
			await navigator.clipboard.writeText(
				result.receiveAmount.toString(),
			);
			setCopyStatus(`Copied I want: ${result.receiveAmount.toString()}`);
		} catch {
			setCopyStatus('Clipboard permission was blocked.');
		}
	};

	useEffect(() => {
		if (
			!shouldAutoCopy ||
			!result.canTrade ||
			!navigator.clipboard?.writeText
		) {
			return;
		}

		void navigator.clipboard.writeText(result.receiveAmount.toString());
	}, [result.canTrade, result.receiveAmount, shouldAutoCopy]);

	const handleChange =
		(
			setter: (value: string) => void,
		): ChangeEventHandler<HTMLInputElement> =>
		(event) => {
			setter(event.target.value);
			setCopyStatus('');
		};

	const handleSwapRatios = () => {
		setWantRatio(haveRatio);
		setHaveRatio(wantRatio);
		setCopyStatus('');
	};

	const handleEnterKey = (
		nextFieldId?: string,
	): KeyboardEventHandler<HTMLInputElement> => {
		return (event) => {
			if (event.key !== 'Enter') {
				return;
			}

			event.preventDefault();

			const nextInput = nextFieldId
				? document.getElementById(nextFieldId)
				: null;

			if (nextInput instanceof HTMLInputElement) {
				nextInput.focus();
				nextInput.select();
				return;
			}

			if (!shouldAutoCopy) {
				void copyReceiveAmount();
			}
		};
	};

	return (
		<section className="space-y-6 rounded-2xl border border-palette-border bg-palette-surfaceElevated p-5 shadow-card sm:p-6">
			<header>
				<h2 className="text-xl font-semibold text-palette-textStrong">
					Faustus trade helper
				</h2>
			</header>

			<div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3">
				<NumberField
					id="wantRatio"
					label="I want (ratio)"
					value={wantRatio}
					onChange={handleChange(setWantRatio)}
					placeholder="1"
					onKeyDown={handleEnterKey('haveRatio')}
					enterKeyHint="next"
				/>
				<button
					type="button"
					onClick={handleSwapRatios}
					aria-label="Swap I want and I have ratios"
					className="mb-[0.125rem] inline-flex h-12 items-center justify-center rounded-xl border border-palette-border bg-palette-surface px-3 text-sm font-medium text-palette-textStrong shadow-sm transition hover:border-palette-brand hover:text-palette-brand focus:outline-none focus:ring-2 focus:ring-palette-brand/20"
				>
					Swap
				</button>
				<NumberField
					id="haveRatio"
					label="I have (ratio)"
					value={haveRatio}
					onChange={handleChange(setHaveRatio)}
					placeholder="1"
					onKeyDown={handleEnterKey('inventory')}
					enterKeyHint="next"
				/>
			</div>

			<NumberField
				id="inventory"
				label="Inventory available"
				value={inventory}
				onChange={handleChange(setInventory)}
				placeholder="673"
				onKeyDown={handleEnterKey()}
				enterKeyHint={shouldAutoCopy ? 'done' : 'go'}
			/>

			<label className="flex items-start gap-3 rounded-xl border border-palette-border bg-palette-surface p-4 text-sm text-palette-textStrong">
				<input
					type="checkbox"
					checked={shouldAutoCopy}
					onChange={(event) =>
						setShouldAutoCopy(event.target.checked)
					}
					className="mt-0.5 h-4 w-4 rounded border-palette-border text-palette-brand focus:ring-palette-brand"
				/>
				<span className="space-y-1">
					<span className="block font-medium">
						Always copy “I want”
					</span>
					<span className="block text-xs text-palette-textMuted">
						Copies the whole-number “I want” result to your
						clipboard as you type.
					</span>
				</span>
			</label>

			<div className="rounded-xl border border-palette-border bg-palette-surface p-4">
				<div className="grid grid-cols-2 gap-3 text-center">
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
					{copyStatus ? (
						<p className="font-medium text-palette-brand">
							{copyStatus}
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
};
